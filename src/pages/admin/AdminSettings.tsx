import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Setting {
  name: string;
  value: string;
  category: string;
}

export function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testingConnections, setTestingConnections] = useState<Record<string, boolean>>({});
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'success' | 'error' | null>>({});
  const [settings, setSettings] = useState<Record<string, string>>({
    whatsapp_api_key: '',
    whatsapp_number_id: '',
    gemini_api_key: '',
    facebook_pixel: '',
    google_analytics: '',
    tiktok_pixel: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('name, value')
        .in('name', Object.keys(settings));

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.name] = setting.value || '';
        return acc;
      }, {} as Record<string, string>);

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSetting = async (name: string, value: string) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ name, value, category: getSettingCategory(name) });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [name]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const getSettingCategory = (name: string) => {
    if (name.includes('pixel') || name.includes('analytics')) return 'tracking';
    if (name.includes('api_key') || name.includes('number_id')) return 'apis';
    return 'general';
  };

  const handleSaveAPIs = async () => {
    setLoading(true);
    try {
      await Promise.all([
        updateSetting('whatsapp_api_key', settings.whatsapp_api_key),
        updateSetting('whatsapp_number_id', settings.whatsapp_number_id),
        updateSetting('gemini_api_key', settings.gemini_api_key)
      ]);

      toast({
        title: "Configurações salvas",
        description: "As configurações de API foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePixels = async () => {
    setLoading(true);
    try {
      await Promise.all([
        updateSetting('facebook_pixel', settings.facebook_pixel),
        updateSetting('google_analytics', settings.google_analytics),
        updateSetting('tiktok_pixel', settings.tiktok_pixel)
      ]);

      toast({
        title: "Pixels salvos",
        description: "Os códigos de rastreamento foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os pixels.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (type: 'whatsapp' | 'gemini') => {
    const key = `testing_${type}`;
    setTestingConnections(prev => ({ ...prev, [key]: true }));
    
    try {
      let endpoint = '';
      switch (type) {
        case 'whatsapp':
          endpoint = 'test-whatsapp-connection';
          break;
        case 'gemini':
          endpoint = 'test-gemini-connection';
          break;
        default:
          throw new Error('Tipo de conexão não suportado');
      }

      const { data, error } = await supabase.functions.invoke(endpoint);
      
      if (error) throw error;
      
      const status = data.success ? 'success' : 'error';
      setConnectionStatus(prev => ({ ...prev, [type]: status }));
      
      toast({
        title: data.success ? "Conexão bem-sucedida" : "Falha na conexão",
        description: data.success 
          ? `A conexão com ${type === 'whatsapp' ? 'WhatsApp' : 'Gemini'} foi testada com sucesso.`
          : `Erro na conexão: ${data.error || 'Verifique as credenciais'}`,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error(`Erro ao testar ${type}:`, error);
      setConnectionStatus(prev => ({ ...prev, [type]: 'error' }));
      
      toast({
        title: "Erro ao testar conexão",
        description: `Falha ao conectar com ${type === 'whatsapp' ? 'WhatsApp' : 'Gemini'}. Verifique as configurações.`,
        variant: "destructive",
      });
    } finally {
      setTestingConnections(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Configure APIs externas e códigos de rastreamento
        </p>
      </div>

      <Tabs defaultValue="apis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apis">APIs Externas</TabsTrigger>
          <TabsTrigger value="tracking">Pixels de Rastreamento</TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Business API</CardTitle>
              <CardDescription>
                Configure as credenciais da API oficial do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_api_key">API Key do WhatsApp</Label>
                <Input
                  id="whatsapp_api_key"
                  type="password"
                  placeholder="Insira sua API Key do WhatsApp"
                  value={settings.whatsapp_api_key}
                  onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_api_key: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number_id">Number ID do WhatsApp</Label>
                <Input
                  id="whatsapp_number_id"
                  placeholder="Insira o Number ID do WhatsApp"
                  value={settings.whatsapp_number_id}
                  onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number_id: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => testConnection('whatsapp')}
                  variant="outline"
                  disabled={testingConnections.testing_whatsapp}
                >
                  {testingConnections.testing_whatsapp ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Testar Conexão
                </Button>
                {connectionStatus.whatsapp === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {connectionStatus.whatsapp === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Gemini AI</CardTitle>
              <CardDescription>
                Configure a API Key do Google Gemini para inteligência artificial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gemini_api_key">API Key do Gemini</Label>
                <Input
                  id="gemini_api_key"
                  type="password"
                  placeholder="Insira sua API Key do Google Gemini"
                  value={settings.gemini_api_key}
                  onChange={(e) => setSettings(prev => ({ ...prev, gemini_api_key: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => testConnection('gemini')}
                  variant="outline"
                  disabled={testingConnections.testing_gemini}
                >
                  {testingConnections.testing_gemini ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Testar Conexão
                </Button>
                {connectionStatus.gemini === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {connectionStatus.gemini === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveAPIs} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Salvar Configurações de API
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pixel do Facebook</CardTitle>
              <CardDescription>
                Insira o código do pixel do Facebook para rastreamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_pixel">ID do Pixel do Facebook</Label>
                <Input
                  id="facebook_pixel"
                  placeholder="Ex: 123456789012345"
                  value={settings.facebook_pixel}
                  onChange={(e) => setSettings(prev => ({ ...prev, facebook_pixel: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Apenas o ID numérico do pixel, não o código completo
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Analytics / Tag Manager</CardTitle>
              <CardDescription>
                Insira o código do Google Analytics 4 ou Google Tag Manager
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google_analytics">ID do Google Analytics</Label>
                <Input
                  id="google_analytics"
                  placeholder="Ex: G-XXXXXXXXXX ou UA-XXXXXXXX-X"
                  value={settings.google_analytics}
                  onChange={(e) => setSettings(prev => ({ ...prev, google_analytics: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  ID do Google Analytics 4 (G-XXXXXXXXXX) ou Universal Analytics (UA-XXXXXXXX-X)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pixel do TikTok</CardTitle>
              <CardDescription>
                Insira o código do pixel do TikTok para rastreamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tiktok_pixel">ID do Pixel do TikTok</Label>
                <Input
                  id="tiktok_pixel"
                  placeholder="Ex: C4A8CB37XXXXXXXXXXXXXXXXXXXXX"
                  value={settings.tiktok_pixel}
                  onChange={(e) => setSettings(prev => ({ ...prev, tiktok_pixel: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Apenas o ID do pixel do TikTok, não o código completo
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSavePixels} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Salvar Pixels de Rastreamento
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}