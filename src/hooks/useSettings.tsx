import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Setting {
  name: string;
  value: string;
  category: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('name, value, category');

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.name] = setting.value || '';
        return acc;
      }, {} as Record<string, string>);

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (name: string, value: string, category: string = 'general') => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ name, value, category });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [name]: value }));
      return { success: true };
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false, error };
    }
  };

  const getSetting = (name: string, defaultValue: string = '') => {
    return settings[name] || defaultValue;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    getSetting,
    refetch: fetchSettings
  };
}