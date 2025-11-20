"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import MedModal from "@/components/modal/medModal";
import Lista from "@/components/lista/lista";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProtectedRoute from "@/components/ProtectedRoute";
import SearchBar from "@/components/input/searchBar";
import { useRouter } from "next/navigation";
import { buscarTurmas } from "@/api/turmas";
import { Turma, Usuario } from "@/utils/types";
import { buscarUsuarios } from "@/api/usuarios";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "../access-denied";


export default function GerenciamentoUsersTurmas() {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const turmasArray = await buscarTurmas();
      setTurmas(turmasArray || []);

      const usuariosArray = await buscarUsuarios();
      setUsuarios(usuariosArray || []);
    }

    fetchData();
  }, []);

  console.log(usuarios);

  useEffect(() => {
    return () => {
      document.title = "Gerenciamento - Portal do Conselho";
    };
  }, []);

  const router = useRouter();

  const handleTurmaClick = (id: number) => {
    router.push(`/gerenciamento/turma/${id}`);
  };

  const { user } = useAuth();
  
  if (user?.role !== "pedagogico" && user?.role !== "admin") {
    return AccessDeniedPage();
  }

  return (
    <>
      <ProtectedRoute>
        <div className="flex flex-col lg:flex-row gap-6">
          <section className="flex flex-col h-full gap-4 w-full py-8 lg:px-0 px-4 lg:w-1/2 ">
            <div className="flex flex-col gap-6 md:mt-8 md:w-[450px] md:m-auto">
              <h2 className="px-4 text-3xl font-title font-bold text-accent-foreground">
                Gerenciar uma turma
              </h2>

              <SearchBar
                className="px-4"
                placeholder="Buscar uma turma"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filter
                filtrosMostrar={{ aluno: false, turma: true, conselho: false }}
              />
            </div>

            <ScrollArea className="w-full h-[600px] mt-5 md:w-[450px] md:m-auto">
              <div className="grid grid-cols-1 gap-6 px-4">
                {turmas?.map((classItem, index) => (
                  <MedModal
                    key={index}
                    courseCode={classItem.nome}
                    courseName={classItem.curso}
                    onClick={() => handleTurmaClick(classItem.id)}
                    simple
                  />
                ))}
              </div>
            </ScrollArea>
          </section>

          <section className="flex flex-col justify-between gap-4 w-full py-8 lg:py-8 md:px-14 
            lg:px-0 px-4 lg:w-1/2 h-full md:mb-8">
            <div className="flex flex-col gap-6 md:mt-8 lg:pr-28">
              <h2 className="px-4 text-3xl font-title font-bold text-accent-foreground">
                Gerenciar Usuários
              </h2>
              <SearchBar
                className="px-4"
                placeholder="Buscar um usuário"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filter
                filtrosMostrar={{ aluno: true, turma: false, conselho: false }}
              />
            </div>
            <div className="lg:pr-28">
              <Lista
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                tipo="edit"
                usuarios={usuarios}
                className="px-4"
              />
            </div>
          </section>
        </div>
      </ProtectedRoute>
    </>
  );
}
