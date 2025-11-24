"use client";

import { FiX } from "react-icons/fi";
import clsx from "clsx";

interface LogLateralProps {
  titulo: string;
  subtitulo?: string;
  itens: { id?: number | string; unidade: string; professor?: string }[];
  onRemover: (idOuNome: string) => void;
  vazioTexto: string;
  onProximo: () => void;
  className?: string; // <- permite controlar altura, margem, etc. pela tela
}

export default function LogLateral({
  titulo,
  subtitulo,
  itens,
  onRemover,
  vazioTexto,
  onProximo,
  className,
}: LogLateralProps) {
  return (
    <aside
    className={clsx(
      "relative w-[25rem] flex-shrink-0 flex flex-col rounded-l-xl overflow-hidden shadow-md min-h-[calc(100vh-5rem)]"
      ,

      className
    )}
  >
  
      {/* Cabeçalho */}
      <div className="bg-[hsl(var(--primary))] p-4">
        <div className="text-[hsl(var(--primary-foreground))] font-semibold flex justify-between items-center">
          <span>{titulo}</span>
          {subtitulo && (
            <span className="text-sm opacity-80">{subtitulo}</span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 bg-[hsl(var(--muted))] p-4 relative overflow-y-auto">
        {itens.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <p className="text-[hsl(var(--muted-foreground))] text-sm text-center italic">
              {vazioTexto}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-20 pr-2">
            {itens.map((item, index) => (
              <div
                key={item.id ?? index}
                className="bg-[hsl(var(--card))] rounded-md px-3 py-2 shadow-sm flex justify-between items-center border border-[hsl(var(--border))]"
              >
                <div className="text-sm text-[hsl(var(--foreground))] w-1/2 truncate">
                  {item.unidade}
                </div>

                <div className="flex items-center justify-end gap-2 w-1/2 truncate">
                  {item.professor && (
                    <span className="text-sm font-medium text-[hsl(var(--secondary))] truncate">
                      {item.professor}
                    </span>
                  )}

                  <button
                    onClick={() =>
                      onRemover(item.id?.toString() || item.unidade)
                    }
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] text-base"
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
        <div className="absolute bottom-6 right-6">
          <button
            onClick={onProximo}
            className="flex items-center gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] text-sm px-5 py-2 rounded-md font-medium shadow-md transition-all"
          >
            Próximo passo
            <span className="text-base font-semibold">›</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
