"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import SockJs from "sockjs-client";  // Importando SockJS
import Stomp, { Client, Message } from "stompjs";  // Importando STOMP
import { toast } from "sonner";  // Para exibir mensagens de toast

// Tipo de Notificação esperado
interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  lido: boolean;
  horario: string;
}

interface WebSocketContextType {
  stompClient: Client | null;
  isConnected: boolean;
  subscribeToNotifications: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socketClient = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // Conectar ao WebSocket quando o componente for montado
  useEffect(() => {
    const ws = new SockJs("http://localhost:3000/ws");  // URL do WebSocket
    const stompClient = Stomp.over(ws);
    socketClient.current = stompClient;

    stompClient.connect({}, () => {
      setIsConnected(true);
      subscribeToNotifications();  // Inscrever-se para notificações assim que conectado
    }, () => {
      setIsConnected(false);  // Se falhar a conexão
    });

    // Limpeza ao desmontar o componente
    return () => {
      if (socketClient.current && isConnected) {
        socketClient.current.disconnect(() => {
          setIsConnected(false);
          
        });
      }
    };
  }, [isConnected]);

  // Inscrever-se no tópico de notificações do WebSocket
  const subscribeToNotifications = () => {
    if (!socketClient.current || !isConnected) return;

    socketClient.current.subscribe("/topic/notificacoes", (message: Message) => {
      const notification: Notificacao = JSON.parse(message.body); // Parse da mensagem recebida
      toast(notification.mensagem);  // Exibe a mensagem de notificação
    });
  };

  // Desconectar do WebSocket
  const disconnect = () => {
    if (socketClient.current && isConnected) {
      socketClient.current.disconnect(() => {
        setIsConnected(false);
      });
    }
  };

  return (
    <WebSocketContext.Provider value={{ stompClient: socketClient.current, isConnected, subscribeToNotifications, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket deve ser usado dentro de um WebSocketProvider");
  }
  return context;
};
