import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  Brain, 
  MessageSquare, 
  Shield, 
  Clock,
  FileText,
  AlertTriangle,
  Download,
  Star,
  Check,
  ArrowRight,
  Instagram,
  Facebook,
  Mail,
  MapPin
} from "lucide-react";
import { usePlans } from "@/hooks/usePlans";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useBlog } from "@/hooks/useBlog";
import { format } from "date-fns";

const Index = () => {
  const { plans } = usePlans();
  const { testimonials } = useTestimonials();
  const { posts } = useBlog();
  
  const publishedPosts = posts.filter(post => post.status === 'published').slice(0, 3);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary">Agendify</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection('inicio')} className="text-sm font-medium hover:text-primary transition-colors">
              Início
            </button>
            <button onClick={() => scrollToSection('funcionalidades')} className="text-sm font-medium hover:text-primary transition-colors">
              Funcionalidades
            </button>
            <button onClick={() => scrollToSection('planos')} className="text-sm font-medium hover:text-primary transition-colors">
              Planos
            </button>
            <button onClick={() => scrollToSection('avaliacoes')} className="text-sm font-medium hover:text-primary transition-colors">
              Avaliações
            </button>
            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>

          <Link to="/auth">
            <Button>Entrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Organize sua rotina e finanças com IA
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            O Agendify é seu assistente pessoal inteligente que ajuda você a planejar sua rotina 
            e organizar suas finanças através do WhatsApp e um painel web moderno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/5511999999999?text=Olá! Quero começar a usar o Agendify" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comece no WhatsApp
              </Button>
            </a>
            <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section id="funcionalidades" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo o que você precisa, num só lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades pensadas para otimizar sua rotina e organizar suas finanças de forma inteligente
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-xl">Agenda otimizada com foco</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Calendário inteligente com pausas automáticas e sugestões de horários baseadas em seu perfil de produtividade.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-xl">Análise de gastos com OCR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload de extratos bancários com leitura automática por IA. Categorização e análise inteligente de despesas.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-xl">Alertas inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notificações automáticas sobre despesas fora do padrão e sugestões para economizar dinheiro.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-xl">IA que aprende seus hábitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Inteligência artificial que observa seu comportamento e sugere melhorias personalizadas para sua rotina.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Download className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-xl">Exportação em PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Exporte sua agenda semanal e resumos financeiros em PDF para compartilhar ou arquivar.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-xl">Tudo pelo WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use todas as funcionalidades direto pelo WhatsApp, sem precisar instalar aplicativos adicionais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-lg text-muted-foreground">
              Comece gratuitamente ou desbloqueie todo o potencial com o Premium
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.sort((a, b) => a.display_order - b.display_order).map((plan) => (
              <Card key={plan.id} className={`relative ${plan.is_featured ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}>
                {plan.is_featured && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {plan.price_monthly === 0 ? 'Grátis' : `R$ ${plan.price_monthly?.toFixed(2)}`}
                    {plan.price_monthly > 0 && <span className="text-base font-normal text-muted-foreground">/mês</span>}
                  </div>
                  {plan.price_yearly > 0 && (
                    <p className="text-sm text-muted-foreground">
                      ou R$ {plan.price_yearly?.toFixed(2)}/ano (economize 40%)
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6">
                    <a 
                      href={plan.price_monthly === 0 
                        ? "https://wa.me/5511999999999?text=Quero começar com o plano Grátis!"
                        : "https://wa.me/5511999999999?text=Quero assinar o plano Premium!"
                      }
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button 
                        className={`w-full ${plan.is_featured ? 'bg-primary hover:bg-primary/90' : ''}`}
                        variant={plan.is_featured ? 'default' : 'outline'}
                      >
                        {plan.button_label}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avaliações Section */}
      <section id="avaliacoes" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Veja o que nossos usuários dizem
            </h2>
            <p className="text-lg text-muted-foreground">
              Histórias reais de pessoas que transformaram suas rotinas com o Agendify
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

      {/* Blog Preview Section */}
      {publishedPosts.length > 0 && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Últimas do Blog
              </h2>
              <p className="text-lg text-muted-foreground">
                Dicas e insights sobre produtividade e organização financeira
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {publishedPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                  <Link to={`/blog/${post.slug}`}>
                    {post.cover_image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={post.cover_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(post.created_at), 'dd/MM/yyyy')}
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                      <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-300">
                        Ler mais
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/blog">
                <Button variant="outline" size="lg">
                  Ver todos os posts
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para organizar sua vida?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já transformaram suas rotinas com o Agendify
          </p>
          <a 
            href="https://wa.me/5511999999999?text=Quero começar a usar o Agendify agora!"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <MessageSquare className="h-5 w-5 mr-2" />
              Começar no WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Políticas */}
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

            {/* Contato */}
            <div>
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contato
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://wa.me/5511999999999" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:suporte@agendify.app"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    suporte@agendify.app
                  </a>
                </li>
                <li className="text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Resposta em até 12h úteis
                </li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div>
              <h3 className="font-semibold text-lg mb-6">
                Redes Sociais
              </h3>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/agendify" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                </a>
                <a 
                  href="https://facebook.com/agendify" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
                >
                  <Facebook className="h-5 w-5 text-primary" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Agendify. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
