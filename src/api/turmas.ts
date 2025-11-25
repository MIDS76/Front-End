import api from "@/utils/axios";
import { Turma, Usuario } from "@/utils/types";
import { AxiosError } from "axios";

const controller = new AbortController();

export interface Aluno {
    id?: number;
    matricula: string;
    nome: string;
    email: string;
}

export const buscarTurmas = async () => {

    try {
        const response = await api.get<Turma[]>("/turmas/listar", { signal: controller.signal });

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}

export const criarTurma = async (data: Turma) => {
    try {
        const response = await api.post(`/turmas/criar`, data, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const excluirTurma = async (idTurma: number) => {
    try {
        const response = await api.delete(`/turmas/deletar/${idTurma}`, { signal: controller.signal });
        if (response.status === 200) {
            console.log("Turma excluída com sucesso.");
          } else {
            console.log("Erro ao excluir turma.");
          }
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// tela de criar turma
export const criarAlunos = async (listaAlunos: Aluno[]) => {
    try {
        const response = await api.post(`/auth/cadastrar/listaAlunos`, listaAlunos, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// associando os aluno a turma - tela criar turma
export const associarAlunosTurma = async (alunoTurma: {
    idTurma: number;
    idsAlunos: number[];
}) => {
    try {
        const response = await api.post(`/aluno-turma/criar`, alunoTurma, { signal: controller.signal });
        return response.data;

    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// tela gerenciar turma - buscar alunos da turma
export const buscarAlunosTurma = async (idTurma: number) => {

    try {
        const response = await api.get<Usuario[]>(`/aluno-turma/listarAlunosPorTurma/${idTurma}`, { signal: controller.signal });

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}

// gerenciamento turma
export const atualizarTurma = async (turma: Turma) => {
    try {
        const response = await api.put(`/turmas/atualizar/${turma.id}`, turma, { signal: controller.signal });
        return response.data;

    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}
