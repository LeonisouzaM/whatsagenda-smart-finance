import { Smartphone, Settings, Zap, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Conecte o WhatsApp",
    description: "Integre seu WhatsApp Business em segundos com nossa API segura.",
  },
  {
    icon: Settings,
    title: "Configure a IA",
    description: "Personalize respostas automáticas e fluxos de conversação inteligentes.",
  },
  {
    icon: Zap,
    title: "Automatize Tudo",
    description: "Deixe a IA cuidar dos atendimentos, agendamentos e follow-ups.",
  },
  {
    icon: BarChart3,
    title: "Veja os Resultados",
    description: "Acompanhe métricas, leads gerados e produtividade em tempo real.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como Funciona?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Em poucos passos, transforme seu WhatsApp em uma poderosa ferramenta de automação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;