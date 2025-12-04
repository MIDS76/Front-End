import api from "@/utils/axios";
import { AxiosError } from "axios";

// logo que criar o conselho, criar o pré-conselho, recebe o retorno da api e cria o pré-conselho
export const criarPreConselho = async (idConselho: number) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/preConselho/criar`, idConselho, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const preConselhoSupervisao = async (supervisao: {
    idPreConselho: number;
    pontosPositivos: string;
    pontosMelhoria: string;
    sugestoes: string;
}) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/preConselhoSupervisao/criar`, supervisao, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// utilizar para criar quando criar uc/professor na criação do conselho
export const preConselhoProfessor = async (professor: {
    idPreConselho: number;
    idUnidadeCurricular: number;
    idProfessor: number;
    pontosPositivos: string;
    pontosMelhoria: string;
    sugestoes: string;
}) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/preConselhoProfessor/criar`, professor, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const preConselhoPedagogico = async (pedagogico: {
    idPreConselho: number;
    pontosPositivos: string;
    pontosMelhoria: string;
    sugestoes: string;
}) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/preConselhoPedagogico/criar`, pedagogico, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const preConselhoAmbienteEnsino = async (ambienteEnsino: {
    idPreConselho: number;
    pontosPositivos: string;
    pontosMelhoria: string;
    sugestoes: string;
}) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/preConselhoAmbienteEnsino/criar`, ambienteEnsino, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// criar unidade curricular
export const criarUnidadeCurricular = async (nome: string) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/unidadeCurricular/criar`, {nome}, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// criar lista de unidade curricular
export const criarUnidadeCurricularLista = async (lista: any[]) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/unidadeCurricular/criarLista`, lista , { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// listar na hora de criar um conselho
export const listarUnidadeCurricular = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/unidadeCurricular/listar`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

// listar na hora de criar um conselho
export const listarProfessores = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/professor/listar`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}