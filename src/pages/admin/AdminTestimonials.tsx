import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Star } from "lucide-react";

export function AdminTestimonials() {
  const { testimonials, updateTestimonial } = useTestimonials();
  const { toast } = useToast();
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

  const handleSave = async (testimonialData: any) => {
    const result = await updateTestimonial(testimonialData.id, testimonialData);

    if (result.success) {
      toast({
        title: "Depoimento salvo com sucesso!",
        description: "As alterações já estão visíveis na landing page."
      });
      setEditingTestimonial(null);
    } else {
      toast({
        title: "Erro ao salvar depoimento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Depoimentos</h1>
      </div>

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {testimonial.name}
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{testimonial.occupation}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingTestimonial(testimonial)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">{testimonial.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Status: {testimonial.is_active ? 'Ativo' : 'Inativo'}</span>
                  <span>Ordem: {testimonial.display_order}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingTestimonial && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Depoimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editingTestimonial.name || ''}
                onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="occupation">Ocupação</Label>
              <Input
                id="occupation"
                value={editingTestimonial.occupation || ''}
                onChange={(e) => setEditingTestimonial({...editingTestimonial, occupation: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="content">Depoimento</Label>
              <Textarea
                id="content"
                value={editingTestimonial.content || ''}
                onChange={(e) => setEditingTestimonial({...editingTestimonial, content: e.target.value})}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="avatar_url">URL da Foto</Label>
              <Input
                id="avatar_url"
                value={editingTestimonial.avatar_url || ''}
                onChange={(e) => setEditingTestimonial({...editingTestimonial, avatar_url: e.target.value})}
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Avaliação (1-5 estrelas)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={editingTestimonial.rating || 5}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, rating: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={editingTestimonial.display_order || 0}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, display_order: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editingTestimonial.is_active || false}
                onCheckedChange={(checked) => setEditingTestimonial({...editingTestimonial, is_active: checked})}
              />
              <Label htmlFor="is_active">Depoimento ativo</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleSave(editingTestimonial)}>
                Salvar Depoimento
              </Button>
              <Button variant="outline" onClick={() => setEditingTestimonial(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}