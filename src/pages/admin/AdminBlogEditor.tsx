import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBlog } from "@/hooks/useBlog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

export function AdminBlogEditor() {
  const { posts, createPost, updatePost, deletePost } = useBlog();
  const { toast } = useToast();
  const [editingPost, setEditingPost] = useState<any>(null);

  const handleSave = async (postData: any) => {
    const result = editingPost?.id 
      ? await updatePost(editingPost.id, postData)
      : await createPost(postData);

    if (result.success) {
      toast({
        title: "Post salvo com sucesso!",
        description: "O post está disponível no blog."
      });
      setEditingPost(null);
    } else {
      toast({
        title: "Erro ao salvar post",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Editor de Blog</h1>
        <Button onClick={() => setEditingPost({})}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(post.created_at), 'dd/MM/yyyy')} • {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                </p>
              </div>
              <div className="flex gap-2">
                {post.status === 'published' && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/blog/${post.slug}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deletePost(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {editingPost && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPost.id ? 'Editar Post' : 'Novo Post'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={editingPost.title || ''}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={editingPost.slug || ''}
                onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                placeholder="meu-post-exemplo"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={editingPost.category || ''}
                onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                placeholder="Produtividade"
              />
            </div>

            <div>
              <Label htmlFor="cover_image">URL da Imagem de Capa</Label>
              <Input
                id="cover_image"
                value={editingPost.cover_image || ''}
                onChange={(e) => setEditingPost({...editingPost, cover_image: e.target.value})}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                rows={10}
                placeholder="Escreva o conteúdo do post aqui..."
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={editingPost.status || 'draft'} 
                onValueChange={(value) => setEditingPost({...editingPost, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleSave(editingPost)}>
                Salvar Post
              </Button>
              <Button variant="outline" onClick={() => setEditingPost(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}