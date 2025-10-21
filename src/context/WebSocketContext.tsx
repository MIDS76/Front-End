"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import SockJs from "sockjs-client";
import Stomp, { Client, Message } from "stompjs";
import { toast } from "sonner";

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
  // exemplo de campos extras se houver
  messageId?: string;
  roomId?: string;
}

interface WebSocketContextType {
  stompClient: Client | null;
  isConnected: boolean;
  subscribeToMessages: (
    chatRoomId: string,
    callback: (message: ChatMessage) => void
  ) => void;
  unsubscribeFromMessages: (chatRoomId: string) => void;
  messages: Record<string, ChatMessage[]>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const socketClient = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribedChats = useRef<Set<string>>(new Set());
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  useEffect(() => {
    const ws = new SockJs("http://localhost:8099/ws");
    const stompClient = Stomp.over(ws);
    socketClient.current = stompClient;

    stompClient.connect(
      {},
      () => {
        setIsConnected(true);

        stompClient.subscribe("/topic/notifications", (message: Message) => {
          const notification = JSON.parse(message.body);
          toast(notification.mensagem);
        });
      },
      () => {
        setIsConnected(false);
      }
    );

    const currentSubscribedChats = subscribedChats.current;

    return () => {
      if (socketClient.current && isConnected) {
        socketClient.current.disconnect(() => {
          setIsConnected(false);
          currentSubscribedChats.clear();
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscribeToMessages = (
    chatRoomId: string,
    callback: (message: ChatMessage) => void
  ) => {
    if (!socketClient.current || !isConnected) return;

    if (subscribedChats.current.has(chatRoomId)) return;

    socketClient.current.subscribe(
      `/topic/chat-room/${chatRoomId}`,
      (message: Message) => {
        const msg: ChatMessage = JSON.parse(message.body);

        setMessages((prevMessages) => ({
          ...prevMessages,
          [chatRoomId]: [...(prevMessages[chatRoomId] || []), msg],
        }));

        callback(msg);
      }
    );

    subscribedChats.current.add(chatRoomId);
  };

  const unsubscribeFromMessages = (chatRoomId: string) => {
    if (
      socketClient.current &&
      isConnected &&
      subscribedChats.current.has(chatRoomId)
    ) {
      socketClient.current.unsubscribe(`/topic/chat-room/${chatRoomId}`);
      subscribedChats.current.delete(chatRoomId);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        stompClient: socketClient.current,
        isConnected,
        subscribeToMessages,
        unsubscribeFromMessages,
        messages,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocket deve ser usado dentro de um WebSocketProvider"
    );
  }
  return context;
};
