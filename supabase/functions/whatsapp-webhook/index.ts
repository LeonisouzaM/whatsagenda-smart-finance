import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface WhatsAppMessage {
  id: string;
  from: string;
  text?: {
    body: string;
  };
  type: string;
  timestamp: string;
}

interface WhatsAppWebhook {
  entry: Array<{
    changes: Array<{
      value: {
        messages?: WhatsAppMessage[];
        statuses?: any[];
        contacts?: any[];
      };
    }>;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'GET') {
      // Webhook verification
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      if (mode === 'subscribe' && token === 'your_verify_token') {
        return new Response(challenge, {
          status: 200,
          headers: corsHeaders
        });
      }

      return new Response('Verification failed', { 
        status: 403,
        headers: corsHeaders 
      });
    }

    if (req.method === 'POST') {
      const body: WhatsAppWebhook = await req.json();
      
      console.log('Received WhatsApp webhook:', JSON.stringify(body, null, 2));

      // Process incoming messages
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              await processWhatsAppMessage(message);
            }
          }
        }
      }

      return new Response('OK', {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

async function processWhatsAppMessage(message: WhatsAppMessage) {
  try {
    // Find user by phone number
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('phone', message.from)
      .single();

    if (!profile) {
      console.log(`User not found for phone: ${message.from}`);
      return;
    }

    // Log the message
    const { error } = await supabase
      .from('whatsapp_logs')
      .insert({
        user_id: profile.user_id,
        message_type: message.type,
        content: message.text?.body || '',
        has_file: message.type !== 'text',
        processed: false
      });

    if (error) {
      console.error('Error logging WhatsApp message:', error);
    }

    // Process text messages for expense tracking
    if (message.type === 'text' && message.text?.body) {
      await processExpenseMessage(profile.user_id, message.text.body);
    }

  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
  }
}

async function processExpenseMessage(userId: string, messageText: string) {
  try {
    // Call Gemini to extract expense data
    const response = await fetch(`${supabaseUrl}/functions/v1/process-expense-with-ai`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        message: messageText,
        source: 'whatsapp'
      })
    });

    if (!response.ok) {
      console.error('Failed to process expense with AI');
    }

  } catch (error) {
    console.error('Error processing expense message:', error);
  }
}

serve(handler);