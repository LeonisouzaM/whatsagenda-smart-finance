import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marina",
    role: "Estudante",
    content: "Agendify me fez parar de procrastinar e cuidar do meu dinheiro ao mesmo tempo.",
    rating: 5,
    avatar: "M"
  },
  {
    name: "Lucas",
    role: "Freelancer",
    content: "Tudo pela agenda via WhatsApp. Simples e eficiente!",
    rating: 5,
    avatar: "L"
  },
  {
    name: "Joana",
    role: "Autônoma",
    content: "Controlar meus gastos e meu tempo nunca foi tão fácil.",
    rating: 5,
    avatar: "J"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos usuários dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Histórias reais de pessoas que transformaram sua produtividade e organização financeira
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-card p-6 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 relative"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-foreground mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;