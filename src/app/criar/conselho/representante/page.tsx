"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import LogLateral from "@/components/sidebar/logLateral";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import Lista from "@/components/lista/lista";
import { Usuario } from "@/utils/types";
import usuariosData from "@/data/usuarios.json";
import InfoCard from "@/components/card/cardTituloTelas";

export default function RepresentantePage() {
  const router = useRouter();

  const [selecionados, setSelecionados] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const alunosAtivos: Usuario[] = usuariosData.filter(
    (u) => u.role === "Aluno" && u.isActive
  );

  const alunosFiltrados = alunosAtivos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // 🔹 Controle de seleção com limite de 2
  function toggleSelecionado(usuario: Usuario) {
    const jaSelecionado = selecionados.some((s) => s.id === usuario.id);

    if (jaSelecionado) {
      setSelecionados((prev) => prev.filter((s) => s.id !== usuario.id));
      return;
    }

    if (selecionados.length >= 2) {
      toast.error("Limite de dois representantes atingido.");
      return;
    }

    setSelecionados((prev) => [...prev, usuario]);
  }

  // 🔹 Remover pelo log lateral
  function handleRemover(idOuNome: string) {
    setSelecionados((prev) =>
      prev.filter(
        (s) =>
          s.id.toString() !== idOuNome &&
          s.nome !== idOuNome
      )
    );
  }

  // 🔹 Validar e avançar
  function handleProximo() {
    if (selecionados.length < 2) {
      toast.error("Selecione dois representantes antes de prosseguir.");
      return;
    }

    router.push("/criar/conselho/finalizar");
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 px-[3rem] pt-[2rem] pb-[3rem] mt-[5rem]">
        <div className="max-w-[80rem] mx-auto flex flex-col items-center">

          {/* CABEÇALHO */}
          <div className="flex justify-center mt-[1.5rem]">
            <InfoCard
              titulo="Conselho da Turma MI 76"
              descricao="Selecione os representantes da turma"
              className="w-[48.5rem] mb-6"
            />
          </div>

          {/* LISTA */}
          <div
            className="bg-[hsl(var(--background))] rounded-xl border-2 border-[hsl(var(--border))] shadow-sm 
  w-[48.4rem] p-[1.25rem] flex flex-col gap-3"
            style={{
              height: "30rem",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >

            {/* Campo de busca */}
            <div className="relative mb-[1rem]">
              <FiSearch className="absolute left-[0.75rem] top-[0.65rem] text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Buscar Representante"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-[2.25rem] pr-[0.75rem] py-[0.5rem] text-sm border rounded-md border-[hsl(var(--border))] 
      bg-white focus:outline-none focus:ring-1 
      focus:ring-[hsl(var(--primary))] placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>

            {/* LISTA FILTRADA */}
            <Lista
              usuarios={alunosFiltrados}
              tipo="checkbox"
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onSelect={(usuario: Usuario) => toggleSelecionado(usuario)}
              selecionados={selecionados}
              className="flex-1"
            />

          </div>


          {/* Área dos botões */}
          <div className="w-[48.4rem] flex justify-between mt-[1rem]">

            {/* Botão Anterior */}
            <ButtonTT
              mode="default"
              onClick={() => router.push("/criar/conselho")}
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] px-[1.25rem] py-[0.5rem] rounded-md text-sm font-medium shadow-md transition-all"
            >
              Anterior
            </ButtonTT>

          </div>


        </div>
      </main>

      {/* LOG LATERAL */}
      <LogLateral
        titulo="Representante"
        itens={selecionados.map((s) => ({
          id: s.id,
          unidade: s.nome,
          professor: s.email,
        }))}
        onRemover={handleRemover}
        vazioTexto="Nenhum representante selecionado"
        onProximo={handleProximo}
      />
    </div>
  );
}
