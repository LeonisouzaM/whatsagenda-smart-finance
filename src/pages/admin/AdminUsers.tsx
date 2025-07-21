import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Crown, Users, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  subscription_plan: string;
  subscription_status: string;
  whatsapp_connected: boolean;
  created_at: string;
}

export function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.user_id === userId 
          ? { ...user, is_admin: !currentStatus }
          : user
      ));

      toast({
        title: "Status atualizado",
        description: `O usuário ${!currentStatus ? 'agora é' : 'não é mais'} administrador.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
    }
  };

  const getSubscriptionBadgeColor = (plan: string) => {
    switch (plan) {
      case 'premium': return 'bg-gold text-gold-foreground';
      case 'pro': return 'bg-purple-600 text-white';
      case 'free': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'inactive': return 'bg-red-600 text-white';
      case 'suspended': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os usuários do sistema
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.is_admin).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Premium</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.subscription_plan !== 'free').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Conectado</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.whatsapp_connected).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerencie permissões e visualize informações dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 rounded-full bg-muted p-2" />
                      <div>
                        <div className="font-medium">
                          {user.full_name || 'Sem nome'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.phone || 'Sem telefone'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSubscriptionBadgeColor(user.subscription_plan)}>
                      {user.subscription_plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(user.subscription_status)}>
                      {user.subscription_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.is_admin}
                      onCheckedChange={() => toggleAdminStatus(user.user_id, user.is_admin)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.whatsapp_connected ? "default" : "secondary"}>
                      {user.whatsapp_connected ? "Conectado" : "Desconectado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalhes do Usuário</DialogTitle>
                          <DialogDescription>
                            Informações detalhadas e configurações do usuário
                          </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Nome Completo</Label>
                                <p className="text-sm">{selectedUser.full_name || 'Não informado'}</p>
                              </div>
                              <div>
                                <Label>Telefone</Label>
                                <p className="text-sm">{selectedUser.phone || 'Não informado'}</p>
                              </div>
                              <div>
                                <Label>Plano de Assinatura</Label>
                                <p className="text-sm capitalize">{selectedUser.subscription_plan}</p>
                              </div>
                              <div>
                                <Label>Status da Assinatura</Label>
                                <p className="text-sm capitalize">{selectedUser.subscription_status}</p>
                              </div>
                              <div>
                                <Label>Administrador</Label>
                                <p className="text-sm">{selectedUser.is_admin ? 'Sim' : 'Não'}</p>
                              </div>
                              <div>
                                <Label>WhatsApp Conectado</Label>
                                <p className="text-sm">{selectedUser.whatsapp_connected ? 'Sim' : 'Não'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}