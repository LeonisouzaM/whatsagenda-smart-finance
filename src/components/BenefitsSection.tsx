import { Calendar, Upload, Bell, Lightbulb, MessageCircle, BarChart3 } from "lucide-react";

const benefits = [
  {
    icon: Calendar,
    title: "Agenda otimizada com foco e pausas",
    description: "IA cria cronogramas personalizados respeitando seus limites e preferências"
  },
  {
    icon: Upload,
    title: "Controle de gastos com upload de extratos",
    description: "Envie fotos de extratos e receba análises detalhadas automaticamente"
  },
  {
    icon: Bell,
    title: "Alertas inteligentes de despesas anormais",
    description: "Seja notificado sobre gastos fora do padrão em tempo real"
  },
  {
    icon: Lightbulb,
    title: "Sugestões automáticas de ajustes na rotina",
    description: "Receba dicas personalizadas para otimizar seu tempo e produtividade"
  },
  {
    icon: MessageCircle,
    title: "Funciona via WhatsApp sem apps extras",
    description: "Tudo pelo aplicativo que você já usa todos os dias"
  },
  {
    icon: BarChart3,
    title: "Relatórios inteligentes de progresso",
    description: "Acompanhe sua evolução com dados claros e insights acionáveis"
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher o Agendify?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma solução completa que combina organização pessoal e controle financeiro em uma única ferramenta
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gradient-card p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;