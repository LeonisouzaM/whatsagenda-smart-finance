import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlog } from "@/hooks/useBlog";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export function Blog() {
  const { posts, loading } = useBlog();

  const publishedPosts = posts.filter(post => post.status === 'published');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Blog do Agendify
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dicas e insights sobre produtividade, organização financeira e inteligência artificial
          </p>
        </div>

        {publishedPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-8">
              Em breve teremos conteúdos incríveis para você!
            </p>
            <Link to="/" className="text-primary hover:underline">
              ← Voltar para a página inicial
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Link to={`/blog/${post.slug}`}>
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(post.created_at), 'dd/MM/yyyy')}
                      <Badge variant="outline" className="ml-auto">
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-300">
                      Ler mais
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}