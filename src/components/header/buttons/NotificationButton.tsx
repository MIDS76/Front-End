"use client";

import ButtonTT from "@/components/button/ButtonTT";
import ActionModal from "@/components/modal/actionModal";
import SmallModal from "@/components/modal/smallModal";
import api from "@/utils/axios";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetchNotifications = async () => {
  const response = await api.get("/notificacoes/todas");
  if (!response.status) throw new Error("Erro ao buscar notificações");
  return response.data;
};

export interface Notificacao {
  id: number;
  tipo: string;
  horario: string;
  mensagem: string;
}

export default function NotificationButton() {
  const { data } = useSWR<Notificacao[]>("/api/notifications", fetchNotifications);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const tiposNotificacoes = ["CRIADO", "ATUALIZADO", "REMOVIDO", "PARTE_ATUALIZADA"];

  useEffect(() => {
    if (data) setNotificacoes(data);
  }, [data]);

  const handleDelete = async () => {
    try {
      const response = await api.get(`/usuarios/buscar-por-email?email=admin`);
      const user = response.data;
      await api.delete(`/notificacoes/deletar-todas/${user.id}`);
      setNotificacoes([]);
      toast.success("Notificações apagadas com sucesso!");
    } catch (error: any) {
      toast.error(error.response?.data?.mensagem || "Erro ao apagar notificações");
    }
  };

  return (
    <DropdownMenu.Root>
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

      {/* Conteúdo: dropdown abaixo do header */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="bottom"
          sideOffset={20} // controla a distância abaixo do header
          className="p-2 flex flex-col bg-popover rounded-md shadow-md border border-border mt-2"
        >
          <div className="flex flex-row justify-between px-4 pt-2 pb-0">
            <DropdownMenu.Label className="text-xl select-none">
              Notificações
            </DropdownMenu.Label>

            <ActionModal
              description="Excluir todas as suas notificações"
              title="Limpar todas notificações"
              onConfirm={handleDelete}
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
            <ScrollArea.Viewport>
              {notificacoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <p className="text-muted-foreground">Nenhuma notificação</p>
                </div>
              ) : (
                notificacoes.map((notificacao) => (
                  <SmallModal
                    key={notificacao.id}
                    title={
                      tiposNotificacoes.includes(notificacao.tipo)
                        ? "Sistema"
                        : "Alerta"
                    }
                    description={notificacao.horario}
                    content={notificacao.mensagem}
                    id={notificacao.id}
                    notif={() => console.log("Notificação")}
                    onClick={() => console.log("Outro")}
                    setNotificacoes={setNotificacoes}
                  />
                ))
              )}
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
