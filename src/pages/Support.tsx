import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Support() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Suporte</h1>
      <Card>
        <CardHeader>
          <CardTitle>Entre em Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <p>suporte@agendify.app</p>
        </CardContent>
      </Card>
    </div>
  );
}