import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAI() {
  const [loading, setLoading] = useState(false);

  const processExpenseWithAI = async (message: string, userId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-expense-with-ai', {
        body: { 
          user_id: userId,
          message,
          source: 'manual'
        }
      });

      if (error) throw error;

      if (data.success) {
        if (data.expense_created) {
          toast.success('Despesa criada automaticamente com IA!');
        } else {
          toast.info('IA analisou a mensagem mas não identificou uma despesa válida');
        }
        return data;
      } else {
        throw new Error(data.error || 'Falha ao processar com IA');
      }
    } catch (error) {
      console.error('Erro ao processar despesa com IA:', error);
      toast.error('Erro ao processar despesa com IA');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async (userId: string, type: 'expense_analysis' | 'budget_optimization' | 'spending_insights' = 'expense_analysis') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-suggestions', {
        body: { user_id: userId, type }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`${data.suggestions.length} sugestões geradas com IA!`);
        return data;
      } else {
        throw new Error(data.error || 'Falha ao gerar sugestões');
      }
    } catch (error) {
      console.error('Erro ao gerar sugestões com IA:', error);
      toast.error('Erro ao gerar sugestões com IA');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const testGeminiConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-gemini-connection');

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao testar conexão Gemini:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    processExpenseWithAI,
    generateSuggestions,
    testGeminiConnection,
    loading
  };
}