import api from "@/utils/axios";
import { AxiosError } from "axios";

const controller = new AbortController();

// Função para marcar a notificação como lida
export const marcarComoLida = async (id: number) => {
    try {
        const response = await api.patch(`/notificacao/lida/${id}`, null, { signal: controller.signal});
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const listarNotificacao = async (id: number) => {
    try {
        const response = await api.get(`/notificacao/listar/${id}`, { signal: controller.signal});
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const listarNotificacaoNaoLidas = async (id: number) => {
    try {
        const response = await api.get(`/notificacao/listar/${id}/naoLidas`, { signal: controller.signal});
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}