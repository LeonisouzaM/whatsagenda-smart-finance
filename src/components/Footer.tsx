import { MessageCircle, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">Agendify</h3>
            <p className="text-background/80 mb-4">
              Organize sua rotina e finanças com IA, tudo pelo WhatsApp.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => window.open('https://wa.me/5599999999999', '_blank')}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </button>
              <a
                href="mailto:suporte@agendify.app"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="h-5 w-5" />
                Email
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">Empresa</h4>
            <div className="space-y-2">
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Sobre nós
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Como funciona
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Preços
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Blog
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Termos de uso
              </a>
              <a href="#" className="block text-background/80 hover:text-background transition-colors">
                Política de privacidade
              </a>
              <a href="mailto:suporte@agendify.app" className="block text-background/80 hover:text-background transition-colors">
                Contato: suporte@agendify.app
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60">
            © 2024 Agendify. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;