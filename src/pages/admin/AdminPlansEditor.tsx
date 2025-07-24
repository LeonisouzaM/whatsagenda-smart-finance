import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { usePlans } from "@/hooks/usePlans";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

export function AdminPlansEditor() {
  const { plans, updatePlan, createPlan, deletePlan } = usePlans();
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const handleSave = async (planData: any) => {
    const result = editingPlan?.id 
      ? await updatePlan(editingPlan.id, planData)
      : await createPlan(planData);

    if (result.success) {
      toast({
        title: "Plano salvo com sucesso!",
        description: "As alterações já estão visíveis na landing page."
      });
      setEditingPlan(null);
    } else {
      toast({
        title: "Erro ao salvar plano",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Editor de Planos</h1>
        <Button onClick={() => setEditingPlan({})}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <div className="grid gap-6">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingPlan(plan)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deletePlan(plan.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Preço Mensal:</strong> R$ {plan.price_monthly?.toFixed(2)}</p>
                  <p><strong>Preço Anual:</strong> R$ {plan.price_yearly?.toFixed(2)}</p>
                  <p><strong>Destaque:</strong> {plan.is_featured ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <p><strong>Benefícios:</strong></p>
                  <ul className="list-disc list-inside text-sm">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingPlan && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPlan.id ? 'Editar Plano' : 'Novo Plano'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={editingPlan.name || ''}
                onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_monthly">Preço Mensal</Label>
                <Input
                  id="price_monthly"
                  type="number"
                  step="0.01"
                  value={editingPlan.price_monthly || 0}
                  onChange={(e) => setEditingPlan({...editingPlan, price_monthly: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="price_yearly">Preço Anual</Label>
                <Input
                  id="price_yearly"
                  type="number"
                  step="0.01"
                  value={editingPlan.price_yearly || 0}
                  onChange={(e) => setEditingPlan({...editingPlan, price_yearly: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="benefits">Benefícios (um por linha)</Label>
              <Textarea
                id="benefits"
                value={(editingPlan.benefits || []).join('\n')}
                onChange={(e) => setEditingPlan({...editingPlan, benefits: e.target.value.split('\n').filter(b => b.trim())})}
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={editingPlan.is_featured || false}
                onCheckedChange={(checked) => setEditingPlan({...editingPlan, is_featured: checked})}
              />
              <Label htmlFor="is_featured">Plano em destaque</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleSave(editingPlan)}>
                Salvar Plano
              </Button>
              <Button variant="outline" onClick={() => setEditingPlan(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}