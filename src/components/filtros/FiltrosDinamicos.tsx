"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { filtrarAlunoOrdemAlfabetica, filtrarConselhoEtapa, filtrarPorAnoEntrada, filtrarPorAtividade, filtrarPorCurso, listarAnosEntrada, listarCursos, ordenarOrdemAlfabeticaTurma } from "@/api/filtros";
import { da } from "date-fns/locale";

interface FiltrosDinamicosProps {
  mostrar?: {
    usuario?: boolean;
    turma?: boolean;
    conselho?: boolean;
  };
  onSelect?: (grupo: string, valor: string) => void;
}

export default function FiltrosDinamicos({
  mostrar = { usuario: true, turma: true, conselho: true },
  onSelect,
}: FiltrosDinamicosProps) {
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const [cursos, setCursos] = useState<string[]>([]); 
  const [anos, setAnos] = useState<string[]>([]); 
  const [etapasConselho, setEtapasConselho] = useState<string[]>([]); 
  const [turmas, setTurmas] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<any[]>([]);


  useEffect(() => {
    const loadCursos = async () => {
      const cursosData = await listarCursos();
      setCursos(cursosData);
    };

    const loadAnosEntrada = async () => {
      const anosData = await listarAnosEntrada(); 
      setAnos(anosData); 
    };
    loadCursos(); 
    loadAnosEntrada(); 
  }, []); 

  const handleSubToggle = (name: string) => {
    setSubOpen((prev) => (prev === name ? null : name));
  };

  const handleSelect = (grupo: string, valor: string) => {
    console.log(`Filtro Selecionado (Menu): Grupo: ${grupo}, Valor: ${valor}`);
    
    if (onSelect) onSelect(grupo, valor);
  };

  const optionClass =
    "text-left w-full py-1 px-2 hover:bg-accent/5 rounded-md text-sm";

  const gruposAtivos = [
    mostrar.usuario && "usuario",
    mostrar.turma && "turma",
    mostrar.conselho && "conselho",
  ].filter(Boolean) as string[];

  const deveMostrarLinha = (grupo: string) => {
    const index = gruposAtivos.indexOf(grupo);
    return index !== -1 && index < gruposAtivos.length - 1;
  };

  return (
    <div className="w-[300px] bg-card/80 backdrop-blur-sm rounded-2xl p-4 text-sm font-medium shadow-md space-y-3">
      {mostrar.usuario && (
        <div>
          <h3 className="font-semibold text-base mb-2">Usuario</h3>
          <div className="flex flex-col gap-1">
            {["A-Z", "Z-A", "Ativo", "Inativo"].map((opcao) => (
              <button
                key={opcao}
                onClick={() => handleSelect("Usuario", opcao)}
                className={optionClass}
              >
                {opcao}
              </button>
            ))}
          </div>
          {deveMostrarLinha("usuario") && (
            <div className="my-3 border-t border-muted" />
          )}
        </div>
      )}

      {mostrar.turma && (
        <div>
          <h3 className="font-semibold text-base mb-2">Turma</h3>
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
            
            <div className="mt-2">
              <button
                onClick={() => handleSubToggle("curso")}
                className="w-full flex justify-between items-center py-1 px-2 text-left hover:bg-accent/5 rounded-md"
              >
                <span>Curso</span>
                {subOpen === "curso" ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out pl-4 ${subOpen === "curso" ? "max-h-40 mt-1" : "max-h-0"}`}
              >
                <div className="flex flex-col gap-1">
                  {cursos.map((curso) => (
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

      
            <div className="mt-2">
              <button
                onClick={() => handleSubToggle("ano")}
                className="w-full flex justify-between items-center py-1 px-2 text-left hover:bg-accent/5 rounded-md"
              >
                <span>Ano de Entrada</span>
                {subOpen === "ano" ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out pl-4 ${subOpen === "ano" ? "max-h-40 mt-1" : "max-h-0"}`}
              >
                <div className="flex flex-col gap-1">
                  {anos.map((ano) => (
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

          {deveMostrarLinha("turma") && (
            <div className="my-3 border-t border-muted" />
          )}
        </div>
      )}

      {mostrar.conselho && (
        <div>
          <h3 className="font-semibold text-base mb-2">Conselho</h3>
          <div className="flex flex-col gap-1">
            {etapasConselho.map((etapa) => (
              <button
                key={etapa}
                onClick={() => handleSelect("Conselho", etapa)}
                className={optionClass}
              >
                {etapa}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}