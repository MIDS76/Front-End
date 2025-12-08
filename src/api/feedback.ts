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

export interface FeedbackConsolidadoAPI {
    idFeedbackAluno: number;
    idConselho: number;
    nomePedagogico: string;
    nomeAluno: string;
    pontosPositivosAluno: string;
    pontosMelhoriaAluno: string;
    sugestaoAluno: string;
    idFeedBackTurma: number;
    pontosPositivosTurma: string;
    pontosMelhoriaTurma: string;
    sugestaoTurma: string;
}

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


export async function buscarFeedbackConsolidado(
    idConselho: number, 
    idAluno: number
): Promise<FeedbackConsolidadoAPI | null> {
    
    const controller = new AbortController(); 
    
    try {
        const url = `/conselhoAlunosFeedbacks/buscarFeedbackAlunoPorConselho/${idConselho}/${idAluno}`; 
        
        const response = await api.get<FeedbackConsolidadoAPI>(url, { signal: controller.signal }); 

        return response.data;
        
    } catch (error) {
        if (error instanceof AxiosError) {
            
            const status = error.response?.status;
            const message = error.response?.data?.message || `Falha desconhecida na API. Status: ${status || 'Sem Status'}`;
            
            if (status === 404) {
                console.warn(`Feedback para o Conselho ${idConselho} e Aluno ${idAluno} não encontrado (Status 404).`);
                return null;
            }
            
            console.error(`Erro API ${status} ao buscar feedback consolidado:`, message);
            throw new Error(message); 
            
        } else {
            const errorMessage = "Erro de comunicação desconhecido ou erro de rede.";
            console.error("Erro desconhecido na comunicação ao buscar feedback consolidado:", error);
            throw new Error(errorMessage);
        }
    }
}