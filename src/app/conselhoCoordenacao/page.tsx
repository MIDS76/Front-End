"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionModal from "@/components/modal/actionModal";
import ButtonTT from "@/components/button/ButtonTT";
import InfoCard from "@/components/card/cardTituloTelas";
import UserInfo from "@/components/lista/userInfo";
import Lista from "@/components/lista/lista";
import AccessDeniedPage from "../access-denied"; 
import { useAuth } from "@/context/AuthContext";
import { validateRequired } from "@/utils/formValidation";
import { Usuario, Turma } from "@/utils/types"; 

import { buscarAlunosPorTurma } from "@/api/alunos"; 
import { buscarTurmas } from "@/api/turmas"; 
import { criarFeedbackAluno, criarFeedbackTurma } from "@/api/feedback"; 


type CampoFormulario = {
    titulo: string; 
    positivos: string;
    melhoria: string;
    sugestoes: string;
};

type FeedbackTurma = {
    positivosTurma: string;
    melhoriaTurma: string;
    sugestoesTurma: string;
};


const FeedbackTurmaCard = ({
    feedback,
    handleChange,
    erros,
}: {
    feedback: FeedbackTurma;
    handleChange: (campo: keyof FeedbackTurma, valor: string) => void;
    erros: Record<keyof FeedbackTurma, boolean>;
}) => {
    
    const camposTurma: (keyof FeedbackTurma)[] = ["positivosTurma", "melhoriaTurma", "sugestoesTurma"];
    
    return (
        <div className="mt-6 pl-2 pr-4 space-y-6 flex-grow">
            {camposTurma.map((campo) => {
                const isError = erros[campo] === true;
                
                let labelText = "";
                if (campo === "positivosTurma") labelText = "Pontos positivos da Turma";
                else if (campo === "melhoriaTurma") labelText = "Pontos de melhoria da Turma";
                else if (campo === "sugestoesTurma") labelText = "Sugestões para a Turma";

                return (
                    <div key={campo}>
                        <Label className="text-sm font-semibold" style={{ color: "hsl(var(--card-foreground))" }}>
                            {labelText}
                        </Label>
                        <Textarea
                            placeholder={`Insira aqui os ${labelText}...`}
                            className="mt-2 resize-none"
                            style={{ 
                                backgroundColor: "hsl(var(--popover))",
                                color: "hsl(var(--popover-foreground))",
                                border: isError ? "2px solid hsl(var(--destructive))" : "1px solid hsl(var(--border))", 
                                borderRadius: "var(--radius)",
                                minHeight: "4.5rem",
                            }}
                            value={feedback[campo]}
                            onChange={(e) => handleChange(campo, e.target.value)}
                        />
                        {isError && (<p className="text-sm mt-1" style={{ color: "hsl(var(--destructive))" }}>Este campo é obrigatório!</p>)}
                    </div>
                );
            })}
        </div>
    );
};


