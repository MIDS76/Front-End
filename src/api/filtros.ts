import api from "@/utils/axios";
import { AxiosError } from "axios";


export const ordenarOrdemAlfabeticaTurma = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/turmas/ordemAlfabetica`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const listarCursos = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/turmas/listarCursos`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarPorCurso = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/turmas/filtrarPorCurso`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarPorAnoEntrada = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/turmas/filtrarPorAnoEntrada`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarConselhoEtapa = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/conselhos/filtrarPorEtapas`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarAlunoOrdemAlfabetica = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/aluno/ordemAlfabetica`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarPorAtividade = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/aluno/buscarAtividade`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}