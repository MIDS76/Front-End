import axios, { AxiosError } from "axios";

export const apiLogin = async (username: string, password: string) => {
    const controller = new AbortController();

    console.log("Iniciando requisição de login...");

    try {
        const response = await axios.post("http://localhost:8081/api/auth/login", {
            email: username,
            senha: password
        }, { signal: controller.signal });
        
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
}