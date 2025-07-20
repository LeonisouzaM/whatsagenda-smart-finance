import { Target, Scan, TrendingUp, FileText } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Algoritmo de otimização baseado em prioridades e metas",
    description: "Sistema inteligente que organiza seu tempo baseado no que realmente importa para você, equilibrando trabalho, estudos e vida pessoal."
  },
  {
    icon: Scan,
    title: "Classificação automática de gastos via OCR + IA",
    description: "Tecnologia avançada de reconhecimento ótico que lê seus extratos e categoriza automaticamente cada transação com precisão."
  },
  {
    icon: TrendingUp,
    title: "Inteligência preditiva para hábitos",
    description: "Durante o mês, nossa IA aprende seus padrões comportamentais e prevê tendências para sugerir melhorias proativas."
  },
  {
    icon: FileText,
    title: "Exportação de resumo/agenda em PDF",
    description: "Gere relatórios profissionais de sua agenda e finanças para compartilhar ou arquivar (funcionalidade premium)."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Funcionalidades avançadas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tecnologia de ponta para transformar sua produtividade e organização financeira
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-6 p-6 bg-gradient-card rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;