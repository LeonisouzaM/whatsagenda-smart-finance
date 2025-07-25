import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Facebook, Instagram } from "lucide-react";

export function AdminPixels() {
  const { settings, updateSetting, loading } = useSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [pixels, setPixels] = useState({
    facebook: settings.facebook_pixel || '',
    google_analytics: settings.google_analytics || '',
    google_ads: settings.google_ads || '',
    tiktok: settings.tiktok_pixel || '',
    custom_header: settings.custom_header_scripts || '',
    custom_footer: settings.custom_footer_scripts || ''
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [
        updateSetting('facebook_pixel', pixels.facebook, 'analytics'),
        updateSetting('google_analytics', pixels.google_analytics, 'analytics'),
        updateSetting('google_ads', pixels.google_ads, 'analytics'),
        updateSetting('tiktok_pixel', pixels.tiktok, 'analytics'),
        updateSetting('custom_header_scripts', pixels.custom_header, 'analytics'),
        updateSetting('custom_footer_scripts', pixels.custom_footer, 'analytics')
      ];

      const results = await Promise.all(updates);
      const hasError = results.some(result => !result.success);

      if (hasError) {
        toast({
          title: "Erro ao salvar",
          description: "Houve um erro ao salvar as configurações.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Configurações salvas!",
          description: "Os pixels e scripts foram atualizados com sucesso."
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
    return <div className="p-6">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Pixels</h1>
        <p className="text-muted-foreground">
          Configure códigos de rastreamento e analytics para monitorar performance
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              Facebook Pixel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebook">ID do Pixel do Facebook</Label>
              <Input
                id="facebook"
                placeholder="123456789012345"
                value={pixels.facebook}
                onChange={(e) => setPixels({...pixels, facebook: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Google Analytics & Ads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ga">Google Analytics ID</Label>
              <Input
                id="ga"
                placeholder="G-XXXXXXXXXX ou UA-XXXXXXXXX"
                value={pixels.google_analytics}
                onChange={(e) => setPixels({...pixels, google_analytics: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="gads">Google Ads Conversion ID</Label>
              <Input
                id="gads"
                placeholder="AW-XXXXXXXXX"
                value={pixels.google_ads}
                onChange={(e) => setPixels({...pixels, google_ads: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-purple-600" />
              TikTok Pixel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tiktok">TikTok Pixel ID</Label>
              <Input
                id="tiktok"
                placeholder="C9XXXXXXXXXXXXXXXXXX"
                value={pixels.tiktok}
                onChange={(e) => setPixels({...pixels, tiktok: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scripts Personalizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="header">Scripts do Header (antes do &lt;/head&gt;)</Label>
              <Textarea
                id="header"
                placeholder="<!-- Insira scripts que devem carregar no header -->"
                value={pixels.custom_header}
                onChange={(e) => setPixels({...pixels, custom_header: e.target.value})}
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="footer">Scripts do Footer (antes do &lt;/body&gt;)</Label>
              <Textarea
                id="footer"
                placeholder="<!-- Insira scripts que devem carregar no footer -->"
                value={pixels.custom_footer}
                onChange={(e) => setPixels({...pixels, custom_footer: e.target.value})}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}