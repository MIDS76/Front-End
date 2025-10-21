import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextClickCopy, Usuario } from "../lista";
import ButtonTT from "@/components/button/ButtonTT";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mensagem, SalaChat } from "@/app/chat/page";
import { toast } from "sonner";
import { useRef } from "react";

interface ChatProps {
  contact: Usuario;
  email: string;
  closeBtn?: () => void;
  salaChat: SalaChat;
}

export function Chat({ contact, email, closeBtn, salaChat }: ChatProps) {
  const [messages, setMessages] = useState<Mensagem[]>(salaChat.mensagens);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessages([...salaChat.mensagens]);
  }, [salaChat.mensagens]);

  useEffect(() => {
    const mensagensContainer = document.getElementById("mensagens");
    if (mensagensContainer) {
      mensagensContainer.scrollTop = mensagensContainer.scrollHeight;
    }
  }, [messages]);

  const mensagensRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = mensagensRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // if (!stompClient || !isConnected) {
    //   console.error("❌ WebSocket não está conectado!");
    //   return;
    // }

    const remetente = salaChat.usuarios.find((u: Usuario) => u.email !== email);
    const destinatario = salaChat.usuarios.find(
      (u: Usuario) => u.email === email
    );

    // if (!remetente || !destinatario) {
    //   console.error("❌ Remetente ou destinatário não encontrados.");
    //   return;
    // }

    const messageData: Mensagem = {
      salaChatId: salaChat.id,
      conteudo: message,
      remetenteId: remetente?.id || 0,
      destinatarioId: destinatario?.id || 1,
      dataEnvio: new Date().toISOString(),
    };

    console.log("🔹 Enviando mensagem:", messageData);

    setMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage("");

    setTimeout(() => {
      const mensagemResposta = {
        salaChatId: salaChat.id,
        conteudo: "Espere um pouco...",
        remetenteId:
          salaChat.usuarios.find((u: Usuario) => u.email === email)?.id || 0,
        destinatarioId:
          salaChat.usuarios.find((u: Usuario) => u.email !== email)?.id || 1,
        dataEnvio: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, mensagemResposta]);
    }, 1000);

    // try {
    //   stompClient.send(
    //     "/app/chat/sendMessage",
    //     {},
    //     JSON.stringify(messageData)
    //   );

    //   subscribeToMessages(String(salaChat.id), (newMessage) => {
    //     setMessages((prevMessages) => [...prevMessages, newMessage]);
    //   });

    //   setMessage("");
    // } catch (error) {
    //   console.error("❌ Erro ao enviar mensagem:", error);
    // }
  };

  return (
    <section className="flex flex-col h-full items-center justify-center">
      <div className="flex justify-between items-center border-b border-border p-4 w-full">
        <div className="flex items-center gap-4">
          {closeBtn && (
            <ButtonTT
              variant="ghost"
              mode="small"
              icon="IoClose"
              tooltip="Fechar chat"
              onClick={closeBtn}
            />
          )}
          <Avatar>
            <AvatarImage alt={contact.nome} />
            <AvatarFallback className="select-none">
              {contact.nome.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-start">
            <span className="text-lg font-semibold">{contact.nome}</span>
            <TextClickCopy>{contact.email}</TextClickCopy>
          </div>
        </div>
        <ButtonTT
          variant="ghost"
          mode="small"
          icon="BiSolidTrashAlt"
          tooltip="Excluir conversa"
          className="text-destructive"
          onClick={() => {
            if (closeBtn) closeBtn();
            toast.error(
              "Conversa excluída! Se você a criar novamente, as mensagens voltarão."
            );
          }}
        />
      </div>

      <ScrollArea className="w-full h-full p-4 bg-accent">
        <div
          key={messages.length}
          ref={mensagensRef}
          id="mensagens"
          className="space-y-2 flex flex-col"
        >
          {/* {!isLoading && !error ? ( */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[60%] rounded-md p-2 flex flex-col px-3 ${
                msg.destinatarioId === contact.id
                  ? "bg-background text-foreground self-start"
                  : "bg-secondary text-secondary-foreground self-end"
              }`}
            >
              {msg.conteudo}
              <br />
              <span
                className={`text-sm ml-auto self-end ${
                  msg.destinatarioId === contact.id
                    ? "text-muted-foreground"
                    : "text-accent"
                }`}
              >
                {msg.dataEnvio
                  .split("T")[1]
                  .split(".")[0]
                  .split(":")
                  .slice(0, 2)
                  .join(":")}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* {!isLoading && !error && ( */}
      <div className="p-4 border-t w-full">
        <div className="flex space-x-2">
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            type="text"
            className="flex-grow"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ButtonTT
            mode="default"
            tooltip="Enviar mensagem"
            onClick={() => {
              handleSendMessage();
            }}
          >
            Enviar
          </ButtonTT>
        </div>
      </div>
      {/* )} */}
    </section>
  );
}
