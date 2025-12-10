"use client";

interface InfoCardProps {
  titulo: string;
  subtitulo?: string;
  descricao: string;
  className?: string;
  style?: React.CSSProperties; 
}

export default function InfoCard({ titulo, subtitulo, descricao, className, style }: InfoCardProps) {
  return (
    <div
    className={`rounded-2xl shadow p-[1rem] w-full h-auto ${className || ""}`}    
    style={{
      backgroundColor: "hsl(var(--card))",
      color: "hsl(var(--card-foreground))",
      ...style, 
    }}
  >
          <h5 className="text-[1.5rem] font-semibold">{titulo}</h5>

      <div
        className="my-[0.5rem]"
        style={{ borderBottom: "1px solid hsl(var(--border))" }}
      />

      {subtitulo && (
        <h6 className="text-[1rem] font-medium mb-[0.5rem] opacity-80">{subtitulo}</h6>
      )}

      <p className="text-[1rem] leading-relaxed">{descricao}</p>
    </div>
  );
}
