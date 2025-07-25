import { Building2, Wrench, Megaphone, User } from "lucide-react";

const audiences = [
  {
    icon: Building2,
    title: "Pequenas Empresas",
    subtitle: "Escale seu atendimento",
    description: "Otimize o atendimento ao cliente e aumente as vendas sem contratar mais funcionários.",
    benefits: [
      "Atendimento 24/7 automatizado",
      "Redução de custos operacionais",
      "Aumento na satisfação do cliente"
    ]
  },
  {
    icon: Wrench,
    title: "Prestadores de Serviço",
    subtitle: "Automatize processos",
    description: "Automatize agendamentos, confirmações e follow-ups de serviços.",
    benefits: [
      "Agendamentos automáticos",
      "Confirmações inteligentes",
      "Follow-ups personalizados"
    ]
  },
  {
    icon: Megaphone,
    title: "Agências de Marketing",
    subtitle: "Gerencie múltiplos clientes",
    description: "Gerencie múltiplos clientes com automação personalizada para cada um.",
    benefits: [
      "Gestão multi-cliente",
      "Automação personalizada",
      "Relatórios detalhados"
    ]
  },
  {
    icon: User,
    title: "Autônomos",
    subtitle: "Profissionalize seu atendimento",
    description: "Profissionalize seu atendimento e tenha mais tempo para focar no core business.",
    benefits: [
      "Atendimento profissional",
      "Mais tempo livre",
      "Foco no negócio principal"
    ]
  }
];

const TargetAudienceSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Para quem é o Agentify?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nossa solução é perfeita para profissionais que querem escalar seus negócios
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <audience.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {audience.title}
              </h3>
              
              <p className="text-sm text-primary font-medium mb-3">
                {audience.subtitle}
              </p>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {audience.description}
              </p>
              
              <ul className="space-y-2">
                {audience.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;