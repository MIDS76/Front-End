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
    ultimoConselho?: number;
}

// utilizar quando for criar um pré-conselho
export const criarConselho = async (conselho: Conselho) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/conselhos/criar`, conselho, { signal: controller.signal });
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
            console.log(err.response?.status);
            console.log(err.response?.data);
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

export const listarConselhosPorTurma = async (idTurma: number) => {
    try {
        const response = await api.get<Conselho[]>(`/conselhos/listarConselhorPorTurma/${idTurma}`, { signal: controller.signal });

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}

export const atualizarEtapa = async (idConselho: number, novaEtapa: string) => {
    const controller = new AbortController();

    try {
        const response = await api.patch(`/conselhos/atualizar/${idConselho}/etapa`, { novaEtapa: novaEtapa}, { signal: controller.signal });
        console.log(response.data);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const buscarUltimoConselhoPorTurma = async (idTurma: number) => {
    try {
        const response = await api.get<Conselho>(`/conselhos/buscarConselhoPorTurma/${idTurma}`, { signal: controller.signal });

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}