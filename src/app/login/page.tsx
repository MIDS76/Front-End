"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import TextField from "@/components/input/textField";
import Form from "next/form";
import ButtonTT from "@/components/button/ButtonTT";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PasswordResetModal from "@/components/modal/enviarVerificacao";

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: FormData) => {
    setError(false);
    setErrorMessage("");

    const email = data.get("login") as string;
    const password = data.get("password") as string;

    if (!email || !password) {
      setError(true);
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    const success = await login(email, password);

    if (success) {
      router.push("/"); 
    } else {
      setError(true);
      setErrorMessage("Login ou senha incorretos.");
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Image
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
        src={"/loginbg.jpg"}
        alt="Imagem de fundo de uma sala de reunião"
      />

      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="font-title text-3xl font-bold text-gray-800">
              Portal do Conselho
            </h1>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Bem - Vindo</h2>
              <p className="text-muted-foreground text-sm">
                A sua Plataforma Completa para Atividades Profissionais
              </p>
            </div>

            <Form action={handleLogin} className="flex flex-col gap-4 w-full">
              <TextField
                name="login"
                id="login"
                type="text"
                placeholder="Insira seu e-mail institucional"
                className={`w-full rounded-md px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary ${
                  error ? "border-destructive" : ""
                } bg-gray-100`}
              />
            </div>

   
            <div className="flex flex-col gap-1">
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
              />
              {error && (
                <p className="text-destructive text-sm text-center">
                  {errorMessage}
                </p>
              )}

              <ButtonTT mode="default" tooltip="Fazer login" type="submit">
                Login
              </ButtonTT>
            </Form>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-primary hover:underline text-left mt-1 mb-6"
              >
                Esqueceu sua senha?
              </button>
            </div>


            {error && (
              <p className="text-destructive text-sm text-center">
                {errorMessage}
              </p>
            )}

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
