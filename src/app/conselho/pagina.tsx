"use client";

import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters as Loading } from "react-icons/ai";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import dynamic from "next/dynamic";

import { Turma, convertDate } from "@/components/modal/conselhosModal";
import { Page, etapas } from "@/utils/types";
import api from "@/utils/axios";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import ButtonTT from "@/components/button/ButtonTT";
import Timeline from "@/components/timeline";
import { Usuario } from "@/components/lista";

const Lista = dynamic(() => import("@/components/lista"), { ssr: false });
const PreConselhoFormulario = dynamic(
  () => import("@/components/preConselhoForm"),
  { ssr: false }
);
const OpinioesProfessoresModal = dynamic(
  () => import("@/components/modal/opinioesProfessoresModal"),
  { ssr: false }
);
const Devolutiva = dynamic(() => import("@/components/devolutiva"), {
  ssr: false,
});

export interface Conselho {
  id: number;
  dataInicio: Date;
  dataFim: Date;
  etapa: number;
  turma: Turma;
}

export default function ConselhoContent() {
  const [etapa, setEtapa] = useState(1);
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const aluno = searchParams.get("aluno");

  const [conselho, setConselho] = useLocalStorage<Conselho | null>(
    "conselho",
    null
  );

  const [isHydrated, setIsHydrated] = useState(false);
  const [formattedDateRange, setFormattedDateRange] = useState("");
  const [selectedUsuarios, setSelectedUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    document.title = "Conselho - ConselhEXPERT";
  }, []);

  useEffect(() => {
    if (conselho) {
      api
        .get(`/conselhos/buscar/${conselho.id}`)
        .then((res) => setConselho(res.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (conselho?.dataInicio && conselho?.dataFim) {
      setFormattedDateRange(
        `${convertDate(new Date(conselho.dataInicio))} até ${convertDate(
          new Date(conselho.dataFim)
        )}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conselho]);

  if (!isHydrated) return null;

  return (
    <main className="h-[calc(100vh-5rem)] overflow-hidden w-full flex flex-col">
      <div className="flex flex-row w-full h-full items-center justify-center">
        {conselho ? (
          <>
            <section
              className={cn(
                etapa > 1 || etapa === etapas.length ? "md:w-3/5 xl:w-3/4" : "",
                "w-full h-full flex flex-col items-start pt-8 gap-y-4 transition-all",
                etapa <= 2 &&
                  sideModalOpen &&
                  "brightness-[0.25] bg-black/75 select-none"
              )}
            >
              <Timeline etapa={etapa == 0 ? 1 : etapa} />
              <div
                className={cn(
                  "flex flex-col xl:flex-row items-center xl:items-start w-full h-full gap-4 lg:px-16 px-4",
                  etapa !== etapas.length && "justify-between"
                )}
              >
                <section className="flex flex-col w-full xl:w-1/2 items-start justify-center py-2 xl:py-8 p-8">
                  <div className="w-full flex-row xl:flex-col xl:items-start items-center xl:gap-8 justify-between flex">
                    <div className="flex flex-col items-start gap-2">
                      <h1 className="font-title text-2xl xl:text-4xl font-bold">
                        {aluno && "Pré-"}Conselho da turma{" "}
                        <span className="text-nowrap">
                          {conselho.turma.codigoTurma}
                        </span>
                      </h1>
                      {formattedDateRange && (
                        <span
                          className="px-2 py-1 rounded-sm bg-accent text-accent-foreground font-bold text-sm"
                          onClick={() =>
                            setEtapa(etapa >= 1 ? etapa - 1 : etapa)
                          }
                        >
                          {formattedDateRange}
                        </span>
                      )}
                      {!aluno && (
                        <ButtonTT
                          onClick={
                            selectedUsuarios.length > 0
                              ? () => {
                                  toast.warning(
                                    "Nem todos alunos foram chamados para as conversas! Não é possível prosseguir."
                                  );
                                }
                              : etapa === etapas.length
                              ? () => {
                                  toast.loading("Voltando para o menu...");
                                  setTimeout(() => {
                                    open("/", "_self");
                                  }, 2000);
                                }
                              : () => {
                                  if (etapa === etapas.length - 1) {
                                    toast.success(
                                      "Pronto! O resultado do conselho foi liberado!"
                                    );
                                  }
                                  setEtapa(
                                    etapa < etapas.length ? etapa + 1 : etapa
                                  );
                                }
                          }
                          tooltip="none"
                          mode="text-icon"
                          icon="ChevronRight"
                          variant={etapa === 0 ? "default" : "link"}
                          className={`text-lg transition-all ${
                            etapa !== 0 ? "text-primary pl-0" : "mt-4"
                          }`}
                        >
                          {etapa === 0
                            ? "Comece o conselho"
                            : etapa === etapas.length - 1
                            ? "Liberar para visualização"
                            : etapa === etapas.length
                            ? "Finalizar"
                            : "Próxima etapa"}
                        </ButtonTT>
                      )}
                    </div>
                  </div>
                </section>

                {aluno ? (
                  <PreConselhoFormulario />
                ) : (
                  <section className="flex flex-col w-full xl:w-1/2 items-start justify-center pt-0 xl:pt-8 p-4">
                    <ConteudoEtapa
                      etapa={etapa}
                      conselho={conselho}
                      isDialogOpen={sideModalOpen}
                      setDialogOpen={setSideModalOpen}
                      selectedUsuarios={selectedUsuarios}
                      setSelectedUsuarios={setSelectedUsuarios}
                    />
                  </section>
                )}
              </div>
            </section>

            {etapa > 1 && (
              <section className="h-[calc(100vh-5rem)] pointer-events-none md:pointer-events-auto bottom-0 right-0 absolute md:static w-3/4 md:w-2/5 xl:w-1/4 md:flex flex-col items-center justify-center md:bg-accent bg-none">
                <p className="hidden md:block md:absolute bottom-1/2 text-muted-foreground">
                  Selecione um aluno
                </p>
                <OpinioesProfessoresModal
                  isOpen={sideModalOpen}
                  onClose={() => setSideModalOpen(false)}
                />
              </section>
            )}
          </>
        ) : (
          <Loading size={64} className="animate-spin" />
        )}
      </div>
    </main>
  );
}

interface ConteudoEtapaProps {
  etapa: number;
  conselho: Conselho;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogOpen: boolean;
  selectedUsuarios: Usuario[];
  setSelectedUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
}

function ConteudoEtapa({
  etapa,
  conselho,
  selectedUsuarios,
  setSelectedUsuarios,
  ...props
}: ConteudoEtapaProps) {
  const { data } = useSWR<Page<Usuario>>(
    etapa !== 1 ? null : `/usuarios/listar?role=PROFESSOR`,
    (url: string) => api.get(url).then((res) => res.data)
  );
  if (etapa === 0) return <></>;
  if (etapa === etapas.length) return <Devolutiva />;

  return (
    <Lista
      isDialogOpen={props.isDialogOpen}
      setIsDialogOpen={props.setDialogOpen}
      tipo={etapa !== 3 ? "conselho" : "checkbox"}
      conselho={conselho}
      usuarios={conselho.turma.usuarios!}
      professor={data?.content[0]}
      selectedUsers={selectedUsuarios}
      setSelectedContact={(u: Usuario) => {
        setSelectedUsuarios(
          selectedUsuarios.includes(u)
            ? selectedUsuarios.filter((user) => user.id !== u.id)
            : [...selectedUsuarios, u]
        );
      }}
      className="w-full h-[580px]"
    />
  );
}
