-- Create plans table for dynamic plan management
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  benefits TEXT[] NOT NULL DEFAULT '{}',
  button_label TEXT NOT NULL DEFAULT 'Assinar',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table for blog functionality
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cover_image TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Geral',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  occupation TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- RLS policies for plans (public read, admin write)
CREATE POLICY "Everyone can view published plans" 
ON public.plans 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage plans" 
ON public.plans 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND is_admin = true
));

-- RLS policies for blog_posts (public read published, admin write)
CREATE POLICY "Everyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Only admins can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND is_admin = true
));

-- RLS policies for testimonials (public read active, admin write)
CREATE POLICY "Everyone can view active testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage testimonials" 
ON public.testimonials 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND is_admin = true
));

-- Create triggers for updated_at
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.plans (name, price_monthly, price_yearly, benefits, button_label, is_featured, display_order) VALUES
('Essencial', 0, 0, ARRAY[
  '1 rotina e 1 extrato por semana',
  'Suporte por e-mail',
  'Acesso via WhatsApp'
], 'Comece grátis', false, 1),
('Premium', 24.90, 178.80, ARRAY[
  'Rotinas e extratos ilimitados',
  'Análises e alertas personalizados',
  'Exportação em PDF',
  'Suporte 24h no WhatsApp'
], 'Assinar agora', true, 2);

-- Insert sample testimonials
INSERT INTO public.testimonials (name, occupation, content, rating, display_order) VALUES
('Carla Menezes', 'Estudante', 'Antes, eu vivia perdida com horários. O Agendify organizou minha rotina de um jeito que nenhum app conseguiu!', 5, 1),
('João Silva', 'Empreendedor', 'O controle financeiro via WhatsApp mudou minha vida. Agora sei exatamente onde meu dinheiro está indo.', 5, 2),
('Maria Santos', 'Professora', 'A IA realmente aprendeu meus hábitos e me ajuda a ser mais produtiva. Recomendo para todos!', 5, 3);