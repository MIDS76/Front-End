import api from "@/utils/axios";
import { AxiosError } from "axios";

export const login = async (username: string, password: string) => {
    const controller = new AbortController();

    try {
        const response = await api.post("/auth/login", { username, password }, { signal: controller.signal });

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log(err.response?.status);
        }
    }
}

