import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, Filter, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format } from "date-fns";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function Finances() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [monthlyLimit, setMonthlyLimit] = useState(2000);
  const [chartData, setChartData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchCategories();
    }
  }, [user, filterPeriod]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    setCategories(data || []);
  };

  const fetchExpenses = async () => {
    let startDate = new Date();
    
    if (filterPeriod === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (filterPeriod === 'month') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    } else if (filterPeriod === 'year') {
      startDate = new Date(startDate.getFullYear(), 0, 1);
    }

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        categories (name, color, icon)
      `)
      .eq('user_id', user?.id)
      .gte('transaction_date', startDate.toISOString().split('T')[0])
      .order('transaction_date', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar despesas");
      return;
    }

    setExpenses(data || []);
    generateChartData(data || []);
  };

  const generateChartData = (expensesData: any[]) => {
    // Pie chart by category
    const categoryTotals: { [key: string]: { amount: number; color: string } } = {};
    
    expensesData.forEach((expense) => {
      const categoryName = expense.categories?.name || 'Outros';
      const categoryColor = expense.categories?.color || '#6b7280';
      
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = { amount: 0, color: categoryColor };
      }
      categoryTotals[categoryName].amount += parseFloat(expense.amount);
    });

    setChartData({
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals).map(cat => cat.amount),
          backgroundColor: Object.values(categoryTotals).map(cat => cat.color),
          borderWidth: 2
        }
      ]
    });

    // Weekly bar chart
    const weeklyTotals: { [key: string]: number } = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => {
      weeklyTotals[date] = 0;
    });

    expensesData.forEach((expense) => {
      if (weeklyTotals.hasOwnProperty(expense.transaction_date)) {
        weeklyTotals[expense.transaction_date] += parseFloat(expense.amount);
      }
    });

    setWeeklyData({
      labels: last7Days.map(date => new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Gastos',
          data: last7Days.map(date => weeklyTotals[date]),
          backgroundColor: 'hsl(var(--primary) / 0.8)',
          borderColor: 'hsl(var(--primary))',
          borderWidth: 1
        }
      ]
    });
  };

  const handleCreateExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const expenseData = {
      user_id: user?.id,
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      category_id: formData.get('category') as string,
      transaction_date: formData.get('date') as string,
      payment_method: formData.get('paymentMethod') as string,
    };

    const { error } = await supabase
      .from('expenses')
      .insert([expenseData]);

    if (error) {
      toast.error("Erro ao criar despesa");
      return;
    }

    toast.success("Despesa adicionada com sucesso!");
    setIsCreateDialogOpen(false);
    fetchExpenses();
  };

  const handleFileUpload = () => {
    toast.info("Funcionalidade de upload será implementada em breve");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const isOverLimit = totalExpenses > monthlyLimit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finanças</h1>
          <p className="text-muted-foreground">
            Controle seus gastos e monitore sua saúde financeira
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Despesa</DialogTitle>
                <DialogDescription>
                  Registre uma nova despesa
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" name="description" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input 
                      id="date" 
                      name="date" 
                      type="date" 
                      required 
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                    <Select name="paymentMethod">
                      <SelectTrigger>
                        <SelectValue placeholder="Opcional..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="debit">Cartão de Débito</SelectItem>
                        <SelectItem value="credit">Cartão de Crédito</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Adicionar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={handleFileUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Extrato
          </Button>
        </div>
      </div>

      {/* Filter and Alert */}
      <div className="flex items-center justify-between">
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
            <SelectItem value="year">Este Ano</SelectItem>
          </SelectContent>
        </Select>

        {isOverLimit && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Limite mensal ultrapassado!
            </span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverLimit ? 'text-destructive' : ''}`}>
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {filterPeriod === 'week' ? 'Nos últimos 7 dias' : 
               filterPeriod === 'month' ? 'Este mês' : 'Este ano'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de lançamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {filterPeriod === 'week' ? (totalExpenses / 7).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) :
                   filterPeriod === 'month' ? (totalExpenses / new Date().getDate()).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) :
                   (totalExpenses / new Date().getDay() || 1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Gasto médio diário
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
              Distribuição dos gastos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData ? (
              <div className="h-[300px] flex items-center justify-center">
                <Pie 
                  data={chartData} 
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
                Nenhuma despesa registrada
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos Semanais</CardTitle>
            <CardDescription>
              Gastos diários dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyData ? (
              <div className="h-[300px]">
                <Bar 
                  data={weeklyData} 
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
                Nenhuma despesa registrada
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
          <CardDescription>
            Histórico das suas despesas recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {expense.categories?.icon || '💸'}
                  </div>
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(expense.transaction_date), "dd/MM/yyyy")} • {expense.categories?.name || 'Outros'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-destructive">
                    -R$ {parseFloat(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {expense.ai_categorized && (
                    <Badge variant="secondary" className="text-xs">
                      IA
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma despesa encontrada para o período selecionado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}