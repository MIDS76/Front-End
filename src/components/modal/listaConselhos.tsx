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

/* Converter datas para MM/YYYY */
const converterData = (data: string | Date | null | undefined): string => {
  if (!data) return "—";
  const d = new Date(data);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

/* Mapa de status → nomes finais */
const mapStatus = (status: string): string => {
  const s = status.toLowerCase();

  if (s.includes("nao") || s.includes("não")) return "Não iniciado";
  if (s.includes("pre")) return "Pré-conselho";
  if (s.includes("cons")) return "Conselho";
  if (s.includes("aguard")) return "Aguardando resultado";
  if (s.includes("result") || s.includes("final") || s.includes("conc"))
    return "Concluído";

  return "Não iniciado";
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

  /* Carregar conselhos */
  useEffect(() => {
    if (!turma) {
      setTurmaLocal(null);
      setConselhos([]);
      return;
    }

    const encontrada =
      turmasData.find((t) => t.codigoTurma === turma.codigoTurma) || turma;

    setTurmaLocal(encontrada);

    const filtrados: ConselhoType[] = conselhosData
      .filter((c) => c.turmaId === encontrada.id)
      .map((c) => ({
        id: c.id,
        turmaId: c.turmaId,

        /* Corrige o nome das datas */
        dataInicio: c.periodoInicio,
        dataFim: c.periodoFim,

        /* Status padronizado */
        status: mapStatus(c.status),
        etapa: mapStatus(c.status),

        turma: encontrada,
      }));

    /* Se houver mais de 1 em andamento → deixar só o mais novo */
    const concluidos: ConselhoType[] = [];
    const emAndamento: ConselhoType[] = [];

    filtrados.forEach((c) => {
      if (c.status === "Concluído") concluidos.push(c);
      else emAndamento.push(c);
    });

    if (emAndamento.length > 1) {
      const maisRecente = emAndamento.sort(
        (a, b) =>
          Number(new Date(b.dataInicio)) -
          Number(new Date(a.dataInicio))
      )[0];

      const ajustados = filtrados.map((c) =>
        c.id !== maisRecente.id && c.status !== "Concluído"
          ? { ...c, status: "Concluído" }
          : c
      );

      setConselhos(ajustados);
    } else {
      setConselhos(filtrados);
    }
  }, [turma]);

  /* Pode editar? (3 pontinhos só aparecem se NÃO estiver concluído) */
  const podeEditar = (status: string) => status !== "Concluído";

  /* Regras para criar novo conselho: só se não existe em andamento */
  const existeConselhoAberto = conselhos.some(
    (c) => c.status !== "Concluído"
  );

  return (
    <>
      <aside
        className={cn(
          "fixed top-[4.5rem] right-0 z-40 flex flex-col w-[30rem] sm:w-[35rem]",
          "transform transition-transform duration-300 ease-in-out",
          estaAberto ? "translate-x-0" : "translate-x-full",
          "h-full"
        )}
      >
        <div className="flex flex-col h-full shadow-xl bg-card border-l">

          {/* Conteúdo */}
          <div className="flex-1 overflow-auto px-5 pt-10 bg-background">
            {conselhos.length > 0 ? (
              <div className="flex flex-wrap justify-center pt-6 gap-6">
                {conselhos.map((conselho) => (
                  <Card
                    key={conselho.id}
                    className="rounded-[0.5rem] shadow-md overflow-hidden w-[70%] border"
                  >
                    {/* HEADER */}
                    <div className="bg-primary text-primary-foreground px-4 py-3 flex justify-between items-start">
                      <div>
                        <div className="text-xs opacity-80">Período</div>
                        <div className="text-lg font-medium">
                          {converterData(conselho.dataInicio)} até{" "}
                          {converterData(conselho.dataFim)}
                        </div>
                      </div>

                      {/* 3 pontinhos só aparecem se não estiver concluído */}
                      {podeEditar(conselho.status) && (
                        <Icon icon="MoreHorizontal" />
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="text-foreground px-4 py-3 flex items-center justify-between bg-card">
                      <div className="text-sm">
                        <span className="font-medium">Status:</span>{" "}
                        <span className="font-normal">{conselho.status}</span>
                      </div>

                      {conselho.status === "Aguardando resultado" && (
                        <Icon icon="IoIosChatboxes" />
                      )}
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

          {/* FOOTER BOTÃO */}
          <div className="p-6 bg-card mb-16">
            <div className="flex justify-center">
              <ButtonTT
                disabled={existeConselhoAberto}
                className="text-primary-foreground rounded-md text-base font-medium"
                onClick={() => setModalAberto(true)}
                mode="default"
                tooltip={
                  existeConselhoAberto
                    ? "Já existe um conselho em andamento"
                    : "Criar novo conselho para esta turma"
                }
                type="button"
              >
                Criar novo conselho para esta turma
              </ButtonTT>
            </div>
          </div>
        </div>
      </aside>

      <ConfirmarConselhoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
