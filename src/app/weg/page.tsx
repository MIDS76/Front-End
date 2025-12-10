"use client";

import { useEffect, useRef, useState } from "react";
import { Turma } from "@/utils/types";
import MedModal from "@/components/modal/medModal";
import SearchBar from "@/components/input/searchBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ListaConselhos from "@/components/modal/listaConselhos";
import Paginacao from "@/components/paginacao/paginacao";
import { buscarTurmas } from "@/api/turmas";
import { buscarUltimoConselhoPorTurma } from "@/api/conselho";
import {
    ordenarOrdemAlfabeticaTurma,
    filtrarPorCurso,
    filtrarPorAnoEntrada
} from "@/api/filtros";
import { useAuth } from "@/context/AuthContext";
import BaixarDocumentosModal from "@/components/modal/BaixarDocumentosModal";

export default function WegPage() {
    const { user } = useAuth(); 

    const [allTurmas, setAllTurmas] = useState<Turma[]>([]);
    const [filteredTurmas, setFilteredTurmas] = useState<Turma[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ultimoConselhoMap, setUltimoConselhoMap] = useState<Record<number, string>>({});

    const [filtroAtivoKey, setFiltroAtivoKey] = useState(0);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [sideModalOpen, setSideModalOpen] = useState(false);
    const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
    const [screenWidth, setScreenWidth] = useState(0);

    const [baixarModalOpen, setBaixarModalOpen] = useState(false);
    const [conselhoSelecionado, setConselhoSelecionado] = useState<any | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateScreenWidth = () => setScreenWidth(window.innerWidth);
        updateScreenWidth();
        window.addEventListener("resize", updateScreenWidth);
        return () => window.removeEventListener("resize", updateScreenWidth);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const turmasArray = await buscarTurmas();
                setAllTurmas(turmasArray || []);
                setPaginaAtual(0);

                if (turmasArray?.length) {
                    const promises = turmasArray.map(turma => {
                        if (typeof turma.id === 'number' && turma.id > 0) {
                            return buscarUltimoConselhoPorTurma(turma.id);
                        }
                        return Promise.resolve(null);
                    });

                    const resultados = await Promise.all(promises);
                    const novoMapa: Record<number, string> = {};
                    
                    resultados.forEach((conselho, index) => {
                        const turma = turmasArray[index];
                        if (typeof turma.id === 'number' && turma.id > 0) {
                            if (conselho) {
                                if (conselho.etapas === "RESULTADO" && conselho.dataFim) {
                                    const dataFormatada = new Date(conselho.dataFim).toLocaleDateString('pt-BR');
                                    novoMapa[turma.id] = dataFormatada;
                                } else {
                                    novoMapa[turma.id] = "Em andamento";
                                }
                            } else {
                                novoMapa[turma.id] = "Não realizado";
                            }
                        }
                    });
                    setUltimoConselhoMap(novoMapa);
                }

            } catch (error) {
                console.error("Erro ao carregar dados da página WEG:", error);
                setAllTurmas([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const etapasEmAndamento = ["PRE_CONSELHO", "CONSELHO", "AGUARDANDO_RESULTADO", "NAO_INICIADO"];
    const etapaFinalizada = "RESULTADO";

    const handleAplicarFiltro = async (grupo: string, valor: string) => {
        setPaginaAtual(0);
        setIsLoading(true);
        let dadosNovos: Turma[] = [];

        try {
            if (grupo === "Turma") {
                dadosNovos = await ordenarOrdemAlfabeticaTurma(valor) || [];
            } else if (grupo === "Curso") {
                dadosNovos = await filtrarPorCurso(valor) || [];
            } else if (grupo === "Ano de Entrada") {
                dadosNovos = await filtrarPorAnoEntrada(valor) || [];
            } else if (grupo === "Conselho") {
                const todasAsTurmas = await buscarTurmas() || [];

                if (valor === "Todos") {
                    dadosNovos = todasAsTurmas;
                } else {
                    const promises = todasAsTurmas.map(turma => {
                        if (typeof turma.id === 'number' && turma.id > 0) {
                            return buscarUltimoConselhoPorTurma(turma.id);
                        }
                        return Promise.resolve(null);
                    });
                    const resultadosConselho = await Promise.all(promises);

                    const turmasComStatus = todasAsTurmas.map((turma, index) => ({
                        ...turma,
                        ultimoConselho: resultadosConselho[index]
                    }));

                    dadosNovos = turmasComStatus.filter(turma => {
                        const conselho = turma.ultimoConselho;
                        if (valor === "Resultado") {
                            return conselho
                                && conselho.etapas === etapaFinalizada
                                && conselho.dataFim
                                && String(conselho.dataFim).trim().length > 0;
                        } else if (valor === "Em andamento") {
                            return conselho?.etapas && (etapasEmAndamento.includes(conselho.etapas));
                        } else if (valor === "Não realizado") {
                            return !conselho;
                        }
                        return false;
                    });
                }
            } else {
                dadosNovos = await buscarTurmas() || [];
            }

            setAllTurmas(dadosNovos);
            setFiltroAtivoKey(prev => prev + 1);

        } catch (error) {
            console.error("Erro ao aplicar filtro:", error);
            setAllTurmas(await buscarTurmas() || []);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getTurmasPorPagina = () => {
            if (sideModalOpen) {
                if (screenWidth <= 1024) return 4;
                if (screenWidth <= 1366) return 6;
                return 12;
            } else {
                if (screenWidth <= 1024) return 8;
                if (screenWidth <= 1366) return 9;
                return 12;
            }
        };

        const turmasPorPagina = getTurmasPorPagina();
        let filtradas = [...allTurmas];

        const query = searchQuery.trim().toLowerCase().replaceAll(" ", "");
        if (query) {
            filtradas = filtradas.filter((turma) => {
                const nome = turma.nome?.trim().toLowerCase().replaceAll(" ", "") || "";
                const curso = turma.curso?.trim().toLowerCase().replaceAll(" ", "") || "";
                return nome.includes(query) || curso.includes(query);
            });
        }

        setTotalPages(Math.ceil(filtradas.length / turmasPorPagina));
        const inicio = paginaAtual * turmasPorPagina;
        const fim = inicio + turmasPorPagina;
        setFilteredTurmas(filtradas.slice(inicio, fim));

    }, [searchQuery, paginaAtual, screenWidth, sideModalOpen, allTurmas, filtroAtivoKey]);

    useEffect(() => {
        setPaginaAtual(0);
    }, [searchQuery]);

    const handleOpenModal = (turma: Turma) => {
        if (selectedTurma?.id === turma.id) {
            setSideModalOpen(false);
            setSelectedTurma(null);
            return;
        }
        setSelectedTurma(turma);
        setSideModalOpen(true);
    };

    const handleBaixarDocumentos = (conselho: any) => {
        setConselhoSelecionado(conselho);
        setBaixarModalOpen(true);
    };

    function ListaTurmas() {
        if (isLoading) {
            return (
                <div className="text-center col-span-full py-8 text-gray-500">Carregando turmas...</div>
            );
        }

        if (!filteredTurmas.length)
            return (
                <div className="text-center col-span-full py-8 text-gray-500">
                    Nenhuma turma encontrada com o filtro atual.
                </div>
            );

        return filteredTurmas.map((turma) => {
            if (typeof turma.id !== 'number' || turma.id <= 0) return null;

            return (
                <MedModal
                    key={turma.id}
                    courseCode={turma.nome}
                    courseName={turma.curso}
                    onClick={() => handleOpenModal(turma)}
                >
                    <b>Último conselho:</b> {ultimoConselhoMap[turma.id] || "Não realizado"}
                </MedModal>
            );
        });
    }

    return (
        <ProtectedRoute>
            <main className="w-full flex flex-col">
                <div className="flex flex-row flex-auto">
                    <section className="w-full max-h-full md:w-3/5 xl:w-3/4 h-full flex flex-col items-start p-4 pt-24 gap-y-4">
                        <div className="ml-6 w-[calc(100%-3rem)] desktop:w-[35.8%] laptop:w-[47.5%]">
                            <SearchBar
                                texto="Todos os Conselhos"
                                className="w-full"
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                filter
                                filtrosMostrar={{ usuario: false, turma: true, conselho: true }}
                                onSelect={handleAplicarFiltro}
                            />
                        </div>

                        <div
                            className={`mt-6 w-full desktop:w-[75%] grid gap-4 px-6 ${sideModalOpen && screenWidth <= 1366
                                ? "tablet:grid-cols-1 tablet:w-[50%] laptop:grid-cols-2 laptop:w-[49%]"
                                : "tablet:grid-cols-2 laptop:grid-cols-4"
                                }`}
                        >
                            <ListaTurmas />
                        </div>

                        {!isLoading && allTurmas.length > 0 && (
                            <Paginacao
                                paginaAtual={paginaAtual}
                                setPaginaAtual={setPaginaAtual}
                                totalPages={totalPages}
                            />
                        )}
                    </section>

                    <div ref={modalRef}>
                        <ListaConselhos
                            key={selectedTurma?.id}
                            turma={selectedTurma}
                            estaAberto={sideModalOpen}
                            aoFechar={() => setSideModalOpen(false)}
                            role={user?.role ?? ""}
                            onBaixarDocumentos={handleBaixarDocumentos}
                        />

                        <BaixarDocumentosModal
                            open={baixarModalOpen}
                            onClose={() => setBaixarModalOpen(false)}
                            conselho={conselhoSelecionado}
                            role={user?.role}
                        />
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}