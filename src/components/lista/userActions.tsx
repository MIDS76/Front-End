import { useState } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/button/smallButton";
import ActionModal from "@/components/modal/actionModal";
import { Usuario } from "@/utils/types";
import ButtonTT from "../button/ButtonTT";

interface UserActionsProps {
  usuario: Usuario;
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
              setIsDropDownOpen(false); 
              
              setTimeout(() => {
                setEditingUser(usuario);
                setIsDialogOpen(true);
              }, 100);
            }}
            className="cursor-pointer text-foreground"
          >
            <Icon icon="MdEditSquare" /> Editar
          </DropdownMenuItem>
          
          
        </DropdownMenuContent>
      </DropdownMenu>

     
    </div>
  );
};

export default UserActions;