import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Subscription() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Planos & Assinatura</h1>
      <Card>
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Plano Gratuito</p>
        </CardContent>
      </Card>
    </div>
  );
}