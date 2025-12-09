"use client";



import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/button/smallButton";
import ButtonTT from "@/components/button/ButtonTT";
import { Turma as TurmaType } from "@/utils/types";
import ConfirmarConselhoModal from "./confirmarConselhoModal";
import AvancarEtapaModal from "./avancarEtapaModal";
import { FileSpreadsheet } from "lucide-react";
import BaixarDocumentosModal from "./BaixarDocumentosModal";
import { Conselho, atualizarEtapa, listarConselhosPorTurma } from "@/api/conselho";



interface ListaConselhosProps {
  estaAberto: boolean;
  aoFechar: () => void;
  turma: TurmaType | null;
  role: string;
  onConselhoUpdate?: () => void;
}

const converterData = (data: string | Date | null | undefined): string => {
  if (!data) return "—";
  const d = new Date(data);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const mapStatusToModalText = (status: string): { pergunta: string, proximo: string } => {
  const s = status ? status.toUpperCase() : "";

  switch (s) {
    case "NAO_INICIADO":
      return { pergunta: "Deseja liberar conselho?", proximo: "Pré-conselho" };
    // ...
    case "CONSELHO":
      return { pergunta: "Deseja iniciar conselho?", proximo: "Aguardando resultado" };
    case "AGUARDANDO_RESULTADO":
      return { pergunta: "Deseja enviar feedback?", proximo: "Resultado" };
    case "RESULTADO":
      return { pergunta: "Etapa finalizada.", proximo: "Resultado" };
    default:
      return { pergunta: "Avançar Etapa?", proximo: "Próxima Etapa" };
  }
};

const getNextStatusEnum = (currentStatus: string): string => {
  const s = currentStatus ? currentStatus.toUpperCase() : "";

  switch (s) {
    case "NAO_INICIADO":
      return "PRE_CONSELHO";
    case "PRE_CONSELHO":
      return "CONSELHO";
    case "CONSELHO":
      return "AGUARDANDO_RESULTADO";
    case "AGUARDANDO_RESULTADO":
      return "RESULTADO";
    case "RESULTADO":
    default:
      return s;
  }
};

const getDisplayStatus = (status: string): string => {
  const s = status ? status.toUpperCase() : "";
  if (s === "NAO_INICIADO") return "Não iniciado";
  if (s === "PRE_CONSELHO") return "Pré-conselho (Aguardando Aluno)";
  if (s === "CONSELHO") return "Conselho";
  if (s === "AGUARDANDO_RESULTADO") return "Aguardando resultado";
  if (s === "RESULTADO") return "Resultado (Finalizado)";
  return status;
};

export default function ListaConselhos({
  estaAberto,
  aoFechar,
  turma,
  role,
  onConselhoUpdate
}: ListaConselhosProps) {

  const [modalEtapaAberto, setModalEtapaAberto] = useState(false);
  const [conselhoSelecionado, setConselhoSelecionado] = useState<Conselho | null>(null);
  const [modalDocumentosAberto, setModalDocumentosAberto] = useState(false);

  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchConselhos = useCallback(async () => {
    if (!turma?.id) return;
    setLoading(true);
    try {
      const conselhosDaAPI = await listarConselhosPorTurma(turma.id);

      const conselhosOrdenados = (conselhosDaAPI || []).sort((a, b) => {
        const dateA = a.dataInicio ? new Date(a.dataInicio).getTime() : 0;
        const dateB = b.dataInicio ? new Date(b.dataInicio).getTime() : 0;
        return dateB - dateA;
      });

      setConselhos(conselhosOrdenados);

    } catch (error) {
      console.error("Erro ao buscar conselhos:", error);
    } finally {
      setLoading(false);
    }
  }, [turma]);

  useEffect(() => {
    fetchConselhos();
  }, [fetchConselhos]);

  const handleConfirm = () => {
    window.location.href = "/criar/conselho";
    setModalAberto(false);
  };

  const podeEditar = (status: string) => status.toLowerCase() !== "resultado";
  const existeConselhoAberto = conselhos.some((c) => c.etapas?.toLowerCase() !== "resultado");

  const handleAvancarEtapa = async () => {
    if (!conselhoSelecionado || !conselhoSelecionado.id || !conselhoSelecionado.etapas) return;

    const currentEtapa = conselhoSelecionado.etapas.toUpperCase();
    const novaEtapa = getNextStatusEnum(currentEtapa);

    if (currentEtapa === "CONSELHO") {
      setModalEtapaAberto(false);
      window.location.href = `/conselhoCoordenacao?conselhoId=${conselhoSelecionado.id}`;
      return;
    }

    if (novaEtapa === conselhoSelecionado.etapas) {
      console.warn("Tentativa de avançar uma etapa finalizada ou desconhecida.");
      setModalEtapaAberto(false);
      return;
    }

    try {
      await atualizarEtapa(conselhoSelecionado.id, novaEtapa);

      await fetchConselhos();

      if (onConselhoUpdate) {
        onConselhoUpdate();
      }

      setModalEtapaAberto(false);
      setConselhoSelecionado(null);

    } catch (error) {
      console.error("Falha ao avançar etapa:", error);
    }
  };

  const deveMostrarBotaoAvanco = (status: string) => {
    const s = status.toLowerCase();
    return s === "nao_iniciado" || s === "conselho" || s === "aguardando_resultado";
  };

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
          <div className="flex-1 overflow-auto px-5 pt-10 bg-background">

            {loading && (
              <div className="text-center py-4 text-primary">
                Carregando conselhos...
              </div>
            )}

            {!loading && conselhos.length > 0 ? (
              <div className="flex flex-wrap justify-center pt-6 gap-6">
                {conselhos.map((conselho) => {
                  const statusUpper = conselho.etapas?.toUpperCase();
                  const isWeg = (role || "").trim().toUpperCase() === "WEG";

                  const listaStatusAdmin = ["CONSELHO", "AGUARDANDO_RESULTADO", "RESULTADO"];
                  const listaStatusWeg = ["AGUARDANDO_RESULTADO", "RESULTADO"];

                  const deveMostrarBotaoDocumentos =
                    (!isWeg && listaStatusAdmin.includes(statusUpper ?? "")) ||
                    (isWeg && listaStatusWeg.includes(statusUpper ?? ""));

                  return (
                    <Card
                      key={conselho.id}
                      className="rounded-[0.5rem] shadow-md overflow-hidden w-[70%] border"
                    >
                      <div className="bg-primary text-primary-foreground px-4 py-3 flex justify-between items-start">
                        <div>
                          <div className="text-xs opacity-80">Período</div>
                          <div className="text-lg font-medium">
                            {converterData(conselho.dataInicio)} até {converterData(conselho.dataFim)}
                          </div>
                        </div>
                        {podeEditar(conselho.etapas ?? "") && deveMostrarBotaoAvanco(conselho.etapas ?? "") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (conselho.id) {
                                setConselhoSelecionado(conselho);
                                setModalEtapaAberto(true);
                              }
                            }}
                          >
                            <Icon icon="MoreHorizontal" />
                          </button>
                        )}
                        {podeEditar(conselho.etapas ?? "") && conselho.etapas?.toLowerCase() === "pre_conselho" && (
                          <div className="text-xs self-center text-primary-foreground opacity-90 italic">
                            Aguardando Aluno
                          </div>
                        )}
                      </div>

                      <div className="text-foreground px-4 py-3 flex items-center justify-between bg-card">
                        <div className="text-sm">
                          <span className="font-medium">Status:</span>{" "}
                          <span className="font-normal">{getDisplayStatus(conselho.etapas ?? "")}</span>
                        </div>

                        {deveMostrarBotaoDocumentos && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (conselho.id) {
                                setConselhoSelecionado(conselho);
                                setModalDocumentosAberto(true);
                              }
                            }}
                            title="Baixar documentos"
                          >
                            <FileSpreadsheet size={22} className="opacity-70 hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

            ) : (!loading &&

              <div className="flex flex-col items-center justify-center h-60 text-muted-foreground font-normal">

                Nenhum conselho cadastrado

              </div>

            )}

          </div>



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



      <AvancarEtapaModal
        open={modalEtapaAberto}
        onClose={() => setModalEtapaAberto(false)}
        statusAtual={mapStatusToModalText(conselhoSelecionado?.etapas || "").pergunta}
        statusProximo={mapStatusToModalText(conselhoSelecionado?.etapas || "").proximo}
        onConfirm={handleAvancarEtapa}

      />

      <BaixarDocumentosModal
        open={modalDocumentosAberto}
        onClose={() => setModalDocumentosAberto(false)}
        conselho={conselhoSelecionado}
        role={role}
      />
    </>

  );
}