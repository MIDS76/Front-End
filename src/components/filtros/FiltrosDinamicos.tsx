"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FiltrosDinamicosProps {
  mostrar?: {
    aluno?: boolean;
    turma?: boolean;
    conselho?: boolean;
  };
  onSelect?: (grupo: string, valor: string) => void;
}

export default function FiltrosDinamicos({
  mostrar = { aluno: true, turma: true, conselho: true },
  onSelect,
}: FiltrosDinamicosProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [subOpen, setSubOpen] = useState<string | null>(null);

  const handleToggle = (name: string) => {
    setOpen((prev) => (prev === name ? null : name));
    setSubOpen(null);
  };

  const handleSubToggle = (name: string) => {
    setSubOpen((prev) => (prev === name ? null : name));
  };

  const handleSelect = (grupo: string, valor: string) => {
    if (onSelect) onSelect(grupo, valor);
  };

  const groupButtonClass =
    "w-full flex justify-between items-center py-2 text-left hover:bg-accent/5 rounded-md px-2";
  const optionClass =
    "text-left w-full py-1 px-2 hover:bg-accent/5 rounded-md";

  const gruposAtivos = [
    mostrar.aluno && "aluno",
    mostrar.turma && "turma",
    mostrar.conselho && "conselho",
  ].filter(Boolean) as string[];

  const deveMostrarLinha = (grupo: string) => {
    const index = gruposAtivos.indexOf(grupo);
    return index !== -1 && index < gruposAtivos.length - 1;
  };

  return (
    <div className="w-[300px] bg-card/80 backdrop-blur-sm rounded-2xl p-3 text-sm font-medium shadow-md">
      {mostrar.aluno && (
        <div>
          <button
            onClick={() => handleToggle("aluno")}
            className={groupButtonClass}
          >
            <span>Aluno</span>
            {open === "aluno" ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              open === "aluno" ? "max-h-40 mt-2" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-1">
              {["A-Z", "Z-A", "Ativo", "Inativo"].map((opcao) => (
                <button
                  key={opcao}
                  onClick={() => handleSelect("Aluno", opcao)}
                  className={optionClass}
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>

          {deveMostrarLinha("aluno") && (
            <div className="my-2 border-t border-muted" />
          )}
        </div>
      )}

      {mostrar.turma && (
        <div>
          <button
            onClick={() => handleToggle("turma")}
            className={groupButtonClass}
          >
            <span>Turma</span>
            {open === "turma" ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              open === "turma" ? "max-h-[420px] mt-2" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-1">
              {["A-Z", "Z-A"].map((opcao) => (
                <button
                  key={opcao}
                  onClick={() => handleSelect("Turma", opcao)}
                  className={optionClass}
                >
                  {opcao}
                </button>
              ))}

              <div className="mt-1">
                <button
                  onClick={() => handleSubToggle("curso")}
                  className="w-full flex justify-between items-center py-1 px-2 text-left hover:bg-accent/5 rounded-md"
                >
                  <span>Curso</span>
                  {subOpen === "curso" ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out pl-4 ${
                    subOpen === "curso" ? "max-h-40 mt-1" : "max-h-0"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    {[
                      "Desenvolvimento de Sistemas",
                      "Análise de Dados",
                      "Ferramentaria",
                      "Eletrotécnica",
                    ].map((curso) => (
                      <button
                        key={curso}
                        onClick={() => handleSelect("Curso", curso)}
                        className={optionClass}
                      >
                        {curso}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-1">
                <button
                  onClick={() => handleSubToggle("ano")}
                  className="w-full flex justify-between items-center py-1 px-2 text-left hover:bg-accent/5 rounded-md"
                >
                  <span>Ano de Entrada</span>
                  {subOpen === "ano" ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out pl-4 ${
                    subOpen === "ano" ? "max-h-40 mt-1" : "max-h-0"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    {["2022", "2023", "2024"].map((ano) => (
                      <button
                        key={ano}
                        onClick={() => handleSelect("Ano de Entrada", ano)}
                        className={optionClass}
                      >
                        {ano}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {deveMostrarLinha("turma") && (
            <div className="my-2 border-t border-muted" />
          )}
        </div>
      )}

      {mostrar.conselho && (
        <div>
          <button
            onClick={() => handleToggle("conselho")}
            className={groupButtonClass}
          >
            <span>Conselho</span>
            {open === "conselho" ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              open === "conselho" ? "max-h-40 mt-2" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-1">
              {[
                "Pré-conselho",
                "Reunião",
                "Conversas Particulares",
                "Feedbacks",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect("Conselho", item)}
                  className={optionClass}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
