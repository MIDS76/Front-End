import api from "@/utils/axios";
import { AxiosError } from "axios";

const controller = new AbortController();

// busca todos os conselhos criados
export const buscarConselho = async () => {
    try {
        const response = await api.get("/conselhos/listar", { signal: controller.signal });

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}

// utilizar quando for criar um pré-conselho
export const criarConselho = async (conselho: {
    idTurma: number;
    dataInicio: string;
    dataFim?: string;
    idRepresentante1: number;
    idRepresentante2: number;
    idPedagogico: number;
}) => {
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
export const conselhoPedagogico = async (feedbackTurma: {
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