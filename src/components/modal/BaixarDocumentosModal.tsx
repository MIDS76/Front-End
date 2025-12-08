"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileSpreadsheet } from "lucide-react";

interface BaixarDocumentosModalProps {
  open: boolean;
  onClose: () => void;
  conselho: any | null;
  role: string | undefined;
}

export default function BaixarDocumentosModal({
  open,
  onClose,
  conselho,
  role
}: BaixarDocumentosModalProps) {
  if (!conselho) return null;

  // 1. NORMALIZAÇÃO DO STATUS
  // Converte o status para minúsculo para facilitar a comparação (evita erro de 'Pré-Conselho' vs 'Pré-conselho')
  const statusOriginal = conselho.etapas?? "";
  const statusLower = statusOriginal.toLowerCase();

  // 2. NORMALIZAÇÃO DA ROLE
  const safeRole = (role || "").trim().toUpperCase();
  const isWeg = safeRole === "WEG";

  // --- DEBUG (Olhe no F12 do navegador) ---
  //console.log("--- DEBUG MODAL ---");
  //console.log("Role:", safeRole);
  //console.log("É WEG?", isWeg);
  //console.log("Status Original:", statusOriginal);
  //console.log("Status Normalizado:", statusLower);

  // --- REGRAS ---

  // Lista de status permitidos (tudo em minúsculo para bater com statusLower)
  const statusPermitidosPre = [
    "pré-conselho", 
    "pre-conselho", // garantindo sem acento
    "conselho", 
    "aguardando resultado", 
    "resultado"
  ];

  const statusPermitidosFinal = [
    "aguardando resultado", 
    "resultado"
  ];

  // LOGICA DO PRÉ-CONSELHO:
  // 1. O status está na lista permitida?
  const statusOkPre = statusPermitidosPre.some(s => statusLower.includes(s));
  // 2. Se for WEG, bloqueia. Se não for WEG, libera.
  const podeMostrarPre = statusOkPre && !isWeg;

  // LOGICA DO CONSELHO FINAL:
  const podeConselho = statusPermitidosFinal.some(s => statusLower.includes(s));

  //console.log("Pode Mostrar Pré?", podeMostrarPre);
  //console.log("-------------------");

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

          {/* CARD — PRÉ CONSELHO */}
          {podeMostrarPre && (
            <div className="border rounded-xl p-4 bg-muted/30 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-black" size={26} />
                <div>
                  <div className="font-medium">Pré-Conselho</div>
                  <div className="text-xs text-muted-foreground">Documentos iniciais</div>
                </div>
              </div>

              <button
                onClick={() => console.log("BAIXAR PRÉ")}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FileSpreadsheet size={18} />
                Baixar PDF
              </button>
            </div>
          )}

          {/* CARD — CONSELHO FINAL */}
          {podeConselho && (
            <div className="border rounded-xl p-4 bg-muted/30 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-black" size={26} />
                <div>
                  <div className="font-medium">Conselho</div>
                  <div className="text-xs text-muted-foreground">Documentos finais</div>
                </div>
              </div>

              <button
                onClick={() => console.log("BAIXAR CONSELHO")}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FileSpreadsheet size={18} />
                Baixar PDF
              </button>
            </div>
          )}

          {/* MENSAGEM SE NADA ESTIVER DISPONÍVEL */}
          {!podeMostrarPre && !podeConselho && (
            <div className="text-center text-muted-foreground text-sm flex flex-col gap-1">
              <p>Nenhum documento disponível.</p> 
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}