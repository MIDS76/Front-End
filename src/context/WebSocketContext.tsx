// "use client";

// import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
// import SockJs from "sockjs-client";
// import Stomp, { Client, Message } from "stompjs";

// // Tipo de Notificação esperado
// interface Notificacao {
//   id: number;
//   titulo: string;
//   mensagem: string;
//   lido: boolean;
//   horario: string;
// }

// interface WebSocketContextType {
//   stompClient: Client | null;
//   isConnected: boolean;
//   subscribeToNotifications: (
//     callback: (Notification: Notificacao) => void
//   ) => void;
//   disconnect: () => void;
// }

// const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
//   const stompClientRef = useRef<Client | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   // conectar ao WebSocket quando o componente for iniciado
//   useEffect(() => {
//     const ws = new SockJs("http://localhost:3000/ws");  // URL do WebSocket
//     const client = Stomp.over(ws);

//     stompClientRef.current = client;

//     client.connect({}, () => {
//       setIsConnected(true);
//     }, () => {
//       setIsConnected(false);  // Se falhar a conexão
//     });

//     return () => {
//       if (stompClientRef.current) {
//         stompClientRef.current.disconnect(() => {
//           setIsConnected(false);

//         });
//       }
//     };
//   }, []);

//   // Inscrever-se no tópico de notificações do WebSocket
//   const subscribeToNotifications = (
//     callback: (notification: Notificacao) => void
//   ) => {
//     if (!stompClientRef.current || !isConnected) return;

//     if (!isConnected) {
//       setTimeout(() => subscribeToNotifications(callback), 200);
//       return;
//     }

//     stompClientRef.current.subscribe("/topic/notificacoes", (message: Message) => {
//       const notification: Notificacao = JSON.parse(message.body);
//       callback(notification);
//     });
//   };

//   // Desconectar do WebSocket
//   const disconnect = () => {
//     if (stompClientRef.current && isConnected) {
//       stompClientRef.current.disconnect(() => {
//         setIsConnected(false);
//       });
//     }
//   };

//   return (
//     <WebSocketContext.Provider 
//     value={{
//       stompClient: stompClientRef.current,
//       isConnected,
//       subscribeToNotifications, 
//       disconnect
//     }}
//     >
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocket = () => {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error("useWebSocket deve ser usado dentro de um WebSocketProvider");
//   }
//   return context;
// };