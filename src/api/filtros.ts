import api from "@/utils/axios";
import { AxiosError } from "axios";


export const ordenarOrdemAlfabeticaTurma = async (ordem: string) => {
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

export const listarCursos = async () => {
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

export const listarAnosEntrada = async () => {
    const controller = new AbortController();
  
    try {
      const response = await api.get(`/turmas/listarAnosDeEntrada`, { signal: controller.signal });
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.response?.status);
        console.error(err.response?.data);
      }
      return [];
    }
  }

export const filtrarPorCurso = async (curso: string) => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/turmas/filtrarPorCurso?curso=${curso}`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarPorAnoEntrada = async (anoEntrada: string) => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/turmas/filtrarPorAnoEntrada?anoEntrada=${anoEntrada}`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarConselhoEtapa = async (etapa: string) => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/conselhos/filtrarPorEtapas?etapa=${etapa}`, { signal: controller.signal });
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarAlunoOrdemAlfabetica = async (ordem: string) => {
    const controller = new AbortController();

    try {
        const response = await api.get(`/usuario/ordemAlfabetica?ordem=${ordem}`, { signal: controller.signal });
        console.log(response.data);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}

export const filtrarPorAtividade = async (atividade : string) => {
    const controller = new AbortController();
    let ativo;
    
    if(atividade === "Ativo"){
        ativo = true;
    }else if(atividade === "Inativo"){
        ativo = false;
    }

    try {
        const response = await api.get(`/usuario/buscarAtividade?ativo=${ativo}`, { signal: controller.signal });
        return response.data;
        
        
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
            console.log(err.response?.data);
        }
    }
}
