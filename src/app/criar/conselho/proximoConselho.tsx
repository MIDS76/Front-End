"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Lista, { Usuario } from "@/components/lista/lista";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";

interface ProximoConselhoProps {
  setProximo: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProximoConselho({ setProximo }: ProximoConselhoProps) {
  const teachers: Usuario[] = [
    {
      id: 1,
      nome: "Kevin de Souza",
      email: "kevin@senai.com",
      role: "PROFESSOR",
    },
    {
      id: 2,
      nome: "Matheus Quost",
      email: "matheus@senai.com",
      role: "PROFESSOR",
    },
    {
      id: 3,
      nome: "Kristian Pereira",
      email: "kriar_tecnologia@senai.com",
      role: "PROFESSOR",
    },
    {
      id: 4,
      nome: "Roberto Baumgardt",
      email: "bob@senai.com",
      role: "PROFESSOR",
    },
    {
      id: 5,
      nome: "Rômulo Remo",
      email: "roma@senai.com",
      role: "PROFESSOR",
    },
    {
      id: 6,
      nome: "Bruno Android",
      email: "bruno@senai.com",
      role: "PROFESSOR",
    },
    {
      id: 7,
      nome: "Bruno Kotlin",
      email: "kotlin@senai.com",
      role: "PROFESSOR",
    },
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(2024, 8, 9)
  );

  return (
    <div className="p-4 lg:p-8 xl:p-12 pt-12">
      <h2 className="text-2xl font-bold mb-6 ml-4">
        Novo Conselho - Turma MI 74
      </h2>

      <div className="min-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h3
            onClick={() => {
              setProximo(false);
            }}
            className="text-lg font-bold mb-4 ml-4"
          >
            Professores da turma
          </h3>

          <Lista
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            usuarios={teachers}
            tipo="checkbox"
            selectedUsers={[]}
            setSelectedContact={() => {}}
          />
        </div>

        <div className="flex flex-col h-full px-4">
          <h3 className="text-lg font-bold mb-4">
            Período relativo ao Conselho
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Período que deverá ser considerado por turma, professores e equipe
            pedagógica para avaliações que serão realizadas no conselho.
          </p>

          <div className="flex w-full justify-start items-center gap-2 ">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "px-0",
                    "justify-start text-left font-normal hover:bg-transparent",
                    !startDate && ""
                  )}
                >
                  {startDate ? (
                    <div className="flex gap-1">
                      <div className="hover:bg-primary hover:text-card bg-muted px-3 py-1 rounded-md">
                        <span className="text-sm">
                          {startDate.getMonth() + 1}
                        </span>
                      </div>
                      <div className="hover:bg-primary hover:text-card bg-muted px-3 py-1 rounded-md">
                        <span className="text-sm">
                          {startDate.getFullYear()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-sm mx-2">até</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "px-0",
                    "hover:bg-transparent justify-start text-left font-normal",
                    !endDate && ""
                  )}
                >
                  {endDate ? (
                    <div className="flex gap-1">
                      <div className="hover:bg-primary hover:text-card bg-muted px-3 py-1 rounded-md">
                        <span className="text-sm">
                          {endDate.getMonth() + 1}
                        </span>
                      </div>
                      <div className="hover:bg-primary hover:text-card bg-muted px-3 py-1 rounded-md">
                        <span className="text-sm">{endDate.getFullYear()}</span>
                      </div>
                    </div>
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full flex justify-end gap-4 self-end mt-auto">
            <ButtonTT
              onClick={() => {
                setProximo(false);
                open("/", "_self");
              }}
              mode="default"
              tooltip="none"
              variant="outline"
              className="px-7"
            >
              Voltar
            </ButtonTT>

            <ButtonTT
              onClick={() => {
                toast.success("Conselho criado com sucesso!");
                setTimeout(() => {
                  open("/conselho", "_self");
                }, 1500);
              }}
              mode="default"
              tooltip="none"
              variant="default"
              className="px-7"
            >
              Criar
            </ButtonTT>
          </div>
        </div>
      </div>
    </div>
  );
}
