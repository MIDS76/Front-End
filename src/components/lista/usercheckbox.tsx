import { Checkbox } from "@/components/ui/checkbox";
import { Usuario } from "@/utils/types";
import { FaStar } from "react-icons/fa";

interface UserCheckboxProps {
  usuario: Usuario;
  toggleSelected: (id: number | undefined) => void;
  isChecked?: boolean; 
}

const UserCheckbox = ({ usuario, toggleSelected, isChecked = false }: UserCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2 mr-2">
      {usuario?.nome === "Artur Neves Hopner" ? (
        <FaStar className="size-4 text-primary mr-2" />
      ) : (
        <div className="size-4" />
      )}

      {/* 
        - Uso `checked={!!isChecked}` para garantir booleano
        - onCheckedChange pode receber um valor (Radix/ui) ou não — aqui só acionamos toggle
      */}
      <Checkbox
        id={`${usuario?.id}`}
        checked={!!isChecked}
        onCheckedChange={() => toggleSelected(usuario?.id)}
      />
    </div>
  );
};

export default UserCheckbox;
