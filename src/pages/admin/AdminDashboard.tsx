import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, TrendingUp, MessageCircle, Brain, Smartphone, FileText, Star, CreditCard, PenTool } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const adminCards = [
    {
      title: "Editor de Planos",
      description: "Gerenciar planos e preços da landing",
      icon: CreditCard,
      href: "/admin/plans",
      color: "text-blue-600"
    },
    {
      title: "Construtor de Blog",
      description: "Criar e gerenciar posts do blog",
      icon: PenTool,
      href: "/admin/blog",
      color: "text-green-600"
    },
    {
      title: "Analytics & Pixels",
      description: "Configurar rastreamento e métricas",
      icon: TrendingUp,
      href: "/admin/pixels",
      color: "text-purple-600"
    },
    {
      title: "Políticas & Termos",
      description: "Gerenciar documentos legais",
      icon: FileText,
      href: "/admin/policies",
      color: "text-orange-600"
    },
    {
      title: "Depoimentos",
      description: "Gerenciar avaliações de clientes",
      icon: Star,
      href: "/admin/testimonials",
      color: "text-yellow-600"
    },
    {
      title: "Configurações do Sistema",
      description: "APIs e configurações globais",
      icon: Settings,
      href: "/admin/settings",
      color: "text-gray-600"
    },
    {
      title: "Usuários Ativos",
      description: "Gerenciar contas e permissões",
      icon: Users,
      href: "/admin/users",
      color: "text-emerald-600"
    },
    {
      title: "Logs do Sistema",
      description: "Monitorar atividades e erros",
      icon: MessageCircle,
      href: "/admin/logs",
      color: "text-red-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie configurações, usuários e integrações do Agendify
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => (
          <Link key={card.href} to={card.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">WhatsApp API</span>
                <span className="text-sm text-yellow-600">⚠️ Não configurado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gemini IA</span>
                <span className="text-sm text-yellow-600">⚠️ Não configurado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Banco de Dados</span>
                <span className="text-sm text-green-600">✅ Conectado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas Rápidas</CardTitle>
            <CardDescription>Visão geral do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Usuários Totais</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mensagens Hoje</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tarefas Criadas</span>
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}