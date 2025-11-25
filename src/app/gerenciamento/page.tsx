"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import BlocoTurmas from "@/components/modal/BlocoTurmas";
import BlocoUsuarios from "@/components/modal/BlocoUsuarios";
import { buscarTurmas } from "@/api/turmas";
import { Turma, Usuario } from "@/utils/types";
import { buscarUsuarios } from "@/api/usuarios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GerenciamentoUsersTurmas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQueryTurmas, setSearchQueryTurmas] = useState("");
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const turmasArray = await buscarTurmas();
      setTurmas(turmasArray || []);

      const usuariosArray = await buscarUsuarios();
      setUsuarios(usuariosArray || []);
    };

    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      document.title = "Gerenciamento - Portal do Conselho";
    };
  }, []);

  const handleTurmaClick = (id: number) => {
    router.push(`/gerenciamento/turma/${id}`);
  };

  return (
    <ProtectedRoute>

      {/* CONTAINER GERAL */}
      <div 
        className="
          w-full 
          min-h-screen

          tablet:overflow-auto      /* Tablet → página com scroll */
          laptop:overflow-hidden    /* Laptop → sem scroll geral */
        "
      >

        {/* GRID DOS BLOCOS */}
        <div
          className="
            w-full 
            grid gap-10 grid-cols-1

            mt-24                    
            tablet:mt-[6rem]
            tablet:mb-[2rem]
            laptop:mt-[6rem]              
            desktop:mt-[10rem] 

            tablet:grid-cols-1 
            laptop:grid-cols-2 
            desktop:grid-cols-2 

            px-6 
            laptop:max-w-[1350px] 
            laptop:mx-auto
          "
        >
          <BlocoTurmas
            turmas={turmas}
            searchQuery={searchQueryTurmas}
            setSearchQuery={setSearchQueryTurmas}
            handleTurmaClick={handleTurmaClick}
            scrollHeight="28rem"  
          />

          <BlocoUsuarios
            usuarios={usuarios}
            searchQuery={searchQueryUsuarios}
            setSearchQuery={setSearchQueryUsuarios}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            scrollHeight="28rem"
          />
        </div>

      </div>
    </ProtectedRoute>
  );
}
