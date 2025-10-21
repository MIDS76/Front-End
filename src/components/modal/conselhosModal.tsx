import ButtonTT from "@/components/button/ButtonTT";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SmallModal from "./smallModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Icon } from "@/components/button/smallButton";
import { Conselho } from "@/app/conselho/pagina";
import Link from "next/link";
import { Usuario } from "../lista";
import { etapas } from "@/utils/types";

export interface Turma {
  id: number;
  codigoTurma: string;
  nomeCurso: string;
  conselhos?: Conselho[];
  usuarios?: Usuario[];
}

interface ConselhosModalProps {
  isOpen: boolean;
  onClose: () => void;
  turma: Turma;
}

export const convertDate = (data: Date): string => {
  return ("0" + (data.getMonth() + 1)).slice(-2) + "/" + data.getFullYear();
};

export default function ConselhosModal({
  isOpen = false,
  onClose,
  turma,
}: ConselhosModalProps) {
  // const [selectedConselho, setSelectedConselho] = useState({} as Conselho);

  // useEffect(() => {
  //   if (selectedConselho.etapa) {
  //   }
  // }, [selectedConselho]);

  const handleClick = (conselho: Conselho) => {
    const semConselho = turma;
    semConselho.conselhos = [];
    conselho.turma = semConselho;
    localStorage.setItem("conselho", JSON.stringify(conselho));
    setTimeout(() => {
      open("/conselho/", "_self");
    }, 0);
  };

  return (
    <aside
      className={cn(
        "full-screen-dialog inset-auto right-0 z-10 flex flex-col bg-card w-full",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
        "h-[calc(100vh-5rem)]"
      )}
    >
      <Card className="flex flex-col h-full border-t-0">
        <CardHeader className="flex flex-row items-start gap-2 space-y-0">
          <ButtonTT
            className="flex-shrink-0"
            mode="small"
            icon="IoClose"
            variant="ghost"
            onClick={() => onClose()}
            tooltip="Fechar"
          />
          <div className="flex flex-row w-full justify-between">
            <div>
              <CardTitle className="pb-1 mt-2 font-title text-accent-foreground font-bold">
                Turma {turma.codigoTurma}
              </CardTitle>
              <CardDescription className="text-foreground">
                {turma.nomeCurso}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ButtonTT
                    tooltip="Mais"
                    mode="small"
                    variant="ghost"
                    icon="MoreVertical"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 flex flex-col" align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => open("/gerenciamento/turma", "_self")}
                >
                  <Icon icon="FaGear" />
                  Gerenciar turma
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Icon className="scale-125" icon="Plus" />
                  <Link href={`/criar/conselho?turma=true`}>
                    Criar conselho
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="flex flex-row items-center gap-4">
            <h3 className="pl-3 font-title font-bold text-xl text-accent-foreground select-none">
              Conselhos
            </h3>
          </div>
          {turma.conselhos?.length !== 0 ? (
            <ScrollArea className="h-full">
              {turma.conselhos?.map((conselho, index) => (
                <SmallModal
                  setNotificacoes={() => {}}
                  key={index}
                  title={
                    convertDate(new Date(conselho.dataInicio)) +
                    " até " +
                    convertDate(new Date(conselho.dataFim))
                  }
                  description=""
                  content={etapas[index]}
                  onClick={() => handleClick(conselho)}
                />
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-muted-foreground">
                Nenhum conselho cadastrado
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
