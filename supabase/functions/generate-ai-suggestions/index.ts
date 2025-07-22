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

interface SuggestionRequest {
  user_id: string;
  type?: 'expense_analysis' | 'budget_optimization' | 'spending_insights';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, type = 'expense_analysis' }: SuggestionRequest = await req.json();

    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's recent expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select(`
        *,
        categories(name)
      `)
      .eq('user_id', user_id)
      .gte('transaction_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('transaction_date', { ascending: false })
      .limit(50);

    if (!expenses || expenses.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        suggestions: [],
        message: 'Não há despesas suficientes para gerar sugestões'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const expensesSummary = expenses.map(exp => ({
      description: exp.description,
      amount: exp.amount,
      category: exp.categories?.name || 'Sem categoria',
      date: exp.transaction_date,
      payment_method: exp.payment_method
    }));

    const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const avgDaily = totalSpent / 30;

    let prompt = '';
    switch (type) {
      case 'expense_analysis':
        prompt = `
Analise os gastos dos últimos 30 dias deste usuário e gere sugestões personalizadas:

Total gasto: R$ ${totalSpent.toFixed(2)}
Média diária: R$ ${avgDaily.toFixed(2)}

Despesas detalhadas:
${JSON.stringify(expensesSummary, null, 2)}

Gere 3-5 sugestões específicas e acionáveis para otimizar os gastos. 
Para cada sugestão, inclua:
- Título claro e objetivo
- Descrição detalhada 
- Impacto financeiro estimado
- Prioridade (alta/média/baixa)

Responda APENAS com um JSON válido no formato:
{
  "suggestions": [
    {
      "title": "título da sugestão",
      "description": "descrição detalhada",
      "estimated_savings": número_valor_estimado,
      "priority": "alta|média|baixa",
      "category": "categoria_relacionada"
    }
  ]
}`;
        break;

      case 'budget_optimization':
        prompt = `
Com base nos gastos, sugira um orçamento otimizado por categoria:

${JSON.stringify(expensesSummary, null, 2)}

Gere sugestões de orçamento mensal por categoria com metas realistas.
Responda com JSON válido incluindo orçamento sugerido e dicas de economia.`;
        break;

      case 'spending_insights':
        prompt = `
Analise padrões de gastos e identifique insights importantes:

${JSON.stringify(expensesSummary, null, 2)}

Identifique padrões, tendências e alertas nos gastos.
Gere insights acionáveis sobre comportamento financeiro.`;
        break;
    }

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
            temperature: 0.3,
            maxOutputTokens: 1000,
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

    let aiResponse;
    try {
      const cleanJson = extractedText.replace(/```json\n?|\n?```/g, '').trim();
      aiResponse = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', extractedText);
      throw new Error('Invalid JSON response from AI');
    }

    // Save suggestions to database
    const suggestionsToInsert = aiResponse.suggestions?.map((suggestion: any) => ({
      user_id,
      type: 'ai_financial_insight',
      title: suggestion.title,
      description: suggestion.description,
      metadata: {
        estimated_savings: suggestion.estimated_savings,
        priority: suggestion.priority,
        category: suggestion.category,
        generated_at: new Date().toISOString(),
        analysis_type: type
      },
      priority: suggestion.priority === 'alta' ? 'high' : suggestion.priority === 'média' ? 'medium' : 'low',
      status: 'active'
    })) || [];

    if (suggestionsToInsert.length > 0) {
      const { error } = await supabase
        .from('ai_suggestions')
        .insert(suggestionsToInsert);

      if (error) {
        console.error('Error saving suggestions:', error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      suggestions: aiResponse.suggestions || [],
      analysis_summary: {
        total_expenses: expenses.length,
        total_spent: totalSpent,
        avg_daily: avgDaily,
        period: '30 days'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating AI suggestions:', error);
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