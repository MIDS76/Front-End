"use client";

import React, { useState, useEffect } from "react";
import { Chat } from "@/components/chat/chat";
import { useWindowSize } from "usehooks-ts";
import { Page, Usuario } from "@/utils/types";
import ChatList from "@/components/chat/chatList";
import ProtectedRoute from "@/components/ProtectedRoute";

export interface SalaChat {
  id: number;
  usuarios: Usuario[];
  mensagens: Mensagem[];
}

export interface Mensagem {
  id?: number;
  salaChatId?: number;
  remetenteId: number;
  destinatarioId: number;
  conteudo: string;
  dataEnvio: string;
}

export default function Home() {
  const [windowSize, setWindowSize] = useState({ width: 1920 });
  const { width } = useWindowSize();

  useEffect(() => {
    setWindowSize({ width });
  }, [width]);

  const [selectedContact, setSelectedContact] = useState<Usuario | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleContactSelect = async (contact: Usuario) => {
    setSelectedContact(contact);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setSelectedContact(null);
    setIsChatOpen(false);
  };

  const usuarios: Page<Usuario> = {
    content: [
      {
        id: 2,
        email: "saymon@gmail.com",
        nome: "Saymon",
        role: "ALUNO",
      },
      {
        id: 3,
        email: "gabriel@gmail.com",
        nome: "Gabriel",
        role: "ALUNO",
      },
      {
        id: 4,
        email: "jose@gmail.com",
        nome: "Jose",
        role: "ALUNO",
      },
      {
        id: 5,
        email: "joao@gmail.com",
        nome: "Joao",
        role: "ALUNO",
      },
      {
        id: 6,
        email: "pedro@gmail.com",
        nome: "Pedro",
        role: "ALUNO",
      },
    ],
    totalElements: 2,
    totalPages: 1,
    size: 2,
    number: 0,
  };

  const data: SalaChat[] = Array.from({ length: usuarios.content.length }).map(
    (_, index) => ({
      id: index,
      usuarios: [
        {
          id: 1,
          email: "artur@gmail.com",
          nome: "Artur",
          role: "ALUNO",
        },
        usuarios.content[index],
      ],
      mensagens: [],
    })
  );

  return (
    <ProtectedRoute>
    <main className="h-[calc(100vh-5rem)] bg-background flex">
      {windowSize.width <= 768 && isChatOpen ? (
        ""
      ) : (
        <div className=" w-full md:w-1/3 lg:w-1/4 border-r border-border">
          <ChatList
            usuarios={usuarios?.content || []}
            todosUsuarios={usuarios?.content || []}
            onSelectUsuario={handleContactSelect}
            selectedContact={selectedContact}
          />
        </div>
      )}
      {selectedContact ? (
        <div className={"w-full md:block lg:w-3/4"}>
          <Chat
            salaChat={
              data?.find((chat) =>
                chat.usuarios.find((u) => u.id === selectedContact.id)
              ) ?? data[0]
            }
            contact={selectedContact}
            email={"artur@gmail.com"}
            closeBtn={handleCloseChat}
          />
        </div>
      ) : (
        <div className="hidden w-2/3 lg:w-3/4 md:flex items-center justify-center text-muted-foreground">
          Selecione um contato
        </div>
      )}
    </main>
    </ProtectedRoute>
  );
}

