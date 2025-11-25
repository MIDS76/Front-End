import ButtonTT from "@/components/button/ButtonTT";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ActionModalProps {
  children?: React.ReactNode;
  conteudo?: React.ReactNode;
  title: string;
  closeButtonLabel?: string;
  actionButtonLabel?: string;
  destructive?: boolean;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  onClose?: () => void;
  isOpen?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  removeBg?: boolean;
  customPosition?: boolean;
}

export default function ActionModal({
  removeBg = false,
  children,
  title,
  closeButtonLabel = "Cancelar",
  actionButtonLabel = "Salvar",
  destructive,
  onConfirm,
  onClose,
  conteudo,
  isOpen,
  setOpen,
  customPosition,
}: ActionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        withOverlay={!removeBg}
        onInteractOutside={(e) => {
          e.preventDefault(); 
        }}
        className={cn(
          removeBg && customPosition && "lg:left-1/3 md:left-1/4",
          "rounded-2xl sm:max-w-[425px] [&>button:last-child]:hidden"
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <section>{conteudo}</section>
       
        <DialogFooter className="flex flex-row justify-center gap-4 pt-4">
      
          <DialogClose asChild>
            <ButtonTT
              tooltip="none"
              mode="default"
              variant="destructive"
              onClick={onClose}
            >
              {closeButtonLabel}
            </ButtonTT>
          </DialogClose>

          <ButtonTT
            tooltip={actionButtonLabel}
            mode="default"
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {actionButtonLabel}
          </ButtonTT>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
