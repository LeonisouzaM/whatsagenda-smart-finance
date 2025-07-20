import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "O que é o Agendify?",
    answer: "O Agendify é uma solução completa que combina organização de rotina com controle financeiro, tudo via WhatsApp. Nossa IA analisa seus extratos bancários e objetivos para criar agendas personalizadas e alertas inteligentes."
  },
  {
    question: "Preciso instalar algum app?",
    answer: "Não! O Agendify funciona inteiramente pelo WhatsApp, o aplicativo que você já usa todos os dias. Basta adicionar nosso número e começar a enviar suas informações."
  },
  {
    question: "Como funciona o plano gratuito?",
    answer: "O teste gratuito de 7 dias permite que você experimente todas as funcionalidades: pode enviar 1 extrato bancário, receber 1 rotina personalizada e ter acesso ao suporte via WhatsApp para conhecer todo o potencial da plataforma."
  },
  {
    question: "Como posso cancelar minha assinatura?",
    answer: "Você pode cancelar a qualquer momento enviando uma mensagem no WhatsApp ou através do nosso suporte. Não há taxas de cancelamento e você continuará tendo acesso até o fim do período pago."
  },
  {
    question: "Meus dados ficam seguros?",
    answer: "Sim! Utilizamos criptografia ponta a ponta, estamos em compliance total com a LGPD e seus dados são armazenados em servidores certificados. Nunca compartilhamos suas informações pessoais ou financeiras."
  },
  {
    question: "Posso usar em mais de um celular?",
    answer: "Sim, você pode acessar o Agendify de qualquer dispositivo usando o mesmo número de WhatsApp. Todos os seus dados e conversas ficam sincronizados automaticamente."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre o Agendify e descubra como ele pode transformar sua rotina
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-soft px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ainda tem dúvidas?
          </p>
          <button
            onClick={() => window.open('https://wa.me/5599999999999', '_blank')}
            className="text-primary hover:text-primary/80 font-medium underline"
          >
            Fale conosco no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;