export default function ConselhoCoordenacao() {
    const router = useRouter();
    
    const turmaId = 2; 

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [turma, setTurma] = useState<Turma | undefined>(undefined); 
    const [formulario, setFormulario] = useState<CampoFormulario[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pagina, setPagina] = useState(0);
    const [searchQueryUsuarios, setSearchQueryUsuarios] = useState("");
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true); 
    
    const [exibirFeedbackTurma, setExibirFeedbackTurma] = useState(false); 
    const [feedbackTurma, setFeedbackTurma] = useState<FeedbackTurma>({
        positivosTurma: "",
        melhoriaTurma: "",
        sugestoesTurma: "",
    });
    const [errosTurma, setErrosTurma] = useState<Record<keyof FeedbackTurma, boolean>>({
        positivosTurma: false,
        melhoriaTurma: false,
        sugestoesTurma: false,
    });

    const [errosCampos, setErrosCampos] = useState<Record<keyof CampoFormulario, boolean>>({
        titulo: false, positivos: false, melhoria: false, sugestoes: false,
    });

    const camposAluno: (keyof CampoFormulario)[] = ["positivos", "melhoria", "sugestoes"];

 
    const validarCamposAluno = useCallback(() => {
        if (!formulario || formulario.length === 0 || pagina >= formulario.length) return true;
        const secaoAtual = formulario[pagina] ?? { positivos: "", melhoria: "", sugestoes: "", titulo: "" };
        
        const erros = {
            titulo: false,
            positivos: validateRequired(secaoAtual.positivos, "Pontos positivos") !== "",
            melhoria: validateRequired(secaoAtual.melhoria, "Pontos de melhoria") !== "",
            sugestoes: validateRequired(secaoAtual.sugestoes, "Sugestões") !== "",
        } as Record<keyof CampoFormulario, boolean>;
        
        setErrosCampos(erros); 

        if (erros.positivos || erros.melhoria || erros.sugestoes) {
            const firstErrorField = camposAluno.find(c => erros[c]);
            if (firstErrorField) {
                const label = firstErrorField === "positivos" ? "Pontos positivos" : firstErrorField === "melhoria" ? "Pontos de melhoria" : "Sugestões";
                toast.error(`O campo '${label}' é obrigatório para este aluno.`);
            }
            return false;
        }
        return true;
    }, [formulario, pagina, camposAluno]);
    
    const validarCamposTurma = useCallback(() => {
        const erros = {
            positivosTurma: validateRequired(feedbackTurma.positivosTurma, "Pontos positivos da Turma") !== "",
            melhoriaTurma: validateRequired(feedbackTurma.melhoriaTurma, "Pontos de melhoria da Turma") !== "",
            sugestoesTurma: validateRequired(feedbackTurma.sugestoesTurma, "Sugestões para a Turma") !== "",
        } as Record<keyof FeedbackTurma, boolean>;
        
        setErrosTurma(erros);

        if (erros.positivosTurma || erros.melhoriaTurma || erros.sugestoesTurma) {
            toast.error("Por favor, preencha todos os campos obrigatórios para o Feedback da Turma.");
            return false;
        }
        return true;
    }, [feedbackTurma]);

    const handleChange = (campo: keyof CampoFormulario, valor: string) => {
        const novoFormulario = [...formulario];
        const idx = Math.max(0, Math.min(pagina, novoFormulario.length - 1));
        if (idx >= 0 && idx < novoFormulario.length) {
             novoFormulario[idx] = { ...novoFormulario[idx], [campo]: valor };
             setFormulario(novoFormulario);
             setErrosCampos((prev) => ({ ...prev, [campo]: false }));
        }
    };
    
    const handleChangeTurma = (campo: keyof FeedbackTurma, valor: string) => {
        setFeedbackTurma((prev) => ({ ...prev, [campo]: valor }));
        setErrosTurma((prev) => ({ ...prev, [campo]: false }));
    };
    
    const handleTransitionToTurma = () => {
        if (!validarCamposAluno()) return;

        const todosAlunosPreenchidosCheck = formulario.every(
            (f) => f.positivos.trim() && f.melhoria.trim() && f.sugestoes.trim()
        );

        if (!todosAlunosPreenchidosCheck) {
            toast.error("Você deve preencher todos os feedbacks dos alunos antes de passar para o Feedback da Turma.");
            return;
        }
        
        setExibirFeedbackTurma(true); 
        setUsuarioSelecionado(null);
        setPagina(formulario.length); 
    };

    const trocarPagina = (novaPagina: number) => {
        if (novaPagina > pagina && !exibirFeedbackTurma) {
            if (!validarCamposAluno()) return;
        }
        
        if (novaPagina === formulario.length) {
            return; 
        }
        
        if (novaPagina >= 0 && novaPagina < formulario.length) {
            setExibirFeedbackTurma(false);
            setPagina(novaPagina);
            setUsuarioSelecionado(usuarios[novaPagina] ?? null);
            setErrosCampos({ titulo: false, positivos: false, melhoria: false, sugestoes: false });
        }
    };
    
    const handleSelecionarUsuario = (usuarioClicado: Usuario) => {
        if (!exibirFeedbackTurma && usuarioSelecionado && !validarCamposAluno()) return;
        
        const novaPagina = usuarios.findIndex((u) => u.nome === usuarioClicado.nome);
        
        if (novaPagina !== -1) {
            setExibirFeedbackTurma(false); 
            setPagina(novaPagina);
            setUsuarioSelecionado(usuarioClicado);
            setErrosCampos({ titulo: false, positivos: false, melhoria: false, sugestoes: false });
        }
    };
    
    const handleConcluir = async () => {
        if (!validarCamposTurma()) return; 
        
        if (!turmaId) {
            toast.error("ID da turma não está disponível para salvar.");
            return;
        }

        try {
            for (const [index, feedback] of formulario.entries()) {
                const aluno = usuarios[index];
                if (!aluno?.id) continue; 

                const dadosFeedbackAluno = {
                    turmaId: turmaId,
                    alunoId: aluno.id, 
                    pontosPositivos: feedback.positivos,
                    pontosMelhoria: feedback.melhoria,
                    sugestoes: feedback.sugestoes,
                };
                
                await criarFeedbackAluno(dadosFeedbackAluno);
            }
            
            const dadosFeedbackTurma = {
                turmaId: turmaId,
                dataConclusao: new Date().toISOString(),
                positivosTurma: feedbackTurma.positivosTurma,
                pontosMelhoria: feedbackTurma.melhoriaTurma,
                sugestoes: feedbackTurma.sugestoesTurma,
            };
            
            await criarFeedbackTurma(dadosFeedbackTurma);
            
            toast.success("Conselho concluído e salvo com sucesso!");
            localStorage.removeItem(`conselho-formulario-${turmaId}`); 
            localStorage.removeItem(`conselho-turma-${turmaId}`); 

            const usuarioJson = localStorage.getItem("user");
            if (usuarioJson) {
                const usuario = JSON.parse(usuarioJson);
                if (usuario && usuario.perfil) {
                    setTimeout(() => router.push(`/${usuario.perfil}`), 800);
                }
            }
            
        } catch (error) {
            toast.error("Falha ao salvar o conselho.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            
            if (!turmaId || isNaN(turmaId) || turmaId <= 0) {
                setIsLoading(false);
                return;
            }

            try {
                const alunosDaTurmaBrutos = await buscarAlunosPorTurma(turmaId);
                const alunosPadronizados: Usuario[] = (alunosDaTurmaBrutos || []).map((alunoBruto: any) => ({
                    id: alunoBruto.id,
                    nome: alunoBruto.nome,
                    email: alunoBruto.email,
                    isActive: alunoBruto.statusAtividadeAluno, 
                    role: "ALUNO", 
                }));
                const alunosAtivos: Usuario[] = alunosPadronizados.filter((u) => u.role === "ALUNO" && u.isActive);
                setUsuarios(alunosAtivos);
                
                const turmasArray = await buscarTurmas();
                const turmaEncontrada = turmasArray?.find((t) => t.id === turmaId);
                setTurma(turmaEncontrada);

                const chaveLocalStorageAlunos = `conselho-formulario-${turmaId}`;
                const chaveLocalStorageTurma = `conselho-turma-${turmaId}`;
                const salvoRawAlunos = localStorage.getItem(chaveLocalStorageAlunos);
                const salvoRawTurma = localStorage.getItem(chaveLocalStorageTurma);
                
                const inicialAlunos: CampoFormulario[] = alunosAtivos.map((aluno) => ({
                    titulo: aluno.nome,
                    positivos: "", melhoria: "", sugestoes: "",
                }));
                let formulariosAlinhados = inicialAlunos;
                
                if (salvoRawAlunos) {
                    try {
                        const salvo: CampoFormulario[] = JSON.parse(salvoRawAlunos);
                        formulariosAlinhados = alunosAtivos.map((aluno) => {
                            const achado = salvo.find((s) => s.titulo === aluno.nome);
                            return achado ?? { titulo: aluno.nome, positivos: "", melhoria: "", sugestoes: "" };
                        });
                    } catch {}
                }
                setFormulario(formulariosAlinhados);
                
                let feedbackTurmaInicial = { positivosTurma: "", melhoriaTurma: "", sugestoesTurma: "" };
                if (salvoRawTurma) {
                    try {
                        feedbackTurmaInicial = JSON.parse(salvoRawTurma);
                    } catch {}
                }
                setFeedbackTurma(feedbackTurmaInicial);

                const primeiroAlunoIncompletoIndex = formulariosAlinhados.findIndex(
                    (f) => !f.positivos.trim() || !f.melhoria.trim() || !f.sugestoes.trim()
                );
                
                let initialPage = 0;
                let initialUsuario: Usuario | null = null;
                let initialExibirTurma = false;

                if (alunosAtivos.length > 0) {
                    if (primeiroAlunoIncompletoIndex !== -1) {
                        initialPage = primeiroAlunoIncompletoIndex;
                        initialUsuario = alunosAtivos[initialPage] || null;
                    } else {
                        initialExibirTurma = true;
                        initialPage = alunosAtivos.length;
                    }
                }

                setExibirFeedbackTurma(initialExibirTurma);
                setPagina(initialPage);
                setUsuarioSelecionado(initialUsuario);

            } catch (error) {
                toast.error("Falha ao carregar alunos e turma.");
                setUsuarios([]);
                setFormulario([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [turmaId]); 

 
    useEffect(() => {
        if (formulario.length > 0 && turmaId) {
            localStorage.setItem(`conselho-formulario-${turmaId}`, JSON.stringify(formulario));
        }
    }, [formulario, turmaId]);
    
    useEffect(() => {
        if (turmaId) {
            localStorage.setItem(`conselho-turma-${turmaId}`, JSON.stringify(feedbackTurma));
        }
    }, [feedbackTurma, turmaId]);


    const isAlunoAtualPreenchido = useMemo(() => {
        if (exibirFeedbackTurma || !usuarioSelecionado) return true;
        if (!formulario || formulario.length === 0 || pagina >= formulario.length) return true;
        
        const secaoAtual = formulario[pagina] ?? { positivos: "", melhoria: "", sugestoes: "", titulo: "" };
        
        return secaoAtual.positivos.trim() !== "" && 
               secaoAtual.melhoria.trim() !== "" && 
               secaoAtual.sugestoes.trim() !== "";

    }, [formulario, pagina, exibirFeedbackTurma, usuarioSelecionado]);


    const alunosFiltrados = useMemo(() => {
        return usuarios.filter((usuario) =>
            usuario.nome.toLowerCase().includes(searchQueryUsuarios.toLowerCase())
        );
    }, [usuarios, searchQueryUsuarios]);

    const secaoAtual = exibirFeedbackTurma 
        ? { titulo: "", positivos: "", melhoria: "", sugestoes: "" } 
        : (usuarioSelecionado
        ? formulario.find((f) => f.titulo === usuarioSelecionado.nome) ?? { titulo: "", positivos: "", melhoria: "", sugestoes: "" }
        : formulario[pagina] ?? { titulo: "", positivos: "", melhoria: "", sugestoes: "" });

    const todosAlunosPreenchidos = useMemo(() => {
        return formulario.length > 0 && formulario.every(
            (f) => f.positivos.trim() && f.melhoria.trim() && f.sugestoes.trim()
        );
    }, [formulario]);
    
    const todosTurmaPreenchidos = useMemo(() => {
        return feedbackTurma.positivosTurma.trim() && feedbackTurma.melhoriaTurma.trim() && feedbackTurma.sugestoesTurma.trim();
    }, [feedbackTurma]);

    const proximoDesabilitado = exibirFeedbackTurma || !isAlunoAtualPreenchido || pagina === formulario.length - 1;
    
    const enviarDesabilitado = exibirFeedbackTurma 
        ? !todosTurmaPreenchidos
        : !todosAlunosPreenchidos;

    const proximoButtonColor = {
        backgroundColor: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: `1px solid hsl(var(--primary))`,
    };
    
    const { user } = useAuth();
    
    if (user?.role !== "pedagogico" && user?.role !== "admin") {
        return AccessDeniedPage();
    }
    
    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
                <p className="text-xl animate-pulse">
                    Carregando dados da turma...
                </p>
            </div>
        );
    }
    
    if (!turma || usuarios.length === 0) {
        return (
            <div className="w-screen h-screen flex items-center justify-center p-8" style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
                <div className="text-center">
                    <p className="text-2xl font-bold text-red-500 mb-4">
                        Erro ao carregar Turma
                    </p>
                    <p className="text-lg">
                        A turma não foi encontrada ou não possui alunos ativos para avaliação.
                    </p>
                </div>
            </div>
        );
    }

    
    return (
        <div
            className="w-screen h-screen flex flex-col items-center justify-center overflow-auto lg:overflow-hidden px-4 xl:px-8 py-4 lg:py-0"
            style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
        >
            <div className="flex w-full max-w-[100rem] justify-center gap-4 xl:gap-8">
                
                <div className="flex flex-col flex-1 max-w-[46.875rem] min-w-0 gap-4">
                    <InfoCard
                        titulo={turma?.curso ?? "JGS - AI MIDS 2024/1 INT1"}
                        descricao={turma?.nome ?? "WEG - MI 76"}
                    />

                    <div
                        className="w-full h-[26rem] lg:h-[32rem] rounded-2xl shadow-inner overflow-hidden border"
                        style={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                        }}
                    >
                        <input 
                            type="text"
                            placeholder="Buscar um usuário"
                            value={searchQueryUsuarios}
                            onChange={(e) => setSearchQueryUsuarios(e.target.value)}
                            className="w-full p-4 border-b focus:outline-none"
                            style={{
                                backgroundColor: "hsl(var(--background))",
                                color: "hsl(var(--foreground))",
                                borderColor: "hsl(var(--border))"
                            }}
                        />
                        <ScrollArea className="h-full w-full p-2">
                            <Lista
                                usuarios={alunosFiltrados}
                                tipo="limpa"
                                isDialogOpen={false}
                                setIsDialogOpen={() => { }}
                                className="flex flex-col gap-2"
                                onSelect={handleSelecionarUsuario} 
                                usuarioSelecionado={usuarioSelecionado}
                            />
                        </ScrollArea>
                    </div>
                </div>

                <div className="flex flex-col flex-1 max-w-[46.875rem] min-w-0">
                    
                    <div
                        className="rounded-3xl shadow p-6 w-full flex flex-col gap-6 flex-grow"
                        style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
                    >
                        <div className="flex flex-row items-start justify-between gap-4 mt-2 scale-105 origin-left">
                            
                            <div className="flex-shrink-0">
                                {!exibirFeedbackTurma && usuarioSelecionado && (
                                    <UserInfo
                                        nome={usuarioSelecionado.nome}
                                        email={usuarioSelecionado.email}
                                        copy={false}
                                        active={usuarioSelecionado.isActive}
                                    />
                                )}
                            </div>
                            
                            {exibirFeedbackTurma && (
                                <div className="flex flex-col flex-shrink-0 w-full">
                                    <div className="flex justify-between items-start">
                                        <div className="text-2xl font-bold">{turma?.nome ?? "MI 76"}</div>
                                    </div>
                                    <p className="text-sm font-normal text-left -mt-1">Curso: {turma?.curso ?? "Desenvolvimento de Sistemas"}</p>
                                </div>
                            )}
                        </div>

                        {exibirFeedbackTurma ? (
                            <FeedbackTurmaCard 
                                feedback={feedbackTurma} 
                                handleChange={handleChangeTurma} 
                                erros={errosTurma} 
                            />
                        ) : (
                            <div className="mt-6 pl-2 pr-4 space-y-6 flex-grow">
                                {camposAluno.map((campo) => {
                                    const isError = errosCampos[campo] === true;
                                    return (
                                        <div key={campo}>
                                            <Label className="text-sm font-semibold" style={{ color: "hsl(var(--card-foreground))" }}>
                                                {campo === "positivos" ? "Pontos positivos" : campo === "melhoria" ? "Pontos de melhoria" : "Sugestões"}
                                            </Label>
                                            <Textarea
                                                placeholder={`Insira aqui os ${campo.replace("sugestoes", "sugestões")}...`}
                                                className="mt-2 resize-none"
                                                style={{
                                                    backgroundColor: "hsl(var(--popover))",
                                                    color: "hsl(var(--popover-foreground))",
                                                    border: isError ? "2px solid hsl(var(--destructive))" : "1px solid hsl(var(--border))",
                                                    borderRadius: "var(--radius)",
                                                    minHeight: "4.5rem",
                                                }}
                                                value={secaoAtual[campo]}
                                                onChange={(e) => handleChange(campo, e.target.value)}
                                            />
                                            {isError && (
                                                <p className="text-sm mt-1" style={{ color: "hsl(var(--destructive))" }}>
                                                    Este campo é obrigatório!
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-6 w-full">
                        <div className="flex gap-4">
                            
                            <ButtonTT
                                tooltip="Anterior"
                                mode="default"
                                onClick={() => {
                                    if (exibirFeedbackTurma) {
                                        setExibirFeedbackTurma(false);
                                        setPagina(formulario.length - 1); 
                                        setUsuarioSelecionado(usuarios[formulario.length - 1] ?? null);
                                    } else {
                                        trocarPagina(pagina - 1);
                                    }
                                }}
                                disabled={!exibirFeedbackTurma && pagina === 0} 
                                className="text-sm px-8"
                                style={{
                                    backgroundColor: "hsl(var(--card))",
                                    color: "hsl(var(--foreground))",
                                    border: "1px solid hsl(var(--border))",
                                    opacity: (!exibirFeedbackTurma && pagina === 0) ? 0.5 : 1, 
                                    cursor: (!exibirFeedbackTurma && pagina === 0) ? "not-allowed" : "pointer",
                                }}
                            >
                                Anterior
                            </ButtonTT>

                            <ButtonTT
                                tooltip="Próximo aluno"
                                mode="default"
                                onClick={() => trocarPagina(pagina + 1)}
                                disabled={proximoDesabilitado} 
                                className="text-sm px-8"
                                style={{
                                    ...proximoButtonColor, 
                                    opacity: (proximoDesabilitado) ? 0.5 : 1,
                                    cursor: (proximoDesabilitado) ? "not-allowed" : "pointer",
                                }}
                            >
                                Próximo
                            </ButtonTT>
                        </div>

                        <ButtonTT
                            tooltip={exibirFeedbackTurma ? "Enviar Conselho" : (todosAlunosPreenchidos ? "Passar para Feedback da Turma" : "Preencha todos os alunos antes de avançar")}
                            mode="default"
                            onClick={() => exibirFeedbackTurma ? setIsConfirmOpen(true) : handleTransitionToTurma()} 
                            disabled={enviarDesabilitado}
                            className="text-sm px-8"
                            style={{
                                backgroundColor: "hsl(var(--primary))",
                                color: "hsl(var(--primary-foreground))",
                                borderRadius: "var(--radius)",
                                opacity: enviarDesabilitado ? 0.5 : 1,
                                cursor: enviarDesabilitado ? "not-allowed" : "pointer",
                                border: `1px solid hsl(var(--primary))`,
                            }}
                        >
                            {exibirFeedbackTurma ? "Enviar" : "Avançar"}
                        </ButtonTT>
                    </div>
                </div>
            </div>

            <ActionModal
                isOpen={isConfirmOpen}
                setOpen={setIsConfirmOpen}
                title="Concluir e Enviar Conselho"
                actionButtonLabel="Enviar Conselho"
                onConfirm={() => {
                    if (validarCamposTurma()) {
                        handleConcluir();
                        setIsConfirmOpen(false);
                    }
                }}
            />
        </div>
    );
}