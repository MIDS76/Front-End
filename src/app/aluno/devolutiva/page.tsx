import ButtonTT from "@/components/button/ButtonTT";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import { Feedback, conselhos } from "../page";
import { useState } from "react";
import MedModal from "@/components/modal/medModal";
import BackgroundDevolutiva from "@/components/ui/background-devolutiva";


interface DevolutivaAlunoProps {
    isOpen: boolean;
    onClose: () => void;
    feedback: Feedback | null;
    periodo?: string;
  }
  
  function DevolutivaAluno({ isOpen, onClose, feedback, periodo }: DevolutivaAlunoProps) {
    return (
      <aside
        className={cn(
          "fixed top-[5rem] right-0 z-50 w-full sm:w-[80%] md:w-[60%] lg:w-[480px] h-[calc(100vh-5rem)] p-4 sm:p-6",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-10 z-50">
          <ButtonTT
            variant="ghost"
            mode="small"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            icon="IoClose"
            tooltip="none"
            className="inline-flex items-center justify-center rounded-md h-10 w-10 text-accent-foreground hover:bg-accent hover:text-accent-foreground"
          />
        </div>
  
        <Card className="h-full border-t-0 shadow-md">
          <CardHeader>
            <CardTitle className="font-title text-accent-foreground text-lg mb-1">
              Conselho Publicado
            </CardTitle>
            <span className="text-sm text-muted-foreground mb-4">
              {periodo || "Período não informado"}
            </span>
          </CardHeader>
  
          <CardContent className="flex flex-col h-[calc(100%-7rem)] overflow-y-auto px-2 md:px-4 pb-4">
            {!feedback ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-center px-2">
                Nenhum conselho selecionado!
              </div>
            ) : (
              <div className="flex flex-col gap-6 sm:gap-8 flex-1">
                <div className="flex flex-col flex-1">
                  <Label className="mb-2 text-base font-semibold">Pontos Fortes</Label>
                  <Textarea
                    value={feedback.pontosFortes}
                    readOnly
                    className="resize-none min-h-[150px] sm:min-h-[160px] md:min-h-[180px] text-sm leading-relaxed"
                  />
                </div>
  
                <div className="flex flex-col flex-1">
                  <Label className="mb-2 text-base font-semibold">
                    Oportunidades de Melhoria
                  </Label>
                  <Textarea
                    value={feedback.oportunidades}
                    readOnly
                    className="resize-none min-h-[150px] sm:min-h-[160px] md:min-h-[180px] text-sm leading-relaxed"
                  />
                </div>
  
                <div className="flex flex-col flex-1">
                  <Label className="mb-2 text-base font-semibold">Sugestões</Label>
                  <Textarea
                    value={feedback.sugestoes}
                    readOnly
                    className="resize-none min-h-[150px] sm:min-h-[160px] md:min-h-[180px] text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    );
  }

  // ------------------ COMPONENTE PRINCIPAL ------------------
export default function AlunoHome() {
    const [selectedConselho, setSelectedConselho] = useState<number | null>(null);
    const conselhoSelecionado = conselhos.find((c) => c.id === selectedConselho);
  
    return (
      <div className="flex flex-col lg:flex-row h-screen">
        {/* LISTA DE CONSELHOS */}
        <div className="flex-1 p-8">
          <div className="flex items-center gap-2 mb-6 mt-20">
            <h1 className="font-title text-2xl font-bold text-accent-foreground px-4">
              Meus Conselhos
            </h1>
          </div>
  
          {/* GRID DE CONSELHOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {conselhos.length > 0 ? (
              conselhos.map((c) => (
                <MedModal
                  key={c.id}
                  courseCode={c.periodo}
                  courseName="Conselho"
                  onClick={() => setSelectedConselho(c.id)}
                  className={cn(
                    "transition-transform hover:scale-[1.02] cursor-pointer",
                    selectedConselho === c.id && "ring-2 ring-primary scale-[1.02]"
                  )}
                >
                  <div className="text-muted-foreground text-right">
                    <span className="font-semibold">Status:</span> {c.status}
                  </div>
                </MedModal>
              ))
            ) : (
              <div className="text-center text-muted-foreground mt-6">
                Nenhum conselho encontrado!
              </div>
            )}
          </div>
        </div>
  
        {/* PAINEL LATERAL */}
        <BackgroundDevolutiva>
          <DevolutivaAluno
            isOpen={selectedConselho !== null}
            onClose={() => setSelectedConselho(null)}
            feedback={conselhoSelecionado?.feedback ?? null}
            periodo={conselhoSelecionado?.periodo}
          />
        </BackgroundDevolutiva>
      </div>
    );
  }