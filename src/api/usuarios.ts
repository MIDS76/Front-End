import api from "@/utils/axios";
import { Usuario } from "@/utils/types";
import { AxiosError } from "axios";

export const buscarUsuarios = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get<Usuario[]>("/usuario/listar", { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}

export const criarUsuario = async (data: Usuario) => {
    const controller = new AbortController();

    try {
        const response = await api.post(`/auth/cadastrar/${data.role}`, {
            nome: data.nome,
            email: data.email
        },
            { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const editarUsuario = async (data: Usuario) => {
    
}