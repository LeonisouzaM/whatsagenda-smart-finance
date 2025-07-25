import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { FileText, Shield, Scale, CreditCard } from "lucide-react";

export function AdminPolicies() {
  const { settings, updateSetting, loading } = useSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [policies, setPolicies] = useState({
    privacy_policy: settings.privacy_policy || '',
    terms_of_use: settings.terms_of_use || '',
    lgpd_compliance: settings.lgpd_compliance || '',
    refund_policy: settings.refund_policy || ''
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [
        updateSetting('privacy_policy', policies.privacy_policy, 'legal'),
        updateSetting('terms_of_use', policies.terms_of_use, 'legal'),
        updateSetting('lgpd_compliance', policies.lgpd_compliance, 'legal'),
        updateSetting('refund_policy', policies.refund_policy, 'legal')
      ];

      const results = await Promise.all(updates);
      const hasError = results.some(result => !result.success);

      if (hasError) {
        toast({
          title: "Erro ao salvar",
          description: "Houve um erro ao salvar as políticas.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Políticas salvas!",
          description: "As políticas foram atualizadas com sucesso."
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Carregando políticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Políticas & Termos</h1>
        <p className="text-muted-foreground">
          Configure as políticas legais que aparecerão no rodapé da landing page
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Política de Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="privacy">Conteúdo da Política de Privacidade</Label>
              <Textarea
                id="privacy"
                placeholder="Digite aqui o conteúdo completo da sua política de privacidade..."
                value={policies.privacy_policy}
                onChange={(e) => setPolicies({...policies, privacy_policy: e.target.value})}
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Termos de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="terms">Conteúdo dos Termos de Uso</Label>
              <Textarea
                id="terms"
                placeholder="Digite aqui o conteúdo completo dos seus termos de uso..."
                value={policies.terms_of_use}
                onChange={(e) => setPolicies({...policies, terms_of_use: e.target.value})}
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-600" />
              LGPD e Segurança de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="lgpd">Informações sobre LGPD e Proteção de Dados</Label>
              <Textarea
                id="lgpd"
                placeholder="Digite aqui as informações sobre como você trata os dados pessoais conforme LGPD..."
                value={policies.lgpd_compliance}
                onChange={(e) => setPolicies({...policies, lgpd_compliance: e.target.value})}
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              Política de Cancelamento e Reembolsos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="refund">Política de Cancelamento e Reembolsos</Label>
              <Textarea
                id="refund"
                placeholder="Digite aqui as condições para cancelamento e reembolso..."
                value={policies.refund_policy}
                onChange={(e) => setPolicies({...policies, refund_policy: e.target.value})}
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Salvar Políticas"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}