import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Brain, MessageSquare, Shield, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary">Agendify</span>
          </div>
          <Link to="/auth">
            <Button>Entrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Organize sua rotina e finanças com IA
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            O Agendify é seu assistente pessoal inteligente que ajuda você a planejar sua rotina 
            e organizar suas finanças através do WhatsApp e um painel web moderno.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8">
                Começar Gratuitamente
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Funcionalidades Principais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Agenda Inteligente</CardTitle>
                <CardDescription>
                  Calendário com IA que otimiza sua rotina automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Organize seus compromissos com sugestões personalizadas da IA para maximizar sua produtividade.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Finanças Inteligentes</CardTitle>
                <CardDescription>
                  Controle financeiro com categorização automática
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload de extratos com OCR e categorização automática. Gráficos e insights para suas finanças.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>WhatsApp Integrado</CardTitle>
                <CardDescription>
                  Gerencie tudo direto do seu WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Converse com a IA pelo WhatsApp para adicionar tarefas, registrar gastos e receber lembretes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Sugestões da IA</CardTitle>
                <CardDescription>
                  Insights personalizados para otimização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receba sugestões inteligentes para melhorar sua rotina e economizar dinheiro.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Segurança Total</CardTitle>
                <CardDescription>
                  Seus dados protegidos com criptografia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Utilizamos as melhores práticas de segurança para proteger suas informações pessoais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Disponível 24/7</CardTitle>
                <CardDescription>
                  Acesso completo a qualquer hora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use o painel web ou WhatsApp a qualquer momento, em qualquer lugar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para organizar sua vida?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comece gratuitamente e transforme sua rotina em apenas alguns cliques.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Agendify. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
