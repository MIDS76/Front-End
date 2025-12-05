import api from "@/utils/axios";
import { AxiosError } from "axios";

type DadosFeedbackAluno = {
    idConselho: number,
    idAluno: number,
    pontosPositivos: string,
    pontosMelhoria: string,
    sugestao: string,
    idPedagogico: number,
};

type DadosFeedbackTurma = {
    idConselho: number,
    pontosPositivos: string,
    pontosMelhoria: string,
    sugestao: string,
    idPedagogico: number,
};

export const criarFeedbackAluno = async (dados: DadosFeedbackAluno) => {

    if (!dados.idPedagogico) {
        throw new Error("ID do usuário pedagógico (idPedagogico) não foi fornecido.");
    }

    const payload = {
        idConselho: dados.idConselho,
        idPedagogico: dados.idPedagogico,
        idAluno: dados.idAluno,
        pontosPositivos: dados.pontosPositivos,
        pontosMelhoria: dados.pontosMelhoria,
        sugestao: dados.sugestao,
    };

    try {
        const response = await api.post("/conselhoAlunosFeedbacks/criar", payload);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data?.message || `Falha ao criar feedback do aluno. Status: ${err.response?.status}`);
        }
        throw err;
    }
};

export const criarFeedbackTurma = async (dados: DadosFeedbackTurma) => {


    if (!dados.idPedagogico) {
        throw new Error("ID do usuário pedagógico (idPedagogico) não foi fornecido.");
    }

    const payload = {
        idConselho: dados.idConselho,
        idPedagogico: dados.idPedagogico,
        pontosPositivos: dados.pontosPositivos,
        pontosMelhoria: dados.pontosMelhoria,
        sugestao: dados.sugestao,
    };

    try {
        const response = await api.post("/conselhoTurmasFeedback/criar", payload);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data?.message || `Falha ao criar feedback da turma. Status: ${err.response?.status}`);
        }
        throw err;
    }
};