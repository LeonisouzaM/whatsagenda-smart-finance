import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Brain,
  MessageSquare,
  CreditCard,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Settings
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Agenda & Rotina", path: "/agenda" },
  { icon: DollarSign, label: "Finanças", path: "/finances" },
  { icon: Brain, label: "Sugestões da IA", path: "/ai-suggestions" },
  { icon: MessageSquare, label: "Histórico WhatsApp", path: "/whatsapp" },
  { icon: CreditCard, label: "Planos & Assinatura", path: "/subscription" },
  { icon: User, label: "Perfil & Conta", path: "/profile" },
  { icon: HelpCircle, label: "Suporte", path: "/support" },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-primary">Agendify</h1>
            <p className="text-sm text-muted-foreground">Painel Administrativo</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
            
            {isAdmin && (
              <NavLink
                to="/admin"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname.startsWith('/admin')
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Administração
              </NavLink>
            )}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}