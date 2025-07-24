import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  occupation: string;
  content: string;
  avatar_url?: string;
  rating: number;
  is_active: boolean;
  display_order: number;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async (active_only = false) => {
    try {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('display_order');

      if (active_only) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching testimonials:', error);
        return;
      }

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setTestimonials(prev => prev.map(testimonial => 
        testimonial.id === id ? { ...testimonial, ...updates } : testimonial
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    updateTestimonial,
    refetch: fetchTestimonials
  };
}