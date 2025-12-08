import UserInfo from "./userInfo";
import UserActions from "./userActions";
import UserCheckbox from "./usercheckbox";
import { Conselho, Usuario } from "@/utils/types"; // Supondo que Conselho venha daqui
import AddButton from "../button/addButton";

// Mantive apenas as props que vi sendo usadas na lógica
interface ListCellProps {
  usuario?: Usuario;
  copy?: boolean;
  toggleSelected: (id: number | undefined) => void;
  tipo: "checkbox" | "edit" | "add" | "limpa"; // Removi tipos não usados no switch
  onClick?: () => void;
  isUserAlreadySelected?: boolean;
  setIsDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>; // Opcional pois nem todo tipo usa
  setEditingUser?: React.Dispatch<React.SetStateAction<Usuario>>; // Opcional
  ativo?: boolean;
}

export default function ListCell({
  usuario,
  copy,
  toggleSelected,
  tipo,
  isUserAlreadySelected,
  setIsDialogOpen,
  setEditingUser,
  onClick,
  ativo,
}: ListCellProps) {
  
  // Lógica de CSS extraída para facilitar leitura
  const baseClasses = "flex items-center justify-between py-2 px-3 rounded-md shadow mb-2 last:mb-0 transition-colors";
  
  let interactionClasses = "bg-card";
  if (tipo === "limpa") {
    interactionClasses = `cursor-pointer ${
      ativo
        ? "bg-[hsl(var(--primary)/0.15)] border border-[hsl(var(--primary))]"
        : "hover:bg-[hsl(var(--muted))] bg-card"
    }`;
  }

  // Se não houver usuário, retornamos null ou um esqueleto para evitar erros
  if (!usuario && tipo !== 'add') return null;

  return (
    <li
      className={`${baseClasses} ${interactionClasses}`}
      // Apenas adiciona handlers de clique se for do tipo 'limpa'
      onClick={tipo === "limpa" ? onClick : undefined}
      role={tipo === "limpa" ? "button" : undefined}
      tabIndex={tipo === "limpa" ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && tipo === "limpa" && onClick) {
          e.preventDefault(); // Previne scroll ao apertar espaço
          onClick();
        }
      }}
    >
      <div className="flex flex-row items-center w-full">
        <UserInfo
          nome={usuario?.nome}
          email={usuario?.email}
          copy={copy}
          active={usuario?.ativo ?? true}
        />
        <div className="text-sm text-muted-foreground inline-block">
          <p className={`${!usuario?.ativo ? "text-gray-400" : ""}`}>
            {(usuario?.role ?? "").toLocaleUpperCase()}
          </p>
        </div>
      </div>

      {/* Renderização Condicional Limpa */}
      <div className="ml-2">
        {tipo === "edit" && setEditingUser && setIsDialogOpen && (
          // Mova o isDropDownOpen e isConfirmOpen para DENTRO deste componente se possível
          <UserActions
            usuario={usuario!}
            setEditingUser={setEditingUser}
            setIsDialogOpen={setIsDialogOpen}
          />
        )}

        {tipo === "checkbox" && (
          <UserCheckbox
            usuario={usuario!}
            toggleSelected={toggleSelected}
            isChecked={isUserAlreadySelected}
          />
        )}

        {tipo === "add" && (
          <AddButton
            isUserAlreadySelected={isUserAlreadySelected}
            onOpen={() => toggleSelected(usuario?.id)}
          />
        )}
      </div>
    </li>
  );
}