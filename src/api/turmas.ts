import api from "@/utils/axios";
import { Turma, Usuario } from "@/utils/types";
import { AxiosError } from "axios";

const controller = new AbortController();

export interface Aluno {
    matricula: string;
    nome: string;
    email: string;
}

// buscar turmas
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

// criar turmas
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
