"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AvancarEtapaModalProps {
  open: boolean;
  onClose: () => void;
  statusAtual: string;
  statusProximo: string;
  onConfirm: () => void;
}

export default function AvancarEtapaModal({
  open,
  onClose,
  statusAtual,
  statusProximo,
  onConfirm,
}: AvancarEtapaModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
      <Card
        className={cn(
          "p-6 w-[460px] max-h-[420px] flex flex-col gap-5 rounded-xl shadow-2xl border border-border",
          "animate-in zoom-in-95 ease-out duration-200 bg-card"
        )}
      >
        {/* Título */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <h2 className="text-xl font-semibold">Avançar para a próxima etapa?</h2>
          <p className="text-sm text-muted-foreground">
            Essa ação mudará o status do conselho.
          </p>
        </div>

        {/* Status atual ➜ Próxima etapa (flecha grande) */}
        <div className="bg-muted/30 rounded-md p-4 text-center">
          <p className="text-sm font-medium flex items-center justify-center gap-4">
            <span className="text-base">{statusAtual}</span>

            <span className="text-3xl font-bold text-primary leading-none">
              ➜
            </span>

            <span className="text-base text-primary font-semibold">
              {statusProximo}
            </span>
          </p>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 mt-1">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-5 py-2 text-sm"
          >
            Cancelar
          </Button>

          <Button
            onClick={onConfirm}
            className="px-5 py-2 bg-[#2B7A78] hover:bg-[#236b6a] text-white text-sm"
          >
            Avançar
          </Button>
        </div>
      </Card>
    </div>
  );
}
