import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Profile() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Perfil & Conta</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {user?.email}</p>
          <Button onClick={signOut} className="mt-4">Sair</Button>
        </CardContent>
      </Card>
    </div>
  );
}