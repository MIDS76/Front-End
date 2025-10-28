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
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (data: FormData) => {
    setError(false);
    setErrorMessage("");

    const login = {
      email: data.get("login") as string,
      password: data.get("password") as string,
    };

    if (!login.email || !login.password) {
      setError(true);
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    if (login.email === "admin" && login.password === "senhasecreta") {
      setError(false);
      auth.login();
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }

    setError(true);
    setErrorMessage("Login ou senha incorretos.");
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Header fixo superior */}
      <header className="w-full bg-white border-b border-blue-200 py-4 px-8 flex items-center justify-start">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg" // troque pelo seu logo
            alt="Logo do Conselho"
            width={32}
            height={32}
          />
          <h1 className="text-lg font-semibold text-gray-800">
            Portal do Conselho
          </h1>
        </div>
      </header>

      {/* Imagem de fundo */}
      <div className="relative flex-1 flex items-center justify-center">
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          src="/loginbg.jpg"
          alt="Imagem de fundo de uma sala de reunião"
        />

        {/* Card central */}
        <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-left mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Bem-Vindo</h1>
            <p className="text-xs text-left mb-6" style={{ color: "#626262" }}>
              A sua Plataforma Completa para Atividades Profissionais
            </p>
          </div>

          <Form action={handleLogin} className="flex flex-col gap-4">
            <TextField
              name="login"
              label="Login"
              placeholder="Insira seu e-mail institucional"
              type="text"
              id="login"
              className={error ? "border-destructive" : ""}
            />
            <TextField
              name="password"
              label="Senha"
              placeholder="Insira sua senha"
              type="password"
              id="password"
              className={error ? "border-destructive" : ""}
            />

            {error && (
              <p className="text-destructive text-sm text-center">
                {errorMessage}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-primary hover:underline"
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
