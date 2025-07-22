import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Gemini API key not configured'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Test the connection with a simple query
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
              text: "Responda apenas 'OK' se você pode me ouvir."
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({
        success: false,
        error: 'Gemini API connection failed',
        details: errorData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();
    const geminiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

    return new Response(JSON.stringify({
      success: true,
      message: 'Gemini API connection successful',
      test_response: geminiResponse,
      api_response: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error testing Gemini connection:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);