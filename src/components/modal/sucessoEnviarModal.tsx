import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ButtonTT from "@/components/button/ButtonTT"; // Botão personalizado

interface SucessoEnviarModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  handleGoHome:() => void;
}

export default function SucessoEnviarModal({
    isOpen,
    setOpen,
    handleGoHome,
  }: SucessoEnviarModalProps) {
    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-lg p-8 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Pré-conselho enviado com sucesso!
            </DialogTitle>
          </DialogHeader> 
  
          <DialogFooter className="flex justify-center mt-6 gap-4">
  
            <ButtonTT
              tooltip="Voltar para a página inicial"
              mode="default"
              onClick={handleGoHome}
              className="w-auto px-8 py-3 rounded-lg text-white"
            >
              Voltar para a página inicial
            </ButtonTT>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }