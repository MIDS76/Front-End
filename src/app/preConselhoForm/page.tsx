"use client";

import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";
import SucessoEnviarModal from "@/components/modal/sucessoEnviarModal";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import InfoCard from "@/components/card/cardTituloTelas";
import { useParams, useRouter } from "next/navigation";
import { validateRequired } from "@/utils/formValidation";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedPage from "../access-denied";
import { listarPreConselhoProfessorPorConselho, preConselhoAmbienteEnsino, preConselhoPedagogico, preConselhoProfessor, preConselhoSupervisao } from "@/api/preConselho";

type CampoFormulario = {
  titulo: string;
  descricao: string;
  positivos: string;
  melhoria: string;
  sugestoes: string;
};

export type UsuarioApi = {
  id: number;
  idPreConselho: number;
  idUnidadeCurricular: number;
  nomeUc: string;
  idProfessor: number;
  nomeProfessor: string;
  pontosPositivos: string;
  pontoMelhoria: string;
  sugestoes: string;
}

export default function PreConselhoFormulario() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [camposErro, setCamposErro] = useState<{ [key: string]: string }>({});

  const [formulario, setFormulario] = useState<CampoFormulario[]>([]);
  const [professoresData, setProfessoresData] = useState<UsuarioApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { id } = useParams();

  const idPreConselho = 1;

  const createInitialFormSections = useCallback((data: UsuarioApi[]): CampoFormulario[] => {
    const secoesProfessor = data
      .map((u) => ({
        titulo: `Professor ${u.nomeProfessor} - ${u.nomeUc}`,
        descricao: "Relacionado ao desempenho em sala, didática, relacionamento com os alunos e domínio da matéria.",
        positivos: "",
        melhoria: "",
        sugestoes: "",
      }));

    const secoesFixas: CampoFormulario[] = [
      {
        titulo: "Supervisor",
        descricao:
          "Avalie os aspectos relacionados à metodologia de ensino, domínio de conteúdo, clareza nas orientações, postura profissional e qualidade do acompanhamento oferecido pela supervisão.",
        positivos: "", melhoria: "", sugestoes: "",
      },
      {
        titulo: "Técnico Pedagógico",
        descricao:
          "Relacionado ao apoio à turma, acompanhamento pedagógico e comunicação com os docentes.",
        positivos: "", melhoria: "", sugestoes: "",
      },
      {
        titulo: "Ambiente de Ensino",
        descricao:
          "Avalie os aspectos relacionados à estrutura física e tecnológica, recursos disponíveis para as aulas, conforto, acessibilidade, segurança e adequação do ambiente ao processo de aprendizagem",
        positivos: "", melhoria: "", sugestoes: "",
      },
    ];

    return [...secoesProfessor, ...secoesFixas];
  }, []);


  useEffect(() => {
    const fetchAndInitialize = async () => {
      setIsLoading(true);
      try {
        const professores = await listarPreConselhoProfessorPorConselho(idPreConselho);

        console.log(professores);

        if (professores && Array.isArray(professores)) {
          setProfessoresData(professores);
          const novasSecoesIniciais = createInitialFormSections(professores);
          console.log(novasSecoesIniciais);

          const salvo = localStorage.getItem("preconselho-formulario");
          let dadosSalvos = null;

          if (salvo) {
            try {
              dadosSalvos = JSON.parse(salvo);
            } catch (error) {
              console.error("Erro ao fazer parsing do localStorage:", error);
            }
          }

          if (Array.isArray(dadosSalvos) && dadosSalvos.length > 0) {
            setFormulario(dadosSalvos);
          } else {
            setFormulario(novasSecoesIniciais);
          }

        } else {
          toast.error("Não foi possível carregar a lista de avaliados.");
          setFormulario([]);
        }
      } catch (err) {
        console.error("Falha ao buscar dados de professores.", err);
        toast.error("Falha ao carregar dados. Tente recarregar a página.");
        setFormulario([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (idPreConselho) {
      fetchAndInitialize();
    } else {
      setIsLoading(false);
      toast.error("ID do Conselho não encontrado.");
    }
  }, [idPreConselho, createInitialFormSections]);


  useEffect(() => {
    const salvo = localStorage.getItem("preconselho-formulario");
    if (salvo) {
      try {
        setFormulario(JSON.parse(salvo));
      } catch {
        console.error("Erro ao carregar dados salvos");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("preconselho-formulario", JSON.stringify(formulario));
  }, [formulario]);

  const handleChange = (campo: keyof CampoFormulario, valor: string) => {
    const novoFormulario = [...formulario];
    novoFormulario[pagina] = { ...novoFormulario[pagina], [campo]: valor };
    setFormulario(novoFormulario);

    setCamposErro((prev) => {
      const novoErro = { ...prev };
      delete novoErro[campo];
      return novoErro;
    });
  };

  const camposPreenchidos = (secao: CampoFormulario) => {
    return (
      secao.positivos.trim() !== "" &&
      secao.melhoria.trim() !== "" &&
      secao.sugestoes.trim() !== ""
    );
  };

  const handleNext = () => {
    const secaoAtual = formulario[pagina];
    const novosErros: { [key: string]: string } = {};

    novosErros.positivos = validateRequired(secaoAtual.positivos, "pontos positivos");
    novosErros.melhoria = validateRequired(secaoAtual.melhoria, "melhoria");
    novosErros.sugestoes = validateRequired(secaoAtual.sugestoes, "sugestões");

    if (Object.values(novosErros).some((erro) => erro)) {
      setCamposErro(novosErros);
      toast.error("Preencha todos os campos antes de continuar!");
      return;
    }

    setCamposErro({});
    setPagina(pagina + 1);
  };

  const handleSalvar = async () => {
    const tudoPreenchido = formulario.every((secao) => camposPreenchidos(secao));
    if (!tudoPreenchido) {
      toast.error("Preencha todos os campos antes de enviar o formulário completo!");
      return;
    }

    try {
      const promises = [];

      for (const secao of formulario) {
        const dataPadrao = {
          idPreConselho: idPreConselho,
          pontosPositivos: secao.positivos,
          pontosMelhoria: secao.melhoria,
          sugestoes: secao.sugestoes,
        };


        if (secao.titulo.startsWith("Supervisor")) {
          promises.push(preConselhoSupervisao(dataPadrao));
        } else if (secao.titulo.startsWith("Técnico Pedagógico")) {
          promises.push(preConselhoPedagogico(dataPadrao));
        } else if (secao.titulo.startsWith("Ambiente de Ensino")) {
          promises.push(preConselhoAmbienteEnsino(dataPadrao));
        } else if (secao.titulo.startsWith("Professor")) {

          const match = secao.titulo.match(/Professor\s(.*?)\s-\s(.*?)$/);
            
            if (match) {
                const nomeProfessorTitulo = match[1].trim();
                const nomeUcTitulo = match[2].trim();

                const usuario = professoresData.find(u => 
                    u.nomeProfessor.trim() === nomeProfessorTitulo && 
                    u.nomeUc.trim() === nomeUcTitulo
                );

                if (usuario) {
                    const dadosProfessor = {
                        ...dataPadrao,
                        idUnidadeCurricular: usuario.idUnidadeCurricular, 
                        idProfessor: usuario.idProfessor,
                    };

                    promises.push(preConselhoProfessor(
                        usuario.id,
                        dadosProfessor
                    ));

                } else {
                    console.error("Dados de professor/unidade curricular não encontrados para: ", secao.titulo);
                }
            } else {
                console.error("Erro de formatação no título do professor:", secao.titulo);
            }
        }
      }

      await Promise.all(promises);

      toast.success("Pré-conselho salvo com sucesso!");
      localStorage.removeItem("preconselho-formulario");

      setIsSuccessOpen(true);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Erro durante o envio do formulário:", error);
      toast.error("Erro ao enviar o Pré-Conselho. Tente novamente.");
    }
  };

  const handleGoHome = () => {
    router.push("/aluno");
  };

  const { user } = useAuth();

  if (user?.role !== "aluno") {
    return AccessDeniedPage();
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-[90rem] mx-auto text-center" style={{ paddingTop: "10rem" }}>
        <p className="text-xl font-semibold text-primary">Carregando formulário e lista de avaliados...</p>
      </div>
    );
  }

  if (formulario.length === 0) {
    return (
      <div className="w-full max-w-[90rem] mx-auto text-center" style={{ paddingTop: "10rem" }}>
        <p className="text-xl font-semibold text-destructive">Não há avaliações a serem exibidas para este pré-conselho.</p>
        <ButtonTT
          tooltip="Voltar"
          mode="default"
          onClick={handleGoHome}
          className="mt-6 text-[0.875rem] leading-[1.25rem] px-8"
        >
          Voltar para Home
        </ButtonTT>
      </div>
    );
  }

  const secaoAtual = formulario[pagina];

  if (!secaoAtual) {
    console.error("Erro: `secaoAtual` é undefined. Resetando a página.");
    setPagina(0);
    return null;
  }

  return (
    <div className="w-full max-w-[90rem] mx-auto overflow-x-hidden" style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
      <InfoCard
        titulo="Pré-Conselho"
        subtitulo={secaoAtual.titulo}
        descricao={secaoAtual.descricao}
        className="max-w-full tablet:max-w-[55rem] laptop:max-w-[75rem] desktop:max-w-[89rem] mx-auto"
      />

      <div className="mt-11 pl-2 pr-4 space-y-6 max-w-full tablet:max-w-[55rem] laptop:max-w-[75rem] desktop:max-w-[89rem] mx-auto">
        {["positivos", "melhoria", "sugestoes"].map((campo) => (
          <div key={campo} className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-primary transition-colors">
              {campo === "positivos" ? "Pontos positivos" : campo === "melhoria" ? "Pontos de melhoria" : "Sugestões"}
            </Label>

            <Textarea
              placeholder={`Insira aqui os ${campo}...`}
              className={`mt-1 resize-none rounded-xl border bg-background p-3 text-sm transition-colors focus:border-primary focus:ring-0 outline-none ${camposErro[campo] ? "border-destructive" : "border-border"}`}
              value={secaoAtual[campo as keyof CampoFormulario] as string}
              onChange={(e) => handleChange(campo as keyof CampoFormulario, e.target.value)}
              style={{ minHeight: "5rem" }}
            />
            {camposErro[campo] && <p className="text-destructive text-sm">Este campo é obrigatório!</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center pt-8 gap-4 pr-4 max-w-full tablet:max-w-[55rem] laptop:max-w-[75rem] desktop:max-w-[89rem] mx-auto">
        {pagina > 0 && (
          <ButtonTT
            tooltip="Anterior"
            mode="default"
            onClick={() => {
              const secaoAtual = formulario[pagina];
              const novosErros: { [key: string]: string } = {};

              novosErros.positivos = validateRequired(secaoAtual.positivos, "pontos positivos");
              novosErros.melhoria = validateRequired(secaoAtual.melhoria, "melhoria");
              novosErros.sugestoes = validateRequired(secaoAtual.sugestoes, "sugestões");

              if (Object.values(novosErros).some((erro) => erro)) {
                setCamposErro(novosErros);
                toast.error("Preencha todos os campos antes de voltar!");
                return;
              }

              setCamposErro({});
              setPagina(pagina - 1);
            }}
            className="text-[0.875rem] leading-[1.25rem] px-8"
          >
            Anterior
          </ButtonTT>
        )}

        {pagina < formulario.length - 1 ? (
          <ButtonTT tooltip="Próximo" mode="default" onClick={handleNext} className="text-[0.875rem] leading-[1.25rem] px-8">
            Próximo
          </ButtonTT>
        ) : (
          <ButtonTT tooltip="Salvar" mode="default" onClick={() => setIsConfirmOpen(true)} className="text-[0.875rem] leading-[1.25rem] px-8">
            Enviar
          </ButtonTT>
        )}
      </div>

      <ActionModal
        isOpen={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        title="Tem certeza que deseja enviar?"
        actionButtonLabel="Enviar"
        onConfirm={() => {
          handleSalvar();
          localStorage.removeItem("preconselho-formulario");
          setIsConfirmOpen(false);
        }}
      />

      <SucessoEnviarModal
        isOpen={isSuccessOpen}
        setOpen={setIsSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        handleGoHome={handleGoHome}
      />
    </div>
  );
}
