import { useState } from "react"; // 1. Importe o useState
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/button/smallButton";
import ActionModal from "@/components/modal/actionModal";
import { Usuario } from "@/utils/types";
import ButtonTT from "../button/ButtonTT";

interface UserActionsProps {
  usuario: Usuario;
  // 2. Removemos isDropDownOpen, setIsDropDownOpen, isConfirmOpen daqui
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingUser: React.Dispatch<React.SetStateAction<Usuario>>;
  removeUser?: () => void;
}

const UserActions = ({
  usuario,
  setEditingUser,
  setIsDialogOpen,
  removeUser
}: UserActionsProps) => {
  
  // 3. Criamos o estado local aqui dentro
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger asChild>
          <div>
            <ButtonTT
              tooltip="Opções"
              mode="small"
              variant="ghost"
              icon="MoreVertical"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              // Agora setIsDropDownOpen existe localmente, o erro vai sumir
              setIsDropDownOpen(false); 
              
              // Pequeno timeout para garantir que o menu feche visualmente antes do modal abrir
              setTimeout(() => {
                setEditingUser(usuario);
                setIsDialogOpen(true);
              }, 100);
            }}
            className="cursor-pointer text-foreground"
          >
            <Icon icon="MdEditSquare" /> Editar
          </DropdownMenuItem>
          
          {/* Se você tiver o botão de excluir, usaria setIsConfirmOpen aqui */}
          
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Se houver um ActionModal de exclusão, ele usaria o isConfirmOpen local aqui */}
      {/* <ActionModal 
        isOpen={isConfirmOpen} 
        setIsOpen={setIsConfirmOpen} 
        action={removeUser} 
        ... 
      /> 
      */}
    </div>
  );
};

export default UserActions;