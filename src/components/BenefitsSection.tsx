import { MessageSquare, TrendingUp, Users, Calendar } from "lucide-react";

const benefits = [
  {
    icon: MessageSquare,
    title: "Respostas Automáticas com IA",
    description: "Atenda seus clientes 24/7 com respostas inteligentes e contextualizadas.",
  },
  {
    icon: TrendingUp,
    title: "Aumento da Produtividade",
    description: "Economize até 80% do tempo gasto em atendimentos repetitivos.",
  },
  {
    icon: Users,
    title: "Geração de Leads",
    description: "Qualifique leads automaticamente e aumente suas conversões.",
  },
  {
    icon: Calendar,
    title: "Agendamentos Inteligentes",
    description: "Agende consultas e reuniões sem intervenção manual.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher o Agentify?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Descubra como nossa inteligência artificial pode revolucionar seu atendimento
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;