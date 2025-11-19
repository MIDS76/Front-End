"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import TextField from "@/components/input/textField";
import Form from "next/form";
import ButtonTT from "@/components/button/ButtonTT";
import { useState } from "react";
import PasswordResetModal from "@/components/modal/enviarVerificacao";
import { showError, validateEmail, validateRequired } from "@/utils/formValidation";
import { login } from "../actions/auth";

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleLogin = async (data: FormData) => {
    setErrors({});

    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const newErrors: { [key: string]: string } = {};

    newErrors.senha = validateRequired(password, "senha");
    newErrors.email = validateEmail(email);

    if (newErrors.senha || newErrors.email) {
      setErrors(newErrors);
      showError();
      return;
    }

    const session = await login(email, password);
    console.log("Resposta da API:", session);

    if (session) {
      router.push(`/${(session.role).toLowerCase()}`);
    } else {
      newErrors.final = "E-mail ou senha incorretos.";
      setErrors(newErrors);
      return;
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col">

      <div className="relative flex-1 flex items-center justify-center">
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          src="/loginbg.jpg"
          alt="Imagem de fundo de uma sala de reunião"
        />

        <div className="absolute inset-0 bg-sky-950/45"></div>
        <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="text-left mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Bem-Vindo
            </h1>
            <p className="text-sm text-left mb-6 ">
              A sua Plataforma Completa para Atividades Profissionais
            </p>
          </div>

          <Form action={handleLogin} className="flex flex-col gap-3">

            <div className="flex flex-col gap-1">
              <TextField
                id="email"
                name="email"
                label="E-mail"
                placeholder="Insira seu e-mail institucional"
                type="text"
                error={errors.email}
              />
            </div>


            <div className="flex flex-col gap-1 relative">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-800"
              >
              </label>
              <TextField
                id="password"
                name="password"
                label="Senha"
                placeholder="Insira sua senha"
                type="password"
                error={errors.senha}
              />

              {errors && (
                <p className="text-destructive absolute bottom-8 text-red-500 text-sm mt-0">
                  {errors.final}
                </p>
              )}

              <button //esqueceu a senha
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-primary hover:underline text-left mt-6 mb-2"
              >
                Esqueceu sua senha?
              </button>
            </div>

            <ButtonTT mode="default" tooltip="Fazer login" type="submit">
              Login
            </ButtonTT>
          </Form>
        </div>
      </div>

      {isModalOpen && (
        <PasswordResetModal onClose={() => setIsModalOpen(false)} />
      )}
    </main>
  );
}
