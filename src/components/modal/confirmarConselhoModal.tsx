"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmarConselhoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmarConselhoModal({ open, onClose, onConfirm }: ConfirmarConselhoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-base font-semibold">
            Deseja mesmo criar um novo conselho?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 pt-4">
          <Button
            variant="destructive"
            className="bg-[#8B1C1C] hover:bg-[#A22D2D]"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="bg-[#12323A] hover:bg-[#1B4953]"
            onClick={onConfirm}
          >
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
