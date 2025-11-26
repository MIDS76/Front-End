import api from "@/utils/axios";
import { AxiosError } from "axios";
import { Usuario } from "@/utils/types"; 

export interface TurmaAlunosResponse {
    nomeTurma: string;
    statusTurma: boolean;
    alunos: Usuario[];
}

export const buscarAlunosPorTurma = async (idTurma: number): Promise<Usuario[]> => {
    const controller = new AbortController();

    try {
        const url = `/aluno-turma/listarAlunosPorTurma/${idTurma}`; 

        const response = await api.get<TurmaAlunosResponse[]>(url, { signal: controller.signal });
        
        const dataWrapper = response.data?.[0]; 
        
        if (dataWrapper && Array.isArray(dataWrapper.alunos)) {
            return dataWrapper.alunos;
        }
        
        return []; 
        
    } catch (err) {
        if (err instanceof AxiosError) {
            console.error(err.response?.status);
            console.error(err.response?.data);
        }
        return [];
    }
}