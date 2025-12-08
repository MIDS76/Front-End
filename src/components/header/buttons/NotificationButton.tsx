"use client";

import ButtonTT from "@/components/button/ButtonTT";
import ActionModal from "@/components/modal/actionModal";
import SmallModal from "@/components/modal/smallModal";
import api from "@/utils/axios";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR, { SWRConfiguration } from "swr"; 

const fetchNotifications = async () => {
  const response = await api.get("/notificacoes/todas");
  return response.data;
};

export interface Notificacao {
  id: number;
  tipo: string;
  horario: string;
  mensagem: string;
}

export default function NotificationButton() {
  
  const swrConfig: SWRConfiguration = {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.response?.status === 403 || error.response?.status === 404) return;
      
      if (retryCount >= 3) return;
      
      setTimeout(() => revalidate({ retryCount }), 5000);
    }
  };

  const { data } = useSWR<Notificacao[]>("/notificacoes/todas", fetchNotifications, swrConfig);
  
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
      console.error(error);
      toast.error(error.response?.data?.mensagem || "Erro ao apagar notificações");
    }
  };

  return (
    <DropdownMenu.Root>
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
          className="p-2 flex flex-col bg-popover rounded-md shadow-md border border-border mt-2 z-50" 
        >
          <div className="flex flex-row justify-between px-4 pt-2 pb-0">
            <DropdownMenu.Label className="text-xl select-none font-bold">
              Notificações
            </DropdownMenu.Label>

            <ActionModal
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
            <ScrollArea.Viewport className="w-full h-full">
              {notificacoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full pt-10">
                  <p className="text-muted-foreground text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                    {notificacoes.map((notificacao) => (
                    <SmallModal
                        key={notificacao.id}
                        title={tiposNotificacoes.includes(notificacao.tipo) ? "Sistema" : "Alerta"}
                        description={notificacao.horario}
                        content={notificacao.mensagem}
                        id={notificacao.id}
                        notif={() => console.log("Notificação")}
                        onClick={() => console.log("Outro")}
                        setNotificacoes={setNotificacoes}
                    />
                    ))}
                </div>
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
}