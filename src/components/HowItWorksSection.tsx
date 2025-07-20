import { Upload, Brain, Smartphone } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Envie fotos ou PDFs de extratos e seus objetivos/metas",
    description: "Simplesmente fotografe seus extratos bancários ou envie PDFs. Compartilhe também suas metas e objetivos pessoais."
  },
  {
    icon: Brain,
    title: "Receba sua agenda semanal + resumo financeiro via WhatsApp",
    description: "Nossa IA processa todas as informações e cria uma agenda otimizada junto com um resumo completo dos seus gastos."
  },
  {
    icon: Smartphone,
    title: "Receba alertas e sugestões personalizadas conforme seu comportamento",
    description: "Com base no seu padrão de uso, receba notificações inteligentes e dicas para melhorar sua rotina e finanças."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Em apenas 3 etapas simples, você tem controle total sobre sua rotina e finanças
          </p>
        </div>

        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step number and connector */}
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-border ml-6"></div>
                )}
              </div>

              {/* Content */}
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;