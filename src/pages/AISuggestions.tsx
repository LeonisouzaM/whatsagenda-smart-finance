import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, X, TrendingUp, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export function AISuggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const fetchSuggestions = async () => {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar sugestões");
      return;
    }

    setSuggestions(data || []);
    setLoading(false);
  };

  const handleSuggestionAction = async (suggestionId: string, action: 'applied' | 'dismissed') => {
    const { error } = await supabase
      .from('ai_suggestions')
      .update({ status: action })
      .eq('id', suggestionId);

    if (error) {
      toast.error("Erro ao atualizar sugestão");
      return;
    }

    toast.success(action === 'applied' ? "Sugestão aplicada!" : "Sugestão dispensada");
    fetchSuggestions();
  };

  const generateMockSuggestions = async () => {
    const mockSuggestions = [
      {
        user_id: user?.id,
        type: 'routine',
        title: 'Otimize seu horário de estudos',
        description: 'Baseado na sua agenda, recomendo concentrar os estudos entre 9h e 11h, quando você tem menos compromissos. Isso pode aumentar sua produtividade em 30%.',
        priority: 'high',
        metadata: { timeRange: '09:00-11:00', productivityIncrease: 30 }
      },
      {
        user_id: user?.id,
        type: 'financial',
        title: 'Reduza gastos com alimentação',
        description: 'Você gastou R$ 480 com alimentação este mês, 23% acima da sua média. Considere preparar mais refeições em casa nos próximos dias.',
        priority: 'medium',
        metadata: { category: 'food', overspending: 23, amount: 480 }
      },
      {
        user_id: user?.id,
        type: 'routine',
        title: 'Adicione pausas entre reuniões',
        description: 'Detectei que você tem reuniões consecutivas às terças-feiras. Adicionar pausas de 15 minutos pode melhorar sua concentração.',
        priority: 'medium',
        metadata: { day: 'tuesday', breakDuration: 15 }
      },
      {
        user_id: user?.id,
        type: 'financial',
        title: 'Oportunidade de investimento',
        description: 'Você tem uma reserva consistente de R$ 800/mês. Considere alocar 60% desse valor em investimentos de baixo risco.',
        priority: 'low',
        metadata: { monthlyReserve: 800, allocationPercentage: 60 }
      }
    ];

    const { error } = await supabase
      .from('ai_suggestions')
      .insert(mockSuggestions);

    if (error) {
      toast.error("Erro ao gerar sugestões");
      return;
    }

    toast.success("Novas sugestões geradas!");
    fetchSuggestions();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'routine':
        return <Clock className="h-5 w-5" />;
      case 'financial':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'routine':
        return 'Rotina';
      case 'financial':
        return 'Financeiro';
      default:
        return 'Geral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const activeSuggestions = suggestions.filter(s => s.status === 'active');
  const appliedSuggestions = suggestions.filter(s => s.status === 'applied');
  const dismissedSuggestions = suggestions.filter(s => s.status === 'dismissed');

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
          <h1 className="text-3xl font-bold">Sugestões da IA</h1>
          <p className="text-muted-foreground">
            Recomendações personalizadas para otimizar sua rotina e finanças
          </p>
        </div>
        <Button onClick={generateMockSuggestions} variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          Gerar Novas Sugestões
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sugestões Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSuggestions.length}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando sua análise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aplicadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{appliedSuggestions.length}</div>
            <p className="text-xs text-muted-foreground">
              Sugestões implementadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suggestions.length > 0 ? Math.round((appliedSuggestions.length / suggestions.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Das sugestões geradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Suggestions */}
      {activeSuggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sugestões Pendentes</h2>
          {activeSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(suggestion.type)}
                    <div>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority === 'high' ? 'Alta' : 
                           suggestion.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                        </Badge>
                        <Badge variant="outline">
                          {getTypeLabel(suggestion.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSuggestionAction(suggestion.id, 'applied')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aplicar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSuggestionAction(suggestion.id, 'dismissed')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Dispensar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{suggestion.description}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Gerado em {format(new Date(suggestion.created_at), "dd/MM/yyyy 'às' HH:mm")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Historical Suggestions */}
      {(appliedSuggestions.length > 0 || dismissedSuggestions.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Histórico</h2>
          
          {appliedSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-l-4 border-l-green-500 opacity-75">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-green-600">
                        Aplicada
                      </Badge>
                      <Badge variant="outline">
                        {getTypeLabel(suggestion.type)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{suggestion.description}</p>
              </CardContent>
            </Card>
          ))}

          {dismissedSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-l-4 border-l-gray-400 opacity-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <X className="h-5 w-5 text-gray-500" />
                  <div>
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-gray-500">
                        Dispensada
                      </Badge>
                      <Badge variant="outline">
                        {getTypeLabel(suggestion.type)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{suggestion.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {suggestions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma sugestão ainda</h3>
            <p className="text-muted-foreground mb-4">
              A IA ainda está analisando seus dados. Use o sistema por alguns dias para receber sugestões personalizadas.
            </p>
            <Button onClick={generateMockSuggestions}>
              Gerar Sugestões de Exemplo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}