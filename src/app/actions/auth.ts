import { apiLogin } from "@/api/login";
import { toast } from "sonner";
import Cookies from "js-cookie";

export async function login(email: string, password: string) {
    try {
        const session = await apiLogin(email, password);

        if (session && session.token) {
            Cookies.set('session', JSON.stringify(session), {
                expires: 7,
                path: '/',
            });
        } else {
            toast.message("Erro ao fazer login. Tente novamente.");
        }

        return session;
    } catch (error) {
        toast.message("Erro ao fazer login. Tente novamente.")
    }
}

export async function logout() {
    Cookies.remove('session');
    window.location.href = '/login';
}