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

export interface Turma {
    id: number;
    nome: string;
    curso: string;
    dataInicio: string;
    dataFinal: string;
    idUltimoConselho: number;
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

export const buscarConselho = async (id: number) => {
    try {
        const response = await api.get<Conselho>(`/conselhos/buscar/${id}`, { signal: controller.signal });

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

export const atualizarConselho = async (idConselho: number, conselho: Conselho) => {
    const controller = new AbortController();

    try {
        const response = await api.put(`/conselhos/atualizar/${idConselho}`, conselho, { signal: controller.signal });
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
    const controller = new AbortController();
    
    try {
        const response = await api.get(`/conselhos/buscarConselhoPorTurma/${idTurma}`, { signal: controller.signal });

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}

export async function buscarTurmaPorConselho(idConselho: number): Promise<Turma | undefined> {
    const controller = new AbortController();
    
    try {
        const url = `/turmas/buscarTurmaPorConselho/${idConselho}`; 
        
        const response = await api.get<Turma>(url, { signal: controller.signal }); 

        return response.data;
        
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                console.warn(`Turma para o Conselho ${idConselho} não encontrada (Status 404).`);
                return undefined;
            }
            console.error(`Erro API ${error.response?.status} ao buscar turma por conselho:`, error.message);
        } else {
            console.error("Erro desconhecido na comunicação ao buscar turma por conselho:", error);
        }
        return undefined;
    }
}