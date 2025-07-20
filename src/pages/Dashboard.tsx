import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, DollarSign, Brain, TrendingUp } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    todayTasks: 0,
    monthlyExpenses: 0,
    aiSuggestions: 0
  });
  const [expensesByCategory, setExpensesByCategory] = useState<any>(null);
  const [expensesOverTime, setExpensesOverTime] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchStats();
      fetchChartData();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();
    
    setProfile(data);
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    // Today's tasks
    const { count: tasksCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id)
      .gte('start_date', today)
      .lt('start_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    // Monthly expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user?.id)
      .gte('transaction_date', startOfMonth);

    const monthlyTotal = expenses?.reduce((sum, expense) => sum + parseFloat(expense.amount), 0) || 0;

    // AI suggestions
    const { count: suggestionsCount } = await supabase
      .from('ai_suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id)
      .eq('status', 'active');

    setStats({
      todayTasks: tasksCount || 0,
      monthlyExpenses: monthlyTotal,
      aiSuggestions: suggestionsCount || 0
    });
  };

  const fetchChartData = async () => {
    // Expenses by category
    const { data: categoryExpenses } = await supabase
      .from('expenses')
      .select(`
        amount,
        categories (name, color)
      `)
      .eq('user_id', user?.id);

    if (categoryExpenses) {
      const categoryTotals: { [key: string]: { amount: number; color: string } } = {};
      
      categoryExpenses.forEach((expense: any) => {
        const categoryName = expense.categories?.name || 'Outros';
        const categoryColor = expense.categories?.color || '#6b7280';
        
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = { amount: 0, color: categoryColor };
        }
        categoryTotals[categoryName].amount += parseFloat(expense.amount);
      });

      setExpensesByCategory({
        labels: Object.keys(categoryTotals),
        datasets: [
          {
            data: Object.values(categoryTotals).map(cat => cat.amount),
            backgroundColor: Object.values(categoryTotals).map(cat => cat.color),
            borderWidth: 2
          }
        ]
      });
    }

    // Expenses over time (last 7 days)
    const { data: dailyExpenses } = await supabase
      .from('expenses')
      .select('amount, transaction_date')
      .eq('user_id', user?.id)
      .gte('transaction_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('transaction_date');

    if (dailyExpenses) {
      const dailyTotals: { [key: string]: number } = {};
      
      dailyExpenses.forEach((expense: any) => {
        const date = expense.transaction_date;
        if (!dailyTotals[date]) {
          dailyTotals[date] = 0;
        }
        dailyTotals[date] += parseFloat(expense.amount);
      });

      const dates = Object.keys(dailyTotals).sort();
      
      setExpensesOverTime({
        labels: dates.map(date => new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })),
        datasets: [
          {
            label: 'Gastos Diários',
            data: dates.map(date => dailyTotals[date]),
            borderColor: 'hsl(var(--primary))',
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            tension: 0.1
          }
        ]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Olá, {profile?.full_name || 'Usuário'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo da sua semana.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Hoje</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayTasks}</div>
            <p className="text-xs text-muted-foreground">
              Programadas para hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total gasto este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sugestões da IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aiSuggestions}</div>
            <p className="text-xs text-muted-foreground">
              Pendentes para análise
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>
              Distribuição dos seus gastos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expensesByCategory ? (
              <div className="h-[300px] flex items-center justify-center">
                <Pie 
                  data={expensesByCategory} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum gasto registrado
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução dos Gastos</CardTitle>
            <CardDescription>
              Gastos diários dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expensesOverTime ? (
              <div className="h-[300px]">
                <Line 
                  data={expensesOverTime} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return 'R$ ' + Number(value).toLocaleString('pt-BR');
                          }
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum gasto registrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}