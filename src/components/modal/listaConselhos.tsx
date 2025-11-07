"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/button/smallButton";
import ButtonTT from "@/components/button/ButtonTT";
import turmasData from "@/data/turma.json";
import conselhosData from "@/data/conselho.json";
import { Turma as TurmaType, Conselho as ConselhoType } from "@/utils/types";
import ConfirmarConselhoModal from "./confirmarConselhoModal";

interface ListaConselhosProps {
  estaAberto: boolean;
  aoFechar: () => void;
  turma: TurmaType | null;
}

// Função que converte "2023-08-01" → "08/2023"
const converterData = (data: string | Date | null | undefined): string => {
  if (!data) return "—";

  // Se já for um Date, extrai mês/ano diretamente
  if (data instanceof Date) {
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = String(data.getFullYear());
    return `${mes}/${ano}`;
  }

  // Tenta dividir formato "YYYY-MM-DD"
  const partes = data.split("-");
  if (partes.length >= 2) {
    const mes = partes[1];
    const ano = partes[0];
    return `${mes}/${ano}`;
  }

  // Fallback: tenta parsear a string para Date
  const parsed = new Date(data);
  if (!isNaN(parsed.getTime())) {
    const mes = String(parsed.getMonth() + 1).padStart(2, "0");
    const ano = String(parsed.getFullYear());
    return `${mes}/${ano}`;
  }

  return "—";
};

export default function ListaConselhos({
  estaAberto = false,
  aoFechar,
  turma,
}: ListaConselhosProps) {
  const [conselhos, setConselhos] = useState<ConselhoType[]>([]);
  const [turmaLocal, setTurmaLocal] = useState<TurmaType | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const handleConfirm = () => {
    window.location.href = "/criar/conselho";
    setModalAberto(false);
  };

  useEffect(() => {
    if (!turma) {
      setTurmaLocal(null);
      setConselhos([]);
      return;
    }

    const encontrada =
      turmasData.find((t) => t.codigoTurma === turma.codigoTurma) || turma;
    setTurmaLocal(encontrada);

    const filtrados = conselhosData
      .filter((c) => c.turmaId === encontrada.id)
      .map((c) => ({
        id: c.id,
        dataInicio: c.periodoInicio,
        dataFim: c.periodoFim,
        status: c.status,
        turma: encontrada,
      })) as unknown as ConselhoType[];

    setConselhos(filtrados);
  }, [turma]);

  return (
    <>
      <aside
        className={cn(
          "absolute right-0 top-[4.5rem] z-40 flex flex-col w-full sm:w-[30rem]",
          "transform transition-transform duration-300 ease-in-out",
          estaAberto ? "translate-x-0" : "translate-x-full",
          "h-[calc(100vh-4.5rem)]"
        )}
      >
        <div className="flex-1 flex flex-col h-full shadow-xl bg-card border-l">
          {/* Conteúdo principal */}
          <div className="flex-1 overflow-auto p-6 bg-background">
            {conselhos.length > 0 ? (
              <div className="flex flex-col gap-6">
                {conselhos.map((conselho, idx) => (
                  <Card
                    key={conselho.id ?? idx}
                    className="rounded-lg shadow-md overflow-hidden cursor-pointer border"
                  >
                    {/* header */}
                    <div className="bg-primary text-primary-foreground px-4 py-3 flex justify-between items-start">
                      <div>
                        <div className="text-xs opacity-80 font-normal">
                          Período
                        </div>
                        <div className="text-lg font-medium">
                          {converterData(conselho.dataInicio)} até{" "}
                          {converterData(conselho.dataFim)}
                        </div>
                      </div>
                      <div className="opacity-90">
                        <Icon icon="MoreHorizontal" />
                      </div>
                    </div>

                    {/* footer */}
                    <div className="text-foreground px-4 py-3 flex items-center justify-between bg-card">
                      <div className="text-sm">
                        <span className="font-medium">Status:</span>{" "}
                        <span className="font-normal">
                          {conselho.status ?? "Em andamento"}
                        </span>
                      </div>

                      {conselho.status === "Finalizado" ? (
                        <Icon icon="IoIosChatboxes" />
                      ) : null}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-muted-foreground font-normal">
                Nenhum conselho cadastrado
              </div>
            )}
          </div>

          {/* Rodapé - Updated button onClick */}
          <div className="p-6 bg-card">
            <div className="flex justify-center">
              <ButtonTT
                className="text-primary-foreground px-6 py-3 rounded-md text-base font-medium"
                onClick={() => setModalAberto(true)}
                mode="default"
                tooltip="Criar novo conselho para esta turma"
                type="button"
              >
                Criar novo conselho para esta turma
              </ButtonTT>
            </div>
          </div>
        </div>
      </aside>

      {/* Add confirmation modal */}
      <ConfirmarConselhoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
