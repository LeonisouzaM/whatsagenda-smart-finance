import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useWhatsApp() {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (to: string, message: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
        body: { to, message }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Mensagem enviada com sucesso!');
        return data;
      } else {
        throw new Error(data.error || 'Falha ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      toast.error('Erro ao enviar mensagem WhatsApp');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-whatsapp-connection');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao testar conexão WhatsApp:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    testConnection,
    loading
  };
}