-- Add is_admin field to profiles table
ALTER TABLE public.profiles ADD COLUMN is_admin boolean DEFAULT false;

-- Create settings table for system configuration
CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  value text,
  category text DEFAULT 'general',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Only admins can access settings
CREATE POLICY "Only admins can manage settings"
ON public.settings
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.is_admin = true
));

-- Create trigger for settings updated_at
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (name, value, category) VALUES
('whatsapp_api_key', '', 'apis'),
('whatsapp_number_id', '', 'apis'),
('gemini_api_key', '', 'apis'),
('facebook_pixel', '', 'tracking'),
('google_analytics', '', 'tracking'),
('tiktok_pixel', '', 'tracking');