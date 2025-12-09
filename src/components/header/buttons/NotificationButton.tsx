"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";  // Para exibir mensagens de toast
import ButtonTT from "@/components/button/ButtonTT";  // Componente de botão customizado
import ActionModal from "@/components/modal/actionModal";  // Modal de ação
import SmallModal from "@/components/modal/smallModal";  // Modal para exibir as notificações
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";  // Menu suspenso para exibir as notificações
import * as ScrollArea from "@radix-ui/react-scroll-area";  // Scroll para as notificações
import { marcarComoLida, listarNotificacao } from "@/api/notificacao";

export enum TipoNotificacao {
  PRE_CONSELHO_LIBERADO = "PRE_CONSELHO_LIBERADO",
  PRE_CONSELHO_PREENCHIDO = "PRE_CONSELHO_PREENCHIDO",
  RESULTADO_LIBERADO = "RESULTADO_LIBERADO",
}

export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  lido: boolean;
  horario: string;
  idReferencia: number
  tipo: TipoNotificacao
}

const formatarDataHora = (data: string) => {
  const date = new Date(data);
  return date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const NotificationButton = () => {
  const [mounted, setMounted] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [open, setOpen] = useState(false);
  const [routerReady, setRouterReady] = useState(false);
  const usuarioId = 3;
  const router = useRouter();

  // para carregar as notificações quando clilcar no botao
  useEffect(() => {
    if (open) {
      const carregar = async () => {
        try {
          const data = await listarNotificacao(usuarioId);
          setNotificacoes(data);
        } catch (error) {
          toast.error("Erro ao carregar notificações")
        }
      };

      carregar();
    }
  }, [open, usuarioId]);

  // Função para marcar a notificação como lida
  const handleMarkAsRead = async (notificacaoId: number, idReferencia: number, tipo: TipoNotificacao) => {
    try {
      await marcarComoLida(notificacaoId);

      setNotificacoes((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificacaoId ? { ...notif, lido: true } : notif
        )
      );

      toast.success("Notificação marcada como lida!");

      switch (tipo) {
        case TipoNotificacao.PRE_CONSELHO_LIBERADO:
          router.push(`/preConselhoForm?preConselhoId=${idReferencia}`);
          break;
        case TipoNotificacao.PRE_CONSELHO_PREENCHIDO:
          router.push(`/`);
          break;
        case TipoNotificacao.RESULTADO_LIBERADO:
          router.push(`/`);
          break;
        default:
          router.push(`/=${idReferencia}`);
          break;
      }
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
            <DropdownMenu.Label className="text-xl select-none font-bold">
              Notificações
            </DropdownMenu.Label>

            {/* Modal de limpar todas as notificações */}
            <ActionModal
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
            <ScrollArea.Viewport className="w-full h-full">
              {notificacoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full pt-10">
                  <p className="text-muted-foreground text-sm">Nenhuma notificação</p>
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
                    onClick={() => handleMarkAsRead(notificacao.id, notificacao.idReferencia, notificacao.tipo)}
                    onDelete={() => handleDelete(notificacao.id)}
                    setNotificacoes={setNotificacoes}
                    lido={notificacao.lido}
                  />
                ))
              )}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NotificationButton;
