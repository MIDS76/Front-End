import api from "@/utils/axios";
import { AxiosError } from "axios";

const controller = new AbortController();

// Função para marcar a notificação como lida
export const marcarComoLida = async (notificacaoId: number) => {
    try {
        const response = await api.patch(`/notificacao/lida/${notificacaoId}`, { signal: controller.signal});
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const listarNotificacao = async (usuarioId: number) => {
    try {
        const response = await api.get(`/notificacao/listar/${usuarioId}`, { signal: controller.signal});
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