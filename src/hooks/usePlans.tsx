import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  benefits: string[];
  button_label: string;
  is_featured: boolean;
  display_order: number;
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('display_order');

      if (error) {
        console.error('Error fetching plans:', error);
        return;
      }

      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (id: string, updates: Partial<Plan>) => {
    try {
      const { error } = await supabase
        .from('plans')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setPlans(prev => prev.map(plan => 
        plan.id === id ? { ...plan, ...updates } : plan
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating plan:', error);
      return { success: false, error };
    }
  };

  const createPlan = async (planData: Omit<Plan, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;

      setPlans(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating plan:', error);
      return { success: false, error };
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPlans(prev => prev.filter(plan => plan.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting plan:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    updatePlan,
    createPlan,
    deletePlan,
    refetch: fetchPlans
  };
}