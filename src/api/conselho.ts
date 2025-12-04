import api from "@/utils/axios";
import { AxiosError } from "axios";

const controller = new AbortController();

export interface Conselho {
    id?: number;
    idTurma: number;
    nomeTurma?: string;
    idRepresentante1: number;
    nomeRepresentante1?: string;
    idRepresentante2: number;
    nomeRepresentante2?: string;
    idPedagogico: number;
    nomePedagogico?: string;
    dataInicio: string;
    dataFim: string;
    etapas?: string;
}

// utilizar quando for criar um pré-conselho
export const criarConselho = async (payload: {
    idTurma: number;
    idRepresentante1: number;
    idRepresentante2: number;
    idPedagogico: number;
}) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/conselhos/criar`, payload, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// utilizar para quando atualizar etapa do conselho
export const atualizarEtapa = async (idConselho: number, novaEtapa: string) => {
    const controller = new AbortController();

    try {
        console.log("Atualizando etapa:", { idConselho, novaEtapa });

        const response = await api.patch(`/conselhos/atualizar/${idConselho}/etapa`, { novaEtapa }, { signal: controller.signal })
        console.log('deu certo?')
        console.log(response)
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// quando o pedagogico estiver preenchendo o conselho
export const conselhoTurma = async (feedbackTurma: {
    idConselho: number;
    idPedagogico: number;
    pontosPositivos: string;
    pontosMelhoria: string;
    sugestoes: string;
}) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/conselhosTurmasFeedback/criar`, feedbackTurma, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log("Status HTTP: " + err.response?.status);
            console.log("dados do back-end: " + err.response?.data);
        }
    }
}

export const conselhoAluno = async (feedbackAluno: {
    idConselho: number;
    idPedagogico: number;
    idAluno: number;
    pontosPositivos: string;
    pontosMelhoria: string;
    sugestoes: string;
}) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/conselhoAlunosFeedbacks/criar`, feedbackAluno, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}