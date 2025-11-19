import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/button/smallButton";
import ActionModal from "@/components/modal/actionModal";
import { Usuario } from "@/utils/types";
import ButtonTT from "../button/ButtonTT";

interface UserActionsProps {
  usuario: Usuario;
  isDropDownOpen: boolean;
  setIsDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingUser: React.Dispatch<React.SetStateAction<Usuario>>;
  isConfirmOpen: boolean;
  setIsConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  removeUser?: () => void;
}

const UserActions = ({
  usuario,
  isDropDownOpen,
  setIsDropDownOpen,
  setEditingUser,
  setIsDialogOpen
}: UserActionsProps) => (
    
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
          onClick={(e: { stopPropagation: () => void }) => {
            e.stopPropagation();
            setIsDialogOpen(false);
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

export default UserActions;