"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import LogLateral from "@/components/sidebar/logLateral";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "@/app/access-denied";
import InfoCard from "@/components/card/cardTituloTelas";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import ActionModal from "@/components/modal/actionModal";
import { listarUnidadeCurricular, listarProfessores, preConselhoProfessor } from "@/api/preConselho";
import { UnidadeCurricular, Usuario } from "@/utils/types";
import { atualizarEtapa } from "@/api/conselho";

export default function ConselhoPage() {
  const router = useRouter();

  const [selectedUnidades, setSelectedUnidades] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);
  const [salvos, setSalvos] = useState<{ unidade: string; professor: string }[]>([]);
  const [buscaProfessor, setBuscaProfessor] = useState("");
  const [buscaUnidade, setBuscaUnidade] = useState("");
  const [erros, setErros] = useState<{ professor?: boolean; unidade?: boolean }>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [UnidadeCurriculares, setUnidadeCurriculares] = useState<UnidadeCurricular[]>([]);
  const [usuario, setUsuario] = useState<Usuario[]>([]);
  const [conselhoId, setConselho] = useState<number | null>(null);

  useEffect(() => {
    const c = localStorage.getItem("idConselho");
    if (c) {
      setConselho(Number(JSON.parse(c)));
    } else {
      toast.error("Nenhum conselho encontrado.");
    }
  }, []);

  // Carregar unidade curricular ao iniciar
  useEffect(() => {
    const carregarUnidadeCurricular = async () => {
      const data = await listarUnidadeCurricular();
      if (!data) {
        toast.error("Erro ao carregar unidade curricular.");
        return;
      }
      setUnidadeCurriculares(data);
    };
    carregarUnidadeCurricular();
  }, []);

  // Carregar professores ao iniciar
  useEffect(() => {
    const carregarProfessores = async () => {
      const data = await listarProfessores();
      if (!data) {
        toast.error("Erro ao carregar professores.");
        return;
      }
      setUsuario(data);
    };
    carregarProfessores();
  }, []);

  // Normalizar os textos para busca
  const normalizar = (texto: string) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filtrar unidades e professores
  const unidadesFiltradas = UnidadeCurriculares.filter((u) =>
    normalizar(u.nome).includes(normalizar(buscaUnidade))
  );
  const professoresFiltrados = usuario.filter((p) =>
    normalizar(p.nome).includes(normalizar(buscaProfessor))
  );

  // Toggle para selecionar unidades
  function toggleUnidade(idUc: string) {
    setSelectedUnidades((prev) =>
      prev.includes(idUc) ? prev.filter((p) => p !== idUc) : [...prev, idUc]
    );
  }

  // Carregar dados salvos no localStorage
  // useEffect(() => {
  //   const dadosSalvos = localStorage.getItem("conselhoSalvos");

  //   if (dadosSalvos) {
  //     try {
  //       setSalvos(JSON.parse(dadosSalvos));
  //     } catch {
  //       console.error("Erro ao carregar unidade curriculares e professores salvos.");
  //     }
  //   }
  // }, []);

  // // Salvar dados no localStorage
  // useEffect(() => {
  //   if (salvos.length > 0) {
  //     localStorage.setItem("conselhoSalvos", JSON.stringify(salvos));
  //   }
  // }, [salvos]);

  // Salvar as alterações feitas
  function handleSalvar() {
    const novosErros: { professor?: boolean; unidade?: boolean } = {};

    if (selectedUnidades.length === 0) novosErros.unidade = true;
    if (!selectedProfessor) novosErros.professor = true;

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      toast.error("Selecione ao menos um professor e uma unidade curricular antes de salvar!");
      return;
    }

    setErros({});

    const novos = selectedUnidades.map((u) => ({
      unidade: u,
      professor: selectedProfessor!,
    }));

    const combinacoesExistentes = salvos.some(
      (item) =>
        novos.some(
          (novo) => novo.unidade === item.unidade && novo.professor === item.professor
        )
    );

    if (combinacoesExistentes) {
      toast.error("Esta combinação de unidade e professor já foi adicionada!");
      return;
    }

    const novosSalvos = [...salvos, ...novos];

    setSalvos(novosSalvos);
    // localStorage.setItem("conselhoSalvos", JSON.stringify(novosSalvos));

    setSelectedUnidades([]);
    setSelectedProfessor(null);

    toast.success("Unidade(s) e professor adicionados com sucesso!");
  }

  function handleRemover(unidade: string) {
    const atualizados = salvos.filter((s) => s.unidade !== unidade);
    setSalvos(atualizados);
  }

  // Verificar se o usuário tem permissão
  const { user } = useAuth();
  if (user?.role !== "pedagogico" && user?.role !== "admin") {
    return AccessDeniedPage();
  }

  // Ação do próximo passo
  function handleProximoPasso() {
    // localStorage.setItem("conselhoSalvos", JSON.stringify(salvos));


    setIsConfirmOpen(true);
  }

  // Confirmar as unidades e professores
  async function handleConfirmarUcProfessores() {
    try {
      if (!conselhoId) {
        toast.error("O Conselho não foi encontrado.");
        return;
      }
      console.log("id conselho" + conselhoId);

      await atualizarEtapa(conselhoId, "PRE_CONSELHO");
      console.log(atualizarEtapa);

      toast.success("Pré-conselho liberado com sucesso");

      localStorage.removeItem("representantes-selecionados");
      localStorage.removeItem("associacoes");
      localStorage.removeItem("preconselho-formulario");

      function normalizeRole(str: string) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      }

      const role = normalizeRole(localStorage.getItem("user-role") || "");

      const rotasPorRole: Record<string, string> = {
        "aluno": "/aluno",
        "coordenacao pedagogica": "/pedagogico",
        "administrador": "/admin",
      };

      router.push(rotasPorRole[role] || "/admin");

    } catch (e) {
      console.error("Erro ao limpar localStorage:", e);
      toast.error("Erro ao liberar o pré-conselho.");
    } finally {
      setIsConfirmOpen(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 px-[3rem] pt-[2rem] pb-[3rem] mt-[5rem]">
        <div className="max-w-[80rem] mx-auto">
          <div className="flex justify-center mt-[1.5rem]">
            <InfoCard
              titulo="Conselho da Turma MI 76"
              descricao="Selecione os professores de cada unidade curricular"
              className="w-[48.5rem]"
            />
          </div>

          <div className="flex justify-center gap-[3.5rem] mt-[1rem]">
            {/* PROFESSORES */}
            <div
              className={`bg-[hsl(var(--card))] rounded-xl border shadow-sm w-[22.5rem] h-[30rem] p-[1.25rem] flex flex-col ${erros.professor ? "border-destructive" : "border-[hsl(var(--border))]"
                }`}
            >
              <h3 className="text-sm font-semibold text-[hsl(var(--secondary))] mb-[0.5rem]">
                Selecione os professores
              </h3>

              <div className="relative mb-[0.75rem]">
                <FiSearch className="absolute left-[0.75rem] top-[0.625rem] text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Buscar Professor"
                  value={buscaProfessor}
                  onChange={(e) => setBuscaProfessor(e.target.value)}
                  className="w-full pl-[2.25rem] pr-[0.75rem] py-[0.5rem] text-sm border rounded-md border-[hsl(var(--border))] bg-white focus:ring-1 focus:ring-[hsl(var(--primary))]"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-[0.25rem]">
                <div className="grid gap-[0.5rem]">
                  {professoresFiltrados.map((prof) => (
                    <label key={prof.id} className="flex items-center gap-[0.75rem] text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="professor"
                        value={prof.id}
                        checked={selectedProfessor === prof.nome?.toString()}
                        onChange={() => {
                          setSelectedProfessor(prof.nome?.toString() || null);
                          setErros((prev) => ({ ...prev, professor: false }));
                        }}
                        className="w-[1rem] h-[1rem] accent-[hsl(var(--primary))]"
                      />
                      <span className="truncate">{prof.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
              {erros.professor && (
                <p className="text-destructive text-sm mt-2">Selecione um professor!</p>
              )}
            </div>

            {/* UNIDADES */}
            <div
              className={`bg-[hsl(var(--card))] rounded-xl border shadow-sm w-[22.5rem] h-[30rem] p-[1.25rem] flex flex-col ${erros.unidade ? "border-destructive" : "border-[hsl(var(--border))]"
                }`}
            >
              <h3 className="text-sm font-semibold text-[hsl(var(--secondary))] mb-[0.5rem]">
                Selecione as unidades curriculares
              </h3>

              <div className="relative mb-[0.75rem]">
                <FiSearch className="absolute left-[0.75rem] top-[0.625rem] text-[hsl(var(--muted-foreground))]" />
                <input
                  type="text"
                  placeholder="Buscar Unidade Curricular"
                  value={buscaUnidade}
                  onChange={(e) => setBuscaUnidade(e.target.value)}
                  className="w-full pl-[2.25rem] pr-[0.75rem] py-[0.5rem] text-sm border rounded-md border-[hsl(var(--border))] bg-white focus:ring-1 focus:ring-[hsl(var(--primary))]"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-[0.25rem]">
                <div className="grid gap-[0.5rem]">
                  {unidadesFiltradas.map((uc) => (
                    <label key={uc.id} className="flex items-center gap-[0.75rem] text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUnidades.includes(uc.nome!.toString())}
                        onChange={() => {
                          toggleUnidade(uc.nome!.toString());
                          setErros((prev) => ({ ...prev, unidade: false }));
                        }}
                        className="w-[1rem] h-[1rem] accent-[hsl(var(--primary))]"
                      />
                      <span className="truncate">{uc.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
              {erros.unidade && (
                <p className="text-destructive text-sm mt-2">Selecione ao menos uma unidade!</p>
              )}
            </div>
          </div>

          {/* BOTÃO SALVAR */}
          <div className="flex justify-between mt-[1rem] w-[48.4rem] mx-auto">
            <ButtonTT
              mode="default"
              onClick={() => router.push("/criar/conselho/representante")}
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] 
              px-[1.25rem] py-[0.5rem] rounded-md text-sm font-medium shadow-md transition-all"
            >
              Anterior
            </ButtonTT>
            <ButtonTT
              mode="default"
              onClick={handleSalvar}
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] px-[1.5rem] py-[0.5rem] rounded-md text-sm font-medium shadow-md transition-all duration-200"
            >
              Salvar
            </ButtonTT>
          </div>
        </div>
      </main>

      <LogLateral
        titulo="Unidade Curricular"
        subtitulo="Professor"
        itens={salvos.map((s, i) => ({
          id: `${s.unidade}-${s.professor}-${i}`,
          unidade: s.unidade,
          professor: s.professor,
        }))}
        onRemover={handleRemover}
        vazioTexto="Nenhuma unidade salva ainda"
        onProximo={handleProximoPasso}
      />

      {/* ACTION MODAL: */}
      <ActionModal
        isOpen={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        title="Deseja liberar pré-conselho?"
        conteudo="Ao confirmar, todos os dados relacionados ao pré-conselho serão enviados."
        actionButtonLabel="Confirmar"
        onConfirm={handleConfirmarUcProfessores}
      />
    </div>
  );
}
