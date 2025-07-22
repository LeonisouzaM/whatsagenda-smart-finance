import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');
const whatsappNumberId = Deno.env.get('WHATSAPP_NUMBER_ID');

interface WhatsAppMessageRequest {
  to: string;
  message: string;
  type?: 'text' | 'template';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, type = 'text' }: WhatsAppMessageRequest = await req.json();

    if (!whatsappApiKey || !whatsappNumberId) {
      return new Response(JSON.stringify({ 
        error: 'WhatsApp API credentials not configured' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const phoneNumber = to.replace(/\D/g, ''); // Remove non-digits

    const messagePayload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        body: message
      }
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${whatsappNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API error:', result);
      throw new Error(result.error?.message || 'Failed to send message');
    }

    return new Response(JSON.stringify({
      success: true,
      message_id: result.messages?.[0]?.id,
      status: 'sent'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
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