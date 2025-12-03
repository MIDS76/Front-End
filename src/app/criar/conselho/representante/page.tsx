"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import LogLateral from "@/components/sidebar/logLateral";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "@/app/access-denied";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import Lista from "@/components/lista/lista";
import { Aluno, Usuario } from "@/utils/types";
import InfoCard from "@/components/card/cardTituloTelas";
import { buscarAlunosTurma } from "@/api/turmas";

export default function RepresentantePage() {
  const router = useRouter();
  const [selecionados, setSelecionados] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aluno, setAluno] = useState<Aluno[]>([]);

  useEffect(() => {
    const carregarAlunos = async () => {
      const turmaSelecionada = localStorage.getItem("turmaSelecionada");

      if (turmaSelecionada) {
        const { id } = JSON.parse(turmaSelecionada);
        const data = await buscarAlunosTurma(id);

        console.log("Dados recebidos:", JSON.stringify(data, null, 2));

        if (!data) {
          toast.error("Erro ao carregar alunos.");
          return;
        }

        setAluno(data.alunos); 
      } else {
        toast.error("Nenhuma turma selecionada.");
      }
    };
    carregarAlunos();
  }, []);


  const alunosAtivos: Usuario[] = aluno.filter((a) => {
    a.statusAtividadeAluno
  });

  console.log(alunosAtivos);

  const alunosFiltrados = alunosAtivos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // useEffect(() => {
  //   const dadosSalvos = localStorage.getItem("representantes-selecionados");

  //   if (dadosSalvos) {
  //     try {
  //       setSelecionados(JSON.parse(dadosSalvos));
  //     } catch {
  //       console.error("Erro ao carregar representantes salvos.");
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (selecionados.length > 0) {
      // localStorage.setItem("representantes-selecionados", JSON.stringify(selecionados));
    }
  }, [selecionados]);


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

  function handleRemover(idOuNome: string) {
    setSelecionados((prev) =>
      prev.filter(
        (s) => s.id?.toString() !== idOuNome && s.nome !== idOuNome
      )
    );
  }

  const { user } = useAuth();

  if (user?.role !== "pedagogico" && user?.role !== "admin") {
    return AccessDeniedPage();
  }

  function handleProximoPasso() {
    if (selecionados.length < 2) {
      toast.error("Selecione dois representantes antes de prosseguir.");
      return;
    }

    // localStorage.setItem("conselhoSalvos", JSON.stringify(selecionados));

    setTimeout(() => {
      router.push("/criar/conselho");
    }, 10);

  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">

      {/* CONTEÚDO PRINCIPAL */}
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

          {/* LISTA DE REPRESENTANTES */}
          <div
            className="bg-[hsl(var(--background))] rounded-xl border-2 border-[hsl(var(--border))] shadow-sm 
            w-[48.4rem] p-[1.25rem] flex flex-col gap-3"
            style={{
              height: "30rem",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >

            {/* CAMPO DE BUSCA */}
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

          {/* BOTÕES */}
          <div className="w-[48.4rem] flex justify-between mt-[1rem]">
            <ButtonTT
              mode="default"
              onClick={() => router.push("/criar/conselho/turma")}
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] 
              px-[1.25rem] py-[0.5rem] rounded-md text-sm font-medium shadow-md transition-all"
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
        // aqui vou criar o conselho - e vai para selecionar professor e uc
        onProximo={handleProximoPasso}
      />
    </div>
  );
}
