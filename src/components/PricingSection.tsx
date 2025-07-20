import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Free Trial",
    price: "Grátis",
    period: "7 dias",
    description: "Teste todas as funcionalidades",
    features: [
      "Upload de 1 extrato",
      "1 rotina personalizada",
      "Suporte via WhatsApp",
      "Análise básica de gastos"
    ],
    cta: "Começar teste grátis",
    popular: false
  },
  {
    name: "Mensal",
    price: "R$ 24,90",
    period: "/mês",
    description: "Ideal para uso contínuo",
    features: [
      "Agenda e finanças ilimitadas",
      "Suporte WhatsApp prioritário",
      "Análises avançadas com IA",
      "Alertas inteligentes",
      "Relatórios detalhados",
      "Backup automático"
    ],
    cta: "Assinar agora",
    popular: true
  },
  {
    name: "Anual",
    price: "R$ 178,80",
    period: "/ano",
    description: "Economize 20% no plano anual",
    originalPrice: "R$ 298,80",
    features: [
      "Tudo do plano mensal",
      "2 meses grátis",
      "Suporte prioritário 24/7",
      "Exportação em PDF premium",
      "Insights preditivos avançados",
      "Acesso antecipado a novidades"
    ],
    cta: "Assinar com desconto",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planos e preços
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para transformar sua produtividade e organização financeira
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 ${
                plan.popular ? "ring-2 ring-primary shadow-glow" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Mais popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {plan.originalPrice}
                  </p>
                )}
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.popular ? "hero" : "outline"}
                className="w-full"
                size="lg"
                onClick={() => window.open('https://wa.me/5599999999999', '_blank')}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Todos os planos incluem garantia de 30 dias. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;