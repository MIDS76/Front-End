"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import Logo from "../../../public/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import CreateButton from "./createButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SmallModal from "../modal/smallModal";
import { ConfigDialog } from "@/components/configDialog";
import ButtonTT from "../button/ButtonTT";
import useSwR from "swr";
import api from "@/utils/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import ActionModal from "../modal/actionModal";

interface HeaderProps {
  login?: boolean;
  className?: string;
}

export default function Header({ login, className }: HeaderProps) {
  const header = !login ? " border-b bg-card " : " ";
  return (
    <header
      className={cn(
        "flex h-20 py-4 w-full shrink-0 items-center px-4 md:px-8 justify-between",
        header,
        className
      )}
    >
      <Link
        href="/"
        className="mr-6 flex items-center gap-2 sm:gap-4"
        prefetch={true}
      >
        <Logo size={48} fill="fill-accent-foreground" />
        <span className="sr-only">ConselhEXPERT</span>
        <h1 className="hidden sm:block sm:text-3xl text-accent-foreground font-title font-bold">
          ConselhEXPERT
        </h1>
      </Link>
      {!login && (
        <Sheet>
          <SheetTrigger asChild>
            <div className="md:hidden">
              <ButtonTT
                mode="small"
                tooltip="Menu"
                icon="Menu"
                variant={"ghost"}
              />
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-fit px-8 pt-12">
            <SheetTitle className="sr-only">Sidebar</SheetTitle>
            <HeaderButtons sideBar />
          </SheetContent>
        </Sheet>
      )}
      {!login && <HeaderButtons />}
    </header>
  );
}

function DashboardButton() {
  return (
    <ButtonTT
      tooltip="Abrir gráficos"
      mode="small"
      variant="ghost"
      icon={"IoBarChart"}
      onClick={() => {
        open("/dashboard", "_self");
      }}
    />
  );
}

function ChatButton() {
  return (
    <ButtonTT
      tooltip="Abrir chat"
      mode="small"
      variant="ghost"
      icon={"IoIosChatboxes"}
      onClick={() => open("/chat", "_self")}
    />
  );
}

const fetchNotifications = async () => {
  const response = await api.get(`/notificacoes/todas`);
  if (!response.status) {
    throw new Error("Falha ao carregar notificações");
  }
  return response.data;
};

export interface Notificacao {
  id: number;
  tipo: string;
  horario: string;
  mensagem: string;
}

function NotificationButton() {
  const { data } = useSwR<Notificacao[]>(
    "/api/notificacoes",
    fetchNotifications
  );

  const tiposNotificacoes = [
    "CRIADO",
    "ATUALIZADO",
    "REMOVIDO",
    "PARTE_ATUALIZADA",
  ];

  const [notificacoes, setNotificacoes] = useState([] as Notificacao[]);

  useEffect(() => {
    if (data) {
      setNotificacoes(data);
    }
  }, [data]);

  const handleDelete = () => {
    api.get(`/usuarios/buscar-por-email?email=${"admin"}`).then((response) => {
      api
        .delete(`notificacoes/deletar-todas/${response.data.id}`)
        .then(() => {
          setNotificacoes([]);
        })
        .catch((error) => {
          toast.error(error.response.data.mensagem);
        });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <ButtonTT
            mode="small"
            icon={"BiSolidBell"}
            tooltip="Abrir notificações"
            variant={"ghost"}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 flex flex-col" align="end">
        <div className="flex flex-row justify-between px-4 pt-2 pb-0">
          <DropdownMenuLabel className=" text-xl select-none">
            Notificações
          </DropdownMenuLabel>

          <ActionModal
            description="Excluir todas as suas notificações"
            title="Limpar todas notificações"
            onConfirm={handleDelete}
            destructive
          >
            <ButtonTT
              mode="small"
              variant="ghost"
              tooltip="Limpar notificações"
              icon={"BiSolidTrashAlt"}
              className="dark:text-destructive/70 text-destructive hover:text-destructive hover:bg-muted/50"
            />
          </ActionModal>
        </div>
        <ScrollArea
          key={notificacoes?.length}
          className="h-96 w-96 flex flex-col items-center"
        >
          {notificacoes?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <p className="text-muted-foreground">Nenhuma notificação</p>
            </div>
          ) : (
            notificacoes?.map((notificacao, index) => (
              <SmallModal
                key={index}
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
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ConfigurationButton() {
  return <ConfigDialog />;
}

function HeaderButtons({ sideBar }: { sideBar?: boolean }) {
  return (
    <nav
      className={
        sideBar
          ? "flex flex-col gap-6 items-center justify-center"
          : "ml-auto hidden md:flex gap-6 items-center"
      }
    >
      <CreateButton />
      <DashboardButton />
      <ChatButton />
      <NotificationButton />
      <ConfigurationButton />
    </nav>
  );
}
