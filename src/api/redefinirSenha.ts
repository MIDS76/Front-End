import axios from "axios";


const API_URL = "http://127.0.0.1:8081/api/redefinirSenha";


export const solicitarRedefinicaoSenha = async (email: string) => {
    return axios.post(`${API_URL}/solicitar`, { email });
};


export const confirmarNovaSenha = async (email: string, novaSenha: string) => {
    return axios.post(`${API_URL}/confirmar`, {
        email: email,
        novaSenha: novaSenha
    });
};
