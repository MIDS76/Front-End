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
import AvancarEtapaModal from "./avancarEtapaModal";
import BaixarDocumentosModal from "./BaixarDocumentosModal";



import { FileSpreadsheet } from "lucide-react";



interface ListaConselhosProps {

  estaAberto: boolean;

  aoFechar: () => void;

  turma: TurmaType | null;
  role: string;
  onBaixarDocumentos?: (conselho: ConselhoType) => void;
}

const converterData = (data: string | Date | null | undefined): string => {

  if (!data) return "—";

  const d = new Date(data);

  if (isNaN(d.getTime())) return "—";

  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

};

const mapStatus = (status: string): string => {

  const s = status.toLowerCase();
  if (s.includes("nao") || s.includes("não")) return "Não iniciado";
  if (s.includes("pre")) return "Pré-conselho"; // Atenção aqui
  if (s.includes("cons")) return "Conselho";

  if (s.includes("aguard")) return "Aguardando resultado";
  if (s.includes("result") || s.includes("final") || s.includes("conc")) return "Resultado";
  return "Não iniciado";

};



export default function ListaConselhos({
  estaAberto,
  aoFechar,

  turma,
  role,
  onBaixarDocumentos,
}: ListaConselhosProps) {

  const [modalEtapaAberto, setModalEtapaAberto] = useState(false);
  const [conselhoSelecionado, setConselhoSelecionado] = useState<ConselhoType | null>(null);

  const ordemStatus = ["Não iniciado", "Pré-conselho", "Conselho", "Aguardando resultado", "Resultado"];

  const proximoStatus = (atual: string) => {
    const index = ordemStatus.indexOf(atual);

    return ordemStatus[index + 1] || atual;
  };



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

    const encontradaJson = turmasData.find((t) => t.id === turma.id);
    const encontrada: TurmaType = encontradaJson
      ? {
          id: encontradaJson.id,
          nome: encontradaJson.nomeCurso,
          curso: encontradaJson.nomeCurso,
          dataInicio: encontradaJson.dataInicio,
          dataFinal: encontradaJson.dataFim
        }
      : turma;

    setTurmaLocal(encontrada);



    const filtrados: ConselhoType[] = conselhosData

      .filter((c) => c.turmaId === encontrada.id)

      .map((c) => ({

        id: c.id,

        turmaId: c.turmaId,
        dataInicio: c.periodoInicio,

        dataFim: c.periodoFim,
        status: mapStatus(c.status),

        etapa: mapStatus(c.status),
        turma: encontrada,

      }));



    const concluidos: ConselhoType[] = [];

    const emAndamento: ConselhoType[] = [];



    filtrados.forEach((c) => {

      if (c.etapas === "Resultado") concluidos.push(c);

      else emAndamento.push(c);

    });



    if (emAndamento.length > 1) {

      const maisRecente = emAndamento.sort(
        (a, b) => Number(new Date(b.dataInicio)) - Number(new Date(a.dataInicio))
      )[0];
      const ajustados = filtrados.map((c) =>

        c.id !== maisRecente.id && c.etapas !== "Resultado"

          ? { ...c, status: "Resultado" }

          : c

      );
      setConselhos(ajustados);

    } else {

      setConselhos(filtrados);

    }

  }, [turma]);



  const podeEditar = (status: string) => status !== "Resultado";
  const existeConselhoAberto = conselhos.some((c) => c.etapas !== "Resultado");



  const handleAvancarEtapa = () => {

    if (!conselhoSelecionado) return;
    const atualizado = conselhos.map((c) =>

      c.id === conselhoSelecionado.id

        ? { ...c, status: proximoStatus(c.etapas) }

        : c

    );
    setConselhos(atualizado);

    setModalEtapaAberto(false);

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

            {conselhos.length > 0 ? (

              <div className="flex flex-wrap justify-center pt-6 gap-6">
                
                {conselhos.map((conselho) => {
                  
                
                  const statusLower = conselho.etapas.toLowerCase();
                  const isWeg = (role || "").trim().toUpperCase() === "WEG";

                
                  const listaStatusPre = ["conselho", "aguardando resultado", "resultado"];
                  
                  const listaStatusFinal = ["aguardando resultado", "resultado"];

                  
                  const adminPodeVer = !isWeg && listaStatusPre.includes(statusLower);
                  const wegPodeVer   = isWeg  && listaStatusFinal.includes(statusLower); // Se for WEG, não vê 'conselho'
                 
                  const deveMostrarBotao = adminPodeVer || (listaStatusFinal.includes(statusLower)); 

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
                        {podeEditar(conselho.etapas) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConselhoSelecionado(conselho);
                              setModalEtapaAberto(true);
                            }}
                          >
                            <Icon icon="MoreHorizontal" />
                          </button>
                        )}
                      </div>

                      <div className="text-foreground px-4 py-3 flex items-center justify-between bg-card">
                        <div className="text-sm">
                          <span className="font-medium">Status:</span>{" "}
                          <span className="font-normal">{conselho.etapas}</span>
                        </div>

                        {deveMostrarBotao && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConselhoSelecionado(conselho);
                              if (onBaixarDocumentos) {
                                onBaixarDocumentos(conselho);
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

            ) : (

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
        statusAtual={conselhoSelecionado?.etapas || ""}
        statusProximo={proximoStatus(conselhoSelecionado?.etapas || "")}
        onConfirm={handleAvancarEtapa}

      />
    </>

  );
}