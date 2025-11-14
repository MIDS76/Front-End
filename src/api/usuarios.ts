import api from "@/utils/axios";
import { Usuario } from "@/utils/types";
import { AxiosError } from "axios";

export const buscar = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get<Usuario>("/aluno", { signal: controller.signal });

        return response.data;
        
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}