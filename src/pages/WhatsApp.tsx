import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, FileText, Image, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export function WhatsApp() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('whatsapp_logs')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar histórico");
      return;
    }

    setMessages(data || []);
    setLoading(false);
  };

  const generateMockMessages = async () => {
    const mockMessages = [
      {
        user_id: user?.id,
        message_type: 'sent',
        content: 'Olá! Preciso de ajuda para organizar minha agenda desta semana.',
        has_file: false,
        processed: true
      },
      {
        user_id: user?.id,
        message_type: 'received',
        content: 'Olá! Claro, vou ajudar você a organizar sua agenda. Você pode me enviar seus compromissos e metas para esta semana?',
        has_file: false,
        processed: true
      },
      {
        user_id: user?.id,
        message_type: 'sent',
        content: 'Tenho reunião na segunda às 14h, aula de yoga na terça às 19h, e preciso estudar para uma prova na sexta.',
        has_file: false,
        processed: true
      },
      {
        user_id: user?.id,
        message_type: 'received',
        content: 'Perfeito! Criei sua agenda otimizada. Adicionei blocos de estudo distribuídos durante a semana para melhor absorção do conteúdo. Também sugeri pausas entre atividades.',
        has_file: false,
        processed: true
      },
      {
        user_id: user?.id,
        message_type: 'sent',
        content: 'Extrato bancário do mês',
        has_file: true,
        file_type: 'pdf',
        file_url: 'extrato-abril-2024.pdf',
        processed: true
      },
      {
        user_id: user?.id,
        message_type: 'received',
        content: 'Analisei seu extrato! Identifiquei que você gastou R$ 480 com alimentação este mês (23% acima da média). Também notei um padrão de gastos altos nas quintas-feiras. Que tal preparar refeições em casa nestes dias?',
        has_file: false,
        processed: true
      }
    ];

    const { error } = await supabase
      .from('whatsapp_logs')
      .insert(mockMessages);

    if (error) {
      toast.error("Erro ao gerar mensagens");
      return;
    }

    toast.success("Histórico de exemplo criado!");
    fetchMessages();
  };

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMessageIcon = (message: any) => {
    if (message.has_file) {
      return message.file_type === 'pdf' ? <FileText className="h-4 w-4" /> : <Image className="h-4 w-4" />;
    }
    return <MessageSquare className="h-4 w-4" />;
  };

  const handleDownloadFile = (fileUrl: string) => {
    toast.info("Download iniciado: " + fileUrl);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Histórico WhatsApp</h1>
          <p className="text-muted-foreground">
            Todas as suas conversas com a IA do Agendify
          </p>
        </div>
        <Button onClick={generateMockMessages} variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Gerar Histórico de Exemplo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">
              Enviadas e recebidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Arquivos Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.has_file).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Extratos e documentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última Interação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.length > 0 ? format(new Date(messages[0].created_at), "dd/MM") : "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              Data da última mensagem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Conversas</CardTitle>
          <CardDescription>
            Encontre mensagens específicas no seu histórico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por conteúdo da mensagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Conversas</CardTitle>
          <CardDescription>
            Todas as suas interações com a IA, organizadas cronologicamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.message_type === 'sent' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.message_type === 'sent'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getMessageIcon(message)}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      
                      {message.has_file && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {message.file_type?.toUpperCase() || 'ARQUIVO'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadFile(message.file_url)}
                            className="h-6 px-2 text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-2">
                        {format(new Date(message.created_at), "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredMessages.length === 0 && searchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma mensagem encontrada para "{searchTerm}"
              </div>
            )}
            
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">Nenhuma conversa ainda</h3>
                <p className="text-sm">
                  Suas conversas com a IA do Agendify aparecerão aqui.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Integração</CardTitle>
          <CardDescription>
            Configure sua conexão com o WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">WhatsApp Conectado</p>
                <p className="text-sm text-muted-foreground">
                  Número: +55 (11) 99999-9999
                </p>
              </div>
            </div>
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Enviar Mensagem Teste
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}