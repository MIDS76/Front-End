"use client";
import ButtonTT from "@/components/button/ButtonTT";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

interface LogLateralProps {
  titulo: string;
  subtitulo?: string;
  itens: { id?: number | string; unidade: string; professor?: string }[];
  onRemover: (idOuNome: string) => void;
  vazioTexto: string;
  onProximo: () => void;
}

export default function LogLateral({
  titulo,
  subtitulo,
  itens,
  onRemover,
  vazioTexto,
  onProximo,
}: LogLateralProps) {
  const handleProximoClick = () => {
    if (itens.length === 0) {
      toast.error("Adicione os requisitos antes de prosseguir!", {
        duration: 3000,
        style: {
          background: "hsl(var(--destructive))",
          color: "hsl(var(--destructive-foreground))",
          border: "1px solid hsl(var(--destructive))",
          fontWeight: 500,
        },
      });
      return;
    }

    onProximo();
  };

  console.log("Vendo o que o log recebeu: ");
  console.log(itens);

  return (
    <aside className="relative w-[25rem] flex-shrink-0 mt-[5rem] flex flex-col rounded-l-xl overflow-hidden shadow-md">
      {/* Cabeçalho */}
      <div className="bg-[hsl(var(--primary))] p-[1rem]">
        <div className="text-[hsl(var(--primary-foreground))] font-semibold flex justify-between items-center mb-[0.25rem] px-[0.25rem]">
          <span>{titulo}</span>
          {subtitulo && (
            <span className="text-[hsl(var(--primary-foreground))] font-semibold">
              {subtitulo}
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 bg-[hsl(var(--muted))] p-[1rem] flex flex-col relative overflow-y-auto">
        {itens.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[hsl(var(--muted-foreground))] text-sm text-center italic">
              {vazioTexto}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[0.75rem] mb-[6rem] pr-[0.5rem]">
            {itens.map((item, i) => (
              <div
                key={item.id ?? i}
                className="bg-[hsl(var(--card))] rounded-md px-[0.75rem] py-[0.5rem] shadow-sm flex justify-between items-center border border-[hsl(var(--border))]"
              >
                <div className="text-sm text-[hsl(var(--foreground))] w-1/2 truncate">
                  {item.unidade}
                </div>
                <div className="flex items-center justify-end gap-[0.5rem] w-1/2 truncate">
                  {item.professor && (
                    <span className="text-sm font-medium text-[hsl(var(--secondary))] truncate">
                      {item.professor}
                    </span>
                  )}
                  <button
                    onClick={() =>
                      onRemover(item.unidade)
                    }
                    className="text-[hsl(var(--muted-foreground))] text-sm font-bold"
                    title="Remover"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão próximo */}
        <div className="absolute bottom-[1.5rem] right-[1.5rem]">
          <ButtonTT
            mode="default"
            onClick={handleProximoClick}
            className="flex items-center gap-[0.5rem] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] text-sm px-[1.25rem] py-[0.5rem] rounded-md font-medium shadow-md transition-all"
          >
            Próximo passo <span className="text-base font-semibold">›</span>
          </ButtonTT>
        </div>
      </div>
    </aside>
  );
}
