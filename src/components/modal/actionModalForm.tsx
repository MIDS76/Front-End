"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ButtonTT from "@/components/button/ButtonTT";
import { cn } from "@/lib/utils";
import React from "react";

interface ActionModalFormProps {
  children?: React.ReactNode;
  conteudo?: React.ReactNode;
  title: string;
  description: string;
  closeButtonLabel?: string;
  actionButtonLabel?: string;
  destructive?: boolean;
  onSubmit: (formData: FormData) => Promise<void> | void;
  onClose?: () => void;
  isOpen?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  removeBg?: boolean;
  customPosition?: boolean;
}

export default function ActionModalForm({
  removeBg = false,
  children,
  title,
  description,
  closeButtonLabel = "Cancelar",
  actionButtonLabel = "Confirmar",
  destructive,
  onSubmit,
  onClose,
  conteudo,
  isOpen,
  setOpen,
  customPosition,
}: ActionModalFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        withOverlay={!removeBg}
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          removeBg && customPosition && "lg:left-1/3 md:left-1/4",
          "rounded-2xl sm:max-w-[425px] [&>button:last-child]:hidden"
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await onSubmit(formData);
          }}
        >
          <section>{conteudo}</section>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
            <DialogClose asChild>
              <ButtonTT
                tooltip="none"
                mode="default"
                variant="outline"
                onClick={onClose}
              >
                {closeButtonLabel}
              </ButtonTT>
            </DialogClose>
            <ButtonTT
              tooltip={actionButtonLabel}
              mode="default"
              variant={destructive ? "destructive" : "default"}
              type="submit"
            >
              {actionButtonLabel}
            </ButtonTT>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
