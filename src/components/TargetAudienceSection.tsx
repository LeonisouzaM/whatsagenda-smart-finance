import { GraduationCap, Briefcase, Brain } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Estudantes",
    subtitle: "Agenda de estudos + controle de gastos",
    description: "Organize seu cronograma de estudos com pausas estratégicas e mantenha controle total sobre seus gastos mensais.",
    benefits: ["Cronograma de estudos otimizado", "Controle de mesada/bolsa", "Alertas de gastos excessivos"]
  },
  {
    icon: Briefcase,
    title: "Freelancers",
    subtitle: "Organização do tempo + foco nos prazos",
    description: "Gerencie múltiplos projetos simultaneamente e mantenha suas finanças organizadas para um negócio sustentável.",
    benefits: ["Gestão de múltiplos projetos", "Controle de recebimentos", "Otimização de produtividade"]
  },
  {
    icon: Brain,
    title: "Pessoas com TDAH",
    subtitle: "Rotina adaptada e divisão em blocos curtos",
    description: "Rotinas especialmente projetadas com blocos de tempo menores e lembretes frequentes para manter o foco.",
    benefits: ["Blocos de tempo adaptativos", "Lembretes personalizados", "Estrutura clara e simples"]
  }
];

const TargetAudienceSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Feito especialmente para você
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soluções personalizadas que se adaptam ao seu estilo de vida e necessidades específicas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <audience.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {audience.title}
                </h3>
                <p className="text-primary font-medium">
                  {audience.subtitle}
                </p>
              </div>

              <p className="text-muted-foreground mb-6 text-center">
                {audience.description}
              </p>

              <div className="space-y-3">
                {audience.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;