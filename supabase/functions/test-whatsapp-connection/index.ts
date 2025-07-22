import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');
const whatsappNumberId = Deno.env.get('WHATSAPP_NUMBER_ID');

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!whatsappApiKey || !whatsappNumberId) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'WhatsApp API credentials not configured',
        details: {
          has_api_key: !!whatsappApiKey,
          has_number_id: !!whatsappNumberId
        }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Test the connection by making a simple API call
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${whatsappNumberId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${whatsappApiKey}`,
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: 'WhatsApp API connection failed',
        details: result
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'WhatsApp API connection successful',
      phone_number_info: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error testing WhatsApp connection:', error);
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