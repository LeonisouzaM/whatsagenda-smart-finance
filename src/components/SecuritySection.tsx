import { Shield, Lock, Users, Clock } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "Criptografia ponta a ponta",
    description: "Todas as suas informações são criptografadas com os mais altos padrões de segurança"
  },
  {
    icon: Lock,
    title: "Compliance com LGPD",
    description: "Totalmente adequado à Lei Geral de Proteção de Dados brasileira"
  },
  {
    icon: Users,
    title: "Armazenamento seguro",
    description: "Seus dados ficam protegidos em servidores certificados e auditados"
  },
  {
    icon: Clock,
    title: "Suporte 24/7",
    description: "Equipe especializada disponível para ajudar a qualquer momento"
  }
];

const SecuritySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Segurança e privacidade
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seus dados pessoais e financeiros protegidos com a mais alta tecnologia de segurança
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-card rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-primary-light/50 p-6 rounded-xl inline-block">
            <p className="text-foreground font-medium">
              🔒 Certificado SSL • 🛡️ Auditoria de segurança • 📋 LGPD compliant • ⚡ Backup automático
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;