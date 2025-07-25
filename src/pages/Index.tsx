import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Mail, 
  Check,
  Star,
  Menu,
  X,
  ArrowRight,
  Instagram,
  Facebook,
  Shield
} from "lucide-react";
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import BenefitsSection from '@/components/BenefitsSection';
import TargetAudienceSection from '@/components/TargetAudienceSection';
import { usePlans } from '@/hooks/usePlans';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useBlog } from '@/hooks/useBlog';
import { Link } from 'react-router-dom';
import { format } from "date-fns";

const Index = () => {
  const { plans } = usePlans();
  const { testimonials } = useTestimonials();
  const { posts } = useBlog();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const publishedPosts = posts.filter(post => post.status === 'published').slice(0, 3);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Agentify</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('como-funciona')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Como Funciona
              </button>
              <button 
                onClick={() => scrollToSection('beneficios')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Benefícios
              </button>
              <button 
                onClick={() => scrollToSection('planos')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Planos
              </button>
              <Link 
                to="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Blog
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button 
                variant="default" 
                className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => window.open('/auth', '_blank')}
              >
                Entrar
              </Button>
              
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <nav className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={() => scrollToSection('como-funciona')}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  Como Funciona
                </button>
                <button 
                  onClick={() => scrollToSection('beneficios')}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  Benefícios
                </button>
                <button 
                  onClick={() => scrollToSection('planos')}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  Planos
                </button>
                <Link 
                  to="/blog"
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Button 
                  variant="default" 
                  className="w-fit mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    window.open('/auth', '_blank');
                    setIsMenuOpen(false);
                  }}
                >
                  Entrar
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio">
        <HeroSection />
      </section>

      {/* Como Funciona */}
      <section id="como-funciona">
        <HowItWorksSection />
      </section>

      {/* Benefícios */}
      <section id="beneficios">
        <BenefitsSection />
      </section>

      {/* Para quem é */}
      <TargetAudienceSection />

      {/* Planos Section */}
      <section id="planos" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja como o Agentify está transformando negócios
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                    {testimonial.avatar_url ? (
                      <img 
                        src={testimonial.avatar_url} 
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.occupation}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Políticas
              </h3>
              <ul className="space-y-3">
                <li><Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link></li>
                <li><Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link to="/lgpd" className="text-muted-foreground hover:text-primary transition-colors">LGPD e Segurança</Link></li>
                <li><Link to="/cancelamento" className="text-muted-foreground hover:text-primary transition-colors">Cancelamento e Reembolsos</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">Contato</h3>
              <div className="space-y-4">
                <a href="https://wa.me/5511999999999" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
                <a href="mailto:suporte@agentify.app" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                  <span>suporte@agentify.app</span>
                </a>
                <p className="text-sm text-muted-foreground">Tempo de resposta: até 12h úteis</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">Redes Sociais</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 Agentify. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;