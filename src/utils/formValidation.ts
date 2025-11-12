import { toast } from "sonner";

export const validateRequired = (value: string, fieldName: string): string => {
    if (!value.trim()) return `O ${fieldName} é obrigatório.`;
    return "";
}

export const validateEmail = (email: string): string => {
    if (!email || !email.trim()) return "O e-mail é obrigatório.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "E-mail inválido.";
    return "";
}

export const validatePassword = (password: string): string => {
    const requirements = [
        { regex: /[a-z]/, message: "letra minúscula" },
        { regex: /[A-Z]/, message: "letra maiúscula" },
        { regex: /[0-9]/, message: "número" },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "caractere especial" },
    ];

    const missing = requirements
        .filter((req) => !req.regex.test(password))
        .map((req) => req.message);

    if (missing.length > 0) {
        return `A senha deve conter: ${missing.join(", ")}.`;
    }

    if (password.length < 8) {
        return "A senha deve ter no mínimo 8 caracteres.";
    }
    return "";
}

export const validatePasswordMatch = (password: string, confirmPassword: string): string => {
    if (password !== confirmPassword) return "As senhas não coincidem.";
    return "";
};

export const validateDate = (value: string): string => {
    if (!value) {
        return "A data é obrigatória.";
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) {
        return "Data inválida. O formato correto é YYYY-MM-DD.";
    }

    const date = new Date(value);
    const isValid = date instanceof Date && !isNaN(date.getTime());

    if (!isValid) {
        return "Data inválida.";
    }

    return "";
};

export const showError = () => {
    return toast.error("Preencha todos os campos corretamente!");
}