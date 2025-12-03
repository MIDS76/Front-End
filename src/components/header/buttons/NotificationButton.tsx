"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";  // Para exibir mensagens de toast
import ButtonTT from "@/components/button/ButtonTT";  // Componente de botão customizado
import ActionModal from "@/components/modal/actionModal";  // Modal de ação
import SmallModal from "@/components/modal/smallModal";  // Modal para exibir as notificações
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";  // Menu suspenso para exibir as notificações
import * as ScrollArea from "@radix-ui/react-scroll-area";  // Scroll para as notificações
import { useWebSocket } from "@/context/WebSocketContext";
import { marcarComoLida, listarNotificacao } from "@/api/notificacao";
import { id } from "date-fns/locale";

// Tipo de Notificação esperado
export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  lido: boolean;
  horario: string;
}

const formatarDataHora = (data: string) => {
  const date = new Date(data);
  return date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const NotificationButton = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const { subscribeToNotifications, isConnected } = useWebSocket();
  const [open, setOpen] = useState(false);
  const idUsuario = 1;

  // para carregar as notificações quando clilcar no botao
  useEffect(() => {
    if (open) {
      const carregar = async () => {
        try {
          const data = await listarNotificacao(idUsuario);
          setNotificacoes(data);
        } catch (error) {
          toast.error("Erro ao carregar notificações")
        }
      };

      carregar();
    }
  }, [open, idUsuario]);

  // Inscreve-se nas notificações ao conectar
  useEffect(() => {
    if (isConnected) {
      subscribeToNotifications((novaNotificacao: Notificacao) => {
        setNotificacoes((prev) => [novaNotificacao, ...prev]);
      });
    }
  }, [isConnected, subscribeToNotifications]);

  // Função para marcar a notificação como lida
  const handleMarkAsRead = async (id: number) => {
    try {      
      await marcarComoLida(id);

      setNotificacoes((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, lido: true } : notif
        )
      );

      toast.success("Notificação marcada como lida!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao marcar notificação como lida");
    }
  };

  // Função para apagar notificações individuais
  const handleDelete = (id: number) => {
    setNotificacoes((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== id)
    );
    toast.success("Notificação apagada da lista!");
  };

  // Função para apagar todas as notificações
  const handleDeleteAll = () => {
    setNotificacoes([]);
    toast.success("Todas as notificações apagadas!");
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      {/* Botão de abrir notificações */}
      <DropdownMenu.Trigger asChild>
        <div>
          <ButtonTT
            mode="small"
            tooltip="Abrir notificações"
            icon="BiSolidBell"
            variant="ghost"
          />
        </div>
      </DropdownMenu.Trigger>

      {/* Conteúdo do dropdown (lista de notificações) */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="bottom"
          sideOffset={20} // Distância abaixo do header
          className="p-2 flex flex-col bg-popover rounded-md shadow-md border border-border mt-2"
        >
          <div className="flex flex-row justify-between px-4 pt-2 pb-0">
            <DropdownMenu.Label className="text-xl select-none">
              Notificações
            </DropdownMenu.Label>

            {/* Modal de limpar todas as notificações */}
            <ActionModal
              description="Excluir todas as suas notificações"
              title="Limpar todas notificações"
              onConfirm={handleDeleteAll} // Chama a função de apagar todas
              destructive
            >
              <ButtonTT
                mode="small"
                tooltip="Limpar notificações"
                icon="BiSolidTrashAlt"
                variant="ghost"
                className="dark:text-destructive/70 text-destructive hover:text-destructive hover:bg-muted/50"
              />
            </ActionModal>
          </div>

          {/* Scroll para as notificações */}
          <ScrollArea.Root className="h-96 w-96 flex flex-col items-center">
            <ScrollArea.Viewport>
              {notificacoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <p className="text-muted-foreground">Nenhuma notificação</p>
                </div>
              ) : (
                notificacoes.map((notificacao) => (
                  <SmallModal
                    key={notificacao.id}
                    title={notificacao.titulo}
                    description={formatarDataHora(notificacao.horario)}
                    content={notificacao.mensagem}
                    id={notificacao.id}
                    notif={() => console.log("Notificação visualizada")}
                    onClick={() => handleMarkAsRead(notificacao.id)}
                    onDelete={() => handleDelete(notificacao.id)}
                    setNotificacoes={setNotificacoes}
                    lido={notificacao.lido}
                  />
                ))
              )}
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NotificationButton;
