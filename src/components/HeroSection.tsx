import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-20">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Transforme seu{" "}
                <span className="text-primary">WhatsApp</span> em um{" "}
                <span className="text-primary">assistente virtual</span> com IA
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Automatize tarefas, ganhe produtividade e atenda seus clientes 24h por dia com inteligência artificial.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Entrar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg border-2"
              >
                Ver Demonstração
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Planos a partir de R$ 14,90/mês</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Right Column - WhatsApp Chat Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-3xl shadow-large p-4">
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Agentify Bot</h3>
                    <p className="text-xs text-green-500">online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 p-4">
                  <div className="bg-secondary rounded-2xl rounded-tl-md p-3 max-w-[80%]">
                    <p className="text-sm text-foreground">
                      Olá! Gostaria de agendar um horário para segunda-feira?
                    </p>
                  </div>

                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md p-3 max-w-[80%] ml-auto">
                    <p className="text-sm">
                      Sim, que horários tem disponível?
                    </p>
                  </div>

                  <div className="bg-secondary rounded-2xl rounded-tl-md p-3 max-w-[80%]">
                    <p className="text-sm text-foreground mb-2">Tenho disponível:</p>
                    <div className="space-y-1 text-sm text-foreground">
                      <p>• 09:00 - 10:00</p>
                      <p>• 14:00 - 15:00</p>
                      <p>• 16:30 - 17:30</p>
                    </div>
                    <p className="text-sm text-foreground mt-2">Qual prefere?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;