import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlog } from "@/hooks/useBlog";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug } = useBlog();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        const data = await getPostBySlug(slug);
        setPost(data as BlogPost);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, getPostBySlug]);

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

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O post que você está procurando não existe ou foi removido.
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {post.cover_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img 
                src={post.cover_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.created_at), 'dd/MM/yyyy')}
              <Badge variant="outline" className="ml-2">
                {post.category}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {post.title}
            </h1>
          </header>

          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-16 pt-8 border-t">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                Gostou do conteúdo?
              </h3>
              <p className="text-muted-foreground mb-6">
                Experimente o Agendify e organize sua rotina com inteligência artificial!
              </p>
              <Link to="/">
                <Button size="lg">
                  Começar gratuitamente
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}