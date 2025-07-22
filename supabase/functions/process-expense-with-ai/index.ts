import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

interface ExpenseRequest {
  user_id: string;
  message: string;
  source: 'whatsapp' | 'manual';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, message, source }: ExpenseRequest = await req.json();

    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get categories for context
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');

    const categoriesText = categories?.map(c => `${c.id}: ${c.name}`).join(', ') || '';

    const prompt = `
Analise esta mensagem de despesa e extraia as informações estruturadas.
Mensagem: "${message}"

Categorias disponíveis: ${categoriesText}

Responda APENAS com um JSON válido no seguinte formato:
{
  "description": "descrição da despesa",
  "amount": número_valor,
  "category_id": "uuid_da_categoria_mais_apropriada",
  "payment_method": "dinheiro|cartao_credito|cartao_debito|pix|transferencia",
  "transaction_date": "YYYY-MM-DD",
  "confidence": número_entre_0_e_1,
  "is_expense": boolean
}

Se não conseguir identificar uma despesa válida, retorne:
{
  "is_expense": false,
  "confidence": 0
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const geminiResult = await response.json();
    const extractedText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!extractedText) {
      throw new Error('No response from Gemini');
    }

    let expenseData;
    try {
      // Remove markdown formatting if present
      const cleanJson = extractedText.replace(/```json\n?|\n?```/g, '').trim();
      expenseData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', extractedText);
      throw new Error('Invalid JSON response from AI');
    }

    // If AI identified an expense with good confidence, create it
    if (expenseData.is_expense && expenseData.confidence > 0.6) {
      const { error: insertError } = await supabase
        .from('expenses')
        .insert({
          user_id,
          description: expenseData.description,
          amount: expenseData.amount,
          category_id: expenseData.category_id,
          payment_method: expenseData.payment_method,
          transaction_date: expenseData.transaction_date,
          ai_categorized: true
        });

      if (insertError) {
        console.error('Error inserting expense:', insertError);
        throw new Error('Failed to save expense');
      }

      // Create AI suggestion for review
      await supabase
        .from('ai_suggestions')
        .insert({
          user_id,
          type: 'expense_extraction',
          title: 'Despesa criada via WhatsApp',
          description: `Nova despesa: ${expenseData.description} - R$ ${expenseData.amount}`,
          metadata: {
            source,
            original_message: message,
            extracted_data: expenseData,
            confidence: expenseData.confidence
          },
          status: 'active',
          priority: expenseData.confidence > 0.8 ? 'high' : 'medium'
        });
    }

    return new Response(JSON.stringify({
      success: true,
      expense_created: expenseData.is_expense && expenseData.confidence > 0.6,
      extracted_data: expenseData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in process-expense-with-ai:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);