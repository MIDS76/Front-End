import { useState } from "react";
import SearchBar from "../input/searchBar";
import UsuariosListModal from "../modal/usuariosListModal";
import ButtonTT from "../button/ButtonTT";
import { Usuario } from "@/utils/types";

interface ChatListProps {
  onSelectUsuario: (contact: Usuario) => void;
  selectedContact: Usuario | null;
  usuarios: Usuario[];
  todosUsuarios: Usuario[];
}

export default function ChatList({
  onSelectUsuario,
  selectedContact,
  usuarios,
  todosUsuarios,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="p-4 flex flex-col gap-4">
      <SearchBar
        placeholder="Buscar contatos"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={false}
      >
        <UsuariosListModal
          usuarios={todosUsuarios}
          title="Novo contato"
          description="Selecione um novo contato"
        >
          <ButtonTT
            className="shrink-0"
            mode="small"
            tooltip="Novo contato"
            icon="RiChatNewLine"
          />
        </UsuariosListModal>
      </SearchBar>
      <ul>
        {/*usuarios?.map((contact) => (
          <ListCell
            key={contact.id}
            usuario={contact}
            tipo="chat"
            selected={selectedContact?.id === contact.id}
            toggleSelected={() => onSelectUsuario(contact)}
            isDialogOpen={false}
            setIsDialogOpen={() => {}}
            setEditingUser={() => {}}
          />
        ))*/}
      </ul>
    </section>
  );
}
