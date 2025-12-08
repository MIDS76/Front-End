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
  onProximo?: () => void;
  mostrarProximo?: boolean;
}

export default function LogLateral({
  titulo,
  subtitulo,
  itens,
  onRemover,
  vazioTexto,
  onProximo,
  mostrarProximo = true,
}: LogLateralProps) {
  const handleProximoClick = () => {
    if (!onProximo) return;

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

  return (

    <aside className="flex h-[calc(100vh-80px)] w-full tablet: w-[20rem] laptop:w-[25rem] desktop:w-[30rem] flex-shrink-0 flex flex-col rounded-l-xl overflow-hidden shadow-md">
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

      {/* CONTAINER SCROLL */}
      <div className="flex-1 p-[1rem] flex flex-col">

        {/* SCROLL DA LISTA */}
        <div className="flex-1 overflow-y-auto pr-[0.5rem]">

          {itens.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[hsl(var(--muted-foreground))] text-sm text-center italic">
                {vazioTexto}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[0.75rem] mb-[1rem]">
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
                      onClick={() => onRemover(item.id)}
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
        </div>

        {/* Botão próximo */}
        {mostrarProximo && (
          <div className="mt-[1rem]">
            <ButtonTT
              mode="default"
              onClick={handleProximoClick}
              className="
                w-full
                flex items-center justify-center gap-[0.5rem] 
                bg-[hsl(var(--primary))] 
                hover:bg-[hsl(var(--secondary))] 
                text-[hsl(var(--primary-foreground))] 
                text-sm px-[1.25rem] py-[0.5rem] 
                rounded-md font-medium shadow-md transition-all
              "
            >
              Próximo passo <span className="text-base font-semibold">›</span>
            </ButtonTT>
          </div>
        )}
      </div>
    </aside>
  );
}
