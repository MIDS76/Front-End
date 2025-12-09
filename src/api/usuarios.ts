import api from "@/utils/axios";
import { Usuario } from "@/utils/types";
import axios, { AxiosError } from "axios";

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
        const response = await axios.post(`http://localhost:8081/api/auth/cadastrar/${data.role}`, {
            nome: data.nome,
            email: data.email
        },
            { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.error("Erro Axios:", err.response?.status, err.response?.data);
        } else {
            console.error("Erro genérico:", err);
        }
        
        throw err; 
    }
}

export const editarUsuario = async (usuario: Usuario) => {
    const userId = usuario.id; 
    
    const bodyEnvio = {
        nome: usuario.nome,
        email: usuario.email,
        ativo: usuario.ativo 
    };
    

    const controller = new AbortController();

    try {
        const response = await api.put(`/usuario/atualizar/${userId}`, bodyEnvio, { signal: controller.signal });
        
        return response.data;

    } catch (err) {
        throw err; 
    }
}