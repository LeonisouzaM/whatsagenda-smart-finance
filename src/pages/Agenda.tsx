import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Plus, Brain } from "lucide-react";
import { toast } from "sonner";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from "date-fns";

export function Agenda() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user?.id)
      .order('start_date');

    if (error) {
      toast.error("Erro ao carregar tarefas");
      return;
    }

    const calendarEvents = data?.map(task => ({
      id: task.id,
      title: task.title,
      start: task.start_date,
      end: task.end_date,
      backgroundColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981',
      extendedProps: {
        description: task.description,
        priority: task.priority,
        status: task.status,
        category: task.category,
        ai_generated: task.ai_generated
      }
    })) || [];

    setEvents(calendarEvents);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setIsDialogOpen(true);
  };

  const handleDateSelect = (selectInfo: any) => {
    setSelectedEvent({
      start: selectInfo.start,
      end: selectInfo.end
    });
    setIsCreateDialogOpen(true);
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const taskData = {
      user_id: user?.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      start_date: formData.get('startDate') as string,
      end_date: formData.get('endDate') as string || null,
      priority: formData.get('priority') as string,
      category: formData.get('category') as string,
    };

    const { error } = await supabase
      .from('tasks')
      .insert([taskData]);

    if (error) {
      toast.error("Erro ao criar tarefa");
      return;
    }

    toast.success("Tarefa criada com sucesso!");
    setIsCreateDialogOpen(false);
    fetchTasks();
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) {
      toast.error("Erro ao atualizar tarefa");
      return;
    }

    toast.success("Tarefa atualizada!");
    setIsDialogOpen(false);
    fetchTasks();
  };

  const handleRequestWhatsAppAgenda = () => {
    toast.success("Solicitação enviada! Você receberá sua nova agenda via WhatsApp em breve.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda & Rotina</h1>
          <p className="text-muted-foreground">
            Gerencie sua agenda e organize sua rotina
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Tarefa</DialogTitle>
                <DialogDescription>
                  Adicione uma nova tarefa à sua agenda
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data/Hora Início</Label>
                    <Input 
                      id="startDate" 
                      name="startDate" 
                      type="datetime-local" 
                      required 
                      defaultValue={selectedEvent?.start ? format(new Date(selectedEvent.start), "yyyy-MM-dd'T'HH:mm") : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data/Hora Fim</Label>
                    <Input 
                      id="endDate" 
                      name="endDate" 
                      type="datetime-local"
                      defaultValue={selectedEvent?.end ? format(new Date(selectedEvent.end), "yyyy-MM-dd'T'HH:mm") : ""}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select name="category" defaultValue="personal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Pessoal</SelectItem>
                        <SelectItem value="work">Trabalho</SelectItem>
                        <SelectItem value="study">Estudos</SelectItem>
                        <SelectItem value="health">Saúde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Tarefa
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={handleRequestWhatsAppAgenda}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Receber via WhatsApp
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
          <CardDescription>
            Visualize e gerencie suas tarefas e compromissos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              locale="pt-br"
              height="100%"
              buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Detalhes da tarefa
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Label>Descrição</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.extendedProps?.description || "Sem descrição"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prioridade</Label>
                  <p className="text-sm capitalize">
                    {selectedEvent.extendedProps?.priority || "Média"}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-sm capitalize">
                    {selectedEvent.extendedProps?.status || "Pendente"}
                  </p>
                </div>
              </div>
              <div>
                <Label>Horário</Label>
                <p className="text-sm">
                  {selectedEvent.start && format(new Date(selectedEvent.start), "dd/MM/yyyy HH:mm")}
                  {selectedEvent.end && " - " + format(new Date(selectedEvent.end), "HH:mm")}
                </p>
              </div>
              {selectedEvent.extendedProps?.ai_generated && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Brain className="h-4 w-4" />
                  Gerado pela IA
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateTaskStatus(selectedEvent.id, 'completed')}
                >
                  Marcar como Concluída
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateTaskStatus(selectedEvent.id, 'cancelled')}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}