"use client";

import Image from "next/image";
import Header from "@/components/header/header";
import TextField from "@/components/input/textField";
import Form from "next/form";
import ButtonTT from "@/components/button/ButtonTT";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();
  const handleLogin = async (data: FormData) => {
    setError(false);
    setErrorMessage("");

    const login = {
      email: data.get("email") as string,
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
        open("/", "_self");
      }, 1000);
      return;
    }

    setError(true);
    setErrorMessage("E-mail ou senha incorretos.");

    // try {
    //   const res = await api.post("http://localhost:8099/auth/login", login);

    //   if (res.status === 200 && res.data.token) {
    //     open("/", "_self");
    //   }
    // } catch (err) {
    //   setError(true);
    //   setErrorMessage("E-mail ou senha incorretos.");
    // }
  };

  return (
    <main className="h-screen flex flex-row-reverse">
      <section className="md:w-1/2 xl:w-2/3 bg-secondary dark:bg-accent">
        <Image
          className="h-screen hidden md:block object-cover opacity-60"
          width={1920}
          height={1080}
          src={"/loginbg.jpg"}
          alt="Imagem de fundo representando um conselho de classe"
        ></Image>
      </section>
      <section className="w-full md:w-1/2 xl:w-1/3 flex flex-col items-center h-screen">
        <Header login className="mt-4" />
        <div className="flex flex-col items-center justify-center h-screen p-8">
          <div className="mb-11 select-none">
            <h1 className="font-title text-4xl font-bold">Bem vindo</h1>
            <p className="text-muted-foreground">
              ao seu espaço para realização de conselhos de classe.
            </p>
          </div>
          <Form
            action={handleLogin}
            className="flex flex-col gap-4 w-full mb-16"
          >
            <TextField
              name="email"
              label="E-mail institucional"
              placeholder="Insira seu e-mail"
              type="text"
              id="email"
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
              <p className="saturate-150 mt-[-44px] self-start text-destructive text-sm mb-4 rounded-lg">
                {errorMessage}
              </p>
            )}
            <ButtonTT mode="default" tooltip="Fazer login" type="submit">
              Fazer login
            </ButtonTT>
          </Form>
        </div>
      </section>
    </main>
  );
}
