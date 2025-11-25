import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export const apiAtualizarSenha = async (userId: String,newPassword: string) => {
    const controller = new AbortController();

    console.log("Iniciando requisição de atualização de senha...");

    const token = Cookies.get("session") ? JSON.parse(Cookies.get("session")!).token : "";

    if (!token) {
        console.log("Erro: Token de autenticação não encontrado.");
        return;
    }

    try {
    
        const response = await axios.patch(
            `http://localhost:8081/api/atualizar/senha/${userId}`, // ID do usuário agora está na URL
            {senha: newPassword }, // A nova senha vai no corpo da requisição
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
                },
                signal: controller.signal, // Usando o controller para abortar a requisição, caso necessário
            }
        );

        // Retorna a resposta do backend
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log("Erro na requisição:", err.response?.status);
            console.log("Mensagem de erro:", err.message);
            console.log("Resposta de erro:", err.response?.data);
        } else {
            console.log("Erro inesperado:", err);
        }
    }
};
