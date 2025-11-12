"use client";

interface InfoCardProps {
  titulo: string;
  descricao: string;
}

export default function InfoCard({ titulo, descricao }: InfoCardProps) {
  return (
    <div
      className="rounded-2xl shadow p-4"
      style={{
        backgroundColor: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
      }}
    >
      <h5 className="text-3xl font-semibold">{titulo}</h5>
      <div
        className="my-2"
        style={{ borderBottom: "1px solid hsl(var(--border))" }}
      />
      <h5 className="text-3xl font-semibold">{descricao}</h5>
    </div>
  );
}
