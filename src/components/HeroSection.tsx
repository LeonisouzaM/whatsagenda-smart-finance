import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, DollarSign, CheckSquare } from "lucide-react";
import heroImage from "@/assets/hero-agendify.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                <span className="text-primary">Agendify:</span> Organize sua rotina e finanças com IA, tudo pelo WhatsApp.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Envie seus compromissos, metas e extratos bancários. A IA monta sua agenda ideal, analisa seus gastos e sugere hábitos saudáveis.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => window.open('https://wa.me/5599999999999', '_blank')}
              >
                <MessageCircle className="mr-2" />
                Comece pelo WhatsApp
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Ver demonstração
              </Button>
            </div>

            {/* Mini benefits */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Agenda otimizada</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Controle financeiro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span>Hábitos saudáveis</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:order-last order-first">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Agendify - Organize sua rotina e finanças com IA via WhatsApp" 
                className="w-full h-auto max-w-lg mx-auto rounded-2xl shadow-large"
              />
            </div>
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-primary opacity-10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;