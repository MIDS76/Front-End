"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";  // Para exibir mensagens de toast
import ButtonTT from "@/components/button/ButtonTT";  // Componente de botão customizado
import ActionModal from "@/components/modal/actionModal";  // Modal de ação
import SmallModal from "@/components/modal/smallModal";  // Modal para exibir as notificações
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";  // Menu suspenso para exibir as notificações
import * as ScrollArea from "@radix-ui/react-scroll-area";  // Scroll para as notificações
import { marcarComoLida, listarNotificacao, listarNotificacaoNaoLidas } from "@/api/notificacao";
import { useAuth } from "@/context/AuthContext";

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
  criadoEm: string;
  idReferencia: number | null;
  tipo: TipoNotificacao;
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
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [open, setOpen] = useState(false);

  const { user } = useAuth();
  const usuarioId = user?.id;

  const router = useRouter();

  // Carregar quando abrir o dropdown
  useEffect(() => {
    if (open && usuarioId) {
      const carregar = async () => {
        try {
          const data = await listarNotificacaoNaoLidas(usuarioId);
          setNotificacoes(Array.isArray(data) ? data : []);
        } catch (error) {
          toast.error("Erro ao carregar notificações");
        }
      };

      carregar();
    }
  }, [open, usuarioId]);

  const handleMarkAsRead = async (
    notificacaoId: number,
    idReferencia: number | null,
    tipo: TipoNotificacao
  ) => {
    try {
      await marcarComoLida(notificacaoId);

      setNotificacoes((prev) => prev.filter((n) => n.id !== notificacaoId));

      toast.success("Notificação marcada como lida!");

      switch (tipo) {
        case TipoNotificacao.PRE_CONSELHO_LIBERADO:
          router.push(`/preConselhoForm?preConselhoId=${idReferencia}`);
          break;
        default:
          router.push(`/preConselhoForm?preConselhoId=${idReferencia}`);
          break;
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao marcar notificação como lida");
    }
  };

  const handleDelete = (id: number) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notificação apagada!");
  };

  const handleDeleteAll = () => {
    setNotificacoes([]);
    toast.success("Todas as notificações apagadas!");
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
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

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="bottom"
          sideOffset={20}
          className="p-2 flex flex-col bg-popover rounded-md shadow-md border border-border mt-2"
        >
          <div className="flex flex-row justify-between px-4 pt-2 pb-0">
            <DropdownMenu.Label className="text-xl select-none font-bold">
              Notificações
            </DropdownMenu.Label>

            <ActionModal
              title="Limpar todas notificações"
              onConfirm={handleDeleteAll}
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

          <ScrollArea.Root className="h-96 w-96 flex flex-col items-center">
            <ScrollArea.Viewport className="w-full h-full">
              {notificacoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full pt-10">
                  <p className="text-muted-foreground text-sm">
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                notificacoes.map((n) => (
                  <SmallModal
                    key={n.id}
                    title={n.titulo}
                    description={formatarDataHora(n.criadoEm)}
                    content={n.mensagem}
                    id={n.id}
                    notif={() => { }}
                    onClick={() =>
                      handleMarkAsRead(n.id, n.idReferencia, n.tipo)
                    }
                    onDelete={() => handleDelete(n.id)}
                    setNotificacoes={setNotificacoes}
                    lido={n.lido}
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
