import api from "@/utils/axios";
import { AxiosError } from "axios";


export const criarFeedbackAluno = async (ordem: string) => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/turmas/ordemAlfabetica?ordem=${ordem}`, { signal: controller.signal });
        console.log(response.data);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const criarFeedbackTurma = async () => {
    const controller = new AbortController();
  
    try {
      const response = await api.get("/turmas/listarCursos", {
        signal: controller.signal,
      });
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.response?.status);
        console.error(err.response?.data);
      }
      return [];
    }
  };