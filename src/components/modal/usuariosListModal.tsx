import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lista, { Usuario } from "../lista/lista";
import { useState } from "react";
import ButtonTT from "../button/ButtonTT";

import { toast } from "sonner";

import { DialogClose } from "@radix-ui/react-dialog";

interface UsuariosListModalProps {
  usuarios: Usuario[];
  children: React.ReactNode;
  title: string;
  description: string;
  closeButtonLabel?: string;
  actionButtonLabel?: string;
  destructive?: boolean;
}

export default function UsuariosListModal({
  children,
  title,
  description,
  usuarios,
}: UsuariosListModalProps) {
  // const [selectedContact, setSelectedContact] = useState<Usuario | null>(null);
  // const {
  //   isConnected,
  //   stompClient,
  //   subscribeToMessages,
  //   unsubscribeFromMessages,
  // } = useWebSocket();
  // contact: Usuario
  const handleCreate = async () => {
    // await api
    //   .post(`/chat/criar-sala`, {
    //     emails: [contact.email, "artur@gmail.com"],
    //   })
    //   .then((response) => {
    //     const newChatId = response.data.id;
    //     subscribeToMessages(newChatId, (newMessage) => {
    //       console.log(`Nova mensagem na sala ${newChatId}:`, newMessage);
    //     });
    //     toast.success("Chat criado com sucesso!");
    //     mutate(`chat/buscar-salas-por-usuario?email=${"artur@gmail.com"}`);
    //   })
    //   .catch((error) => {
    //     toast.error("Erro ao criar o chat: " + error.response.data.mensagem);
    //   });
    toast.success("Novo chat criado!");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div>
          <DialogHeader className="p-4 pt-0">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Lista
            isDialogOpen={isModalOpen}
            setIsDialogOpen={setIsModalOpen}
            // tipo="chat"
            // className="h-72"
            usuarios={usuarios}
            setSelectedContact={() => {}}
            tipo={"checkbox"}
            selectedUsers={[]}
          />
        </div>
        <div className="w-full flex justify-end gap-4 px-4">
          <DialogClose asChild>
            <ButtonTT mode="default" tooltip="none" variant={"outline"}>
              Fechar
            </ButtonTT>
          </DialogClose>
          <DialogClose asChild>
            <ButtonTT
              //selectedContact!
              onClick={() => handleCreate()}
              mode="default"
              tooltip="none"
              variant={"default"}
            >
              Criar chat
            </ButtonTT>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
