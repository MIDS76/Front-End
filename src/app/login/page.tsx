"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import TextField from "@/components/input/textField";
import Form from "next/form";
import ButtonTT from "@/components/button/ButtonTT";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PasswordResetModal from "@/components/modal/enviarVerificacao";
import { showError, validateEmail, validateRequired } from "@/utils/formValidation";

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: FormData) => {
    setErrors({});

    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const newErrors: { [key: string]: string } = {};

    newErrors.senha = validateRequired(password, "Senha");
    newErrors.email = validateEmail(email);

    if (newErrors.senha || newErrors.email) {
      setErrors(newErrors);
      showError();
      return;
    }

    const loggedUser = await login(email, password);

    if (loggedUser) {
      router.push(`/${loggedUser.perfil}`);
    } else {
      newErrors.final = "E-mail ou senha incorretos.";
      setErrors(newErrors);
      return;
    }
  };

  return (
    <main className="min-h-screen w-full grid grid-cols-2">
      <div className="relative flex items-center justify-start">
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          src="/loginbg.jpg"
          alt="Imagem de fundo de uma sala de reunião"
        />

        <div className="absolute inset-0 bg-sky-950/45"></div>

        <div className="relative z-10 p-16 text-white flex flex-row items-center">
          <Image
            src="/favicon.ico" 
            alt="Logo do Conselho"
            width={70} 
            height={70} 
            className="mr-4"
          />
          <h2 className="text-5xl font-semibold">
            Portal do Conselho
          </h2>
        </div>
      </div>

      <div className="bg-white p-12 shadow-xl flex flex-col justify-center w-full ">
        <div className="mx-auto w-full">
          <div className="text-left mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Bem-Vindo
            </h1>
            <p className="text-sm text-gray-700">
              A sua Plataforma Completa para Atividades Profissionais
            </p>
          </div>

          <Form action={handleLogin} className="flex flex-wrap gap-6 w-full mx-auto"> 
            <div className="flex flex-col gap-1 w-full">
              <span className="text-sm font-semibold text-gray-800">Login</span> 
              <TextField
                id="email"
                name="email"
                placeholder="Insira seu e-mail institucional"
                type="text"
                error={errors.email}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <span className="text-sm font-semibold text-gray-800">Senha</span>
              <TextField
                id="password"
                name="password"
                placeholder="Insira sua senha"
                type="password"
                error={errors.senha}
              />

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-blue-600 hover:underline text-left mt-2" 
              >
                Esqueceu sua senha?
              </button>
              
              {errors.final && (
                <p className="text-destructive text-red-500 text-sm mt-2">
                  {errors.final}
                </p>
              )}
            </div>

            <ButtonTT 
                mode="default" 
                tooltip="Fazer login" 
                type="submit" 
                className="mt-6 bg-sky-950 hover:bg-sky-800 text-white py-2 px-4 rounded-lg mx-auto tablet:w-60 laptop:w-72 desktop:w-88" // Estilo do botão ajustado
            >
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