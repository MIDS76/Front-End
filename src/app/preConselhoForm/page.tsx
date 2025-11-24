"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ActionModal from "@/components/modal/actionModal";  // Modal de confirmação
import SucessoEnviarModal from "@/components/modal/sucessoEnviarModal";
import ButtonTT from "@/components/button/ButtonTT";
import { toast } from "sonner";
import usuariosData from "@/data/usuarios.json";
import InfoCard from "@/components/card/cardTituloTelas";
import { useRouter } from "next/navigation"; // Usar diretamente no componente
import { validateRequired } from "@/utils/formValidation";

type CampoFormulario = {
  titulo: string;
  descricao: string;
  positivos: string;
  melhoria: string;
  sugestoes: string;
};

const descricaoPorRole = (role: string): string => {
  switch (role) {
    case "Professor":
      return "Relacionado ao desempenho em sala, didática, relacionamento com os alunos e domínio da matéria.";
    case "Supervisor":
      return "Avalie os aspectos relacionados à metodologia de ensino, domínio de conteúdo, clareza nas orientações, postura profissional e qualidade do acompanhamento oferecido pela supervisão.";
    case "Técnico Pedagógico":
      return "Relacionado ao apoio à turma, acompanhamento pedagógico e comunicação com os docentes.";
    case "Secretária Pedagógica":
      return "Avalie os aspectos relacionados à organização acadêmica, eficiência no atendimento, clareza nas informações, disponibilidade para auxiliar e qualidade no suporte prestado pela Secretaria Pedagógica.";
    default:
      return "";
  }
};

const secoesIniciais: CampoFormulario[] = [
  ...usuariosData
    .filter((u) => u.role !== "Aluno" && u.isActive)
    .sort((a, b) => {
      const ordem = ["Supervisor", "Técnico Pedagógico", "Secretária Pedagógica", "Professor"];
      return ordem.indexOf(a.role) - ordem.indexOf(b.role);
    })
    .map((u) => ({
      titulo: `${u.role} ${u.nome}`,
      descricao: descricaoPorRole(u.role),
      positivos: "",
      melhoria: "",
      sugestoes: "",
    })),
  {
    titulo: "Ambiente de Ensino",
    descricao:
      "Avalie os aspectos relacionados à estrutura física e tecnológica, recursos disponíveis para as aulas, conforto, acessibilidade, segurança e adequação do ambiente ao processo de aprendizagem",
    positivos: "",
    melhoria: "",
    sugestoes: "",
  },
];

export default function PreConselhoFormulario() {
  const [formulario, setFormulario] = useState<CampoFormulario[]>(secoesIniciais);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false); // Modal de sucesso
  const [pagina, setPagina] = useState(0);
  const [camposErro, setCamposErro] = useState<{ [key: string]: string }>({});
  const router = useRouter(); // Use diretamente no componente

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

  const handleSalvar = () => {
    const tudoPreenchido = formulario.every((secao) => camposPreenchidos(secao));
    if (!tudoPreenchido) {
      toast.error("Preencha todos os campos antes de enviar o formulário completo!");
      return;
    }

    toast.success("Pré-conselho salvo com sucesso!");
    localStorage.setItem("preconselho-formulario", JSON.stringify(formulario));

    // Abre o modal de sucesso
    setIsSuccessOpen(true);
    setIsConfirmOpen(false); // Fecha o modal de confirmação
  };

  const secaoAtual = formulario[pagina];

  const handleGoHome = () => {
    router.push("/aluno"); // Redireciona para a página /aluno
  };

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
            onClick={() => setPagina(pagina - 1)}
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
