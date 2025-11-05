import { Checkbox } from "@/components/ui/checkbox";
import { Usuario } from "@/utils/types";
import { FaStar } from "react-icons/fa";

interface UserCheckboxProps {
  usuario: Usuario;
  toggleSelected: (id: number | undefined) => void;
}

const UserCheckbox = ({ usuario, toggleSelected }: UserCheckboxProps) => (
  <div className="flex items-center space-x-2 mr-2">
    {usuario?.nome === "Artur Neves Hopner" ? (
      <FaStar className="size-4 text-primary mr-2" />
    ) : (
      <div className="size-4" />
    )}
    <Checkbox
      id={`${usuario?.id}`}
      onCheckedChange={() => toggleSelected(usuario?.id)}
    />
  </div>
);

export default UserCheckbox;
