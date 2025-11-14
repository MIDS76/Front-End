import api from "@/utils/axios";
import { Turma } from "@/utils/types";
import { AxiosError } from "axios";

export const buscarTurmas = async () => {
    const controller = new AbortController();

    try {
        const response = await api.get<Turma[]>("/turmas/listar", { signal: controller.signal });

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}