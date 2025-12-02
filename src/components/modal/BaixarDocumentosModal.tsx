"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileSpreadsheet } from "lucide-react";

interface BaixarDocumentosModalProps {
  open: boolean;
  onClose: () => void;
  conselho: any | null;
}

export default function BaixarDocumentosModal({
  open,
  onClose,
  conselho
}: BaixarDocumentosModalProps) {
  if (!conselho) return null;

  const status = conselho.status;

  // Pré-Conselho liberado a partir de qualquer fase
  const podePre = ["Pré-conselho", "Conselho", "Aguardando resultado", "Resultado"].includes(status);

  // Conselho liberado quando o status for "Aguardando resultado" OU "Resultado"
  const podeConselho = ["Aguardando resultado", "Resultado"].includes(status);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) onClose();
      }}
    >
      <DialogContent
        className="max-w-[480px] rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Baixar Documentos do Conselho
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-4">

          {/* CARD - PRÉ CONSELHO */}
          {podePre && (
            <div className="border rounded-xl p-4 bg-muted/30 flex items-center justify-between select-none pointer-events-none">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-black" size={26} />
                <div>
                  <div className="font-medium">Pré-Conselho</div>
                  <div className="text-xs text-muted-foreground">Documentos iniciais</div>
                </div>
              </div>

              <button
                onClick={() => console.log("BAIXAR PRÉ")}
                disabled={!podePre}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium pointer-events-auto
                  ${podePre ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground cursor-not-allowed"}
                `}
              >
                <FileSpreadsheet size={18} />
                Baixar PDF
              </button>
            </div>
          )}

          {/* CARD - CONSELHO */}
          {podeConselho && (
            <div className="border rounded-xl p-4 bg-muted/30 flex items-center justify-between select-none pointer-events-none">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-black" size={26} />
                <div>
                  <div className="font-medium">Conselho</div>
                  <div className="text-xs text-muted-foreground">Documentos finais</div>
                </div>
              </div>

              <button
                onClick={() => console.log("BAIXAR CONSELHO")}
                disabled={!podeConselho}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium pointer-events-auto
                  ${podeConselho ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground cursor-not-allowed"}
                `}
              >
                <FileSpreadsheet size={18} />
                Baixar PDF
              </button>
            </div>
          )}

          {/* Nenhum documento disponível */}
          {!podePre && !podeConselho && (
            <p className="text-center text-muted-foreground text-sm">
              Nenhum documento disponível para este status.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
