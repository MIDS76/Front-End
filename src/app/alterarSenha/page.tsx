"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@/components/input/textField";
import Form from "next/form";
import ButtonTT from "@/components/button/ButtonTT";

export default function ResetPassword() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleInputChange = () => {
    if (error) setError("");
  };

  const handleResetPassword = async (data: FormData) => {
    setError("");
    setIsLoading(true);

    const newPassword = data.get("newPassword") as string;
    const confirmPass = data.get("confirmPassword") as string;

    // Verifica cada requisito separadamente
    const requirements = [
      { regex: /[a-z]/, message: "letra minúscula" },
      { regex: /[A-Z]/, message: "letra maiúscula" },
      { regex: /[0-9]/, message: "número" },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "caractere especial" },
    ];

    const missing = requirements
      .filter((req) => !req.regex.test(newPassword))
      .map((req) => req.message);

    if (missing.length > 0) {
      setError(
        `A senha deve conter: ${missing.join(", ")}.`
      );
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPass) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Senha alterada com sucesso!");
    setIsLoading(false);
    router.push("/login");
  };

  return (
    <main className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="mb-11 select-none text-center">
          <h1 className="font-title text-4xl font-bold">Alterar Senha</h1>
          <p className="text-muted-foreground">
            Insira sua nova senha abaixo.
          </p>
        </div>

        <Form
          action={handleResetPassword}
          className="flex flex-col gap-4 w-full"
        >
          <TextField
            id="newPassword"
            name="newPassword"
            label="Inserir nova senha"
            placeholder="Digite a nova senha"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleInputChange();
            }}
            required
          />

          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar senha"
            placeholder="Confirme a nova senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              handleInputChange();
            }}
            required
          />

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <ButtonTT
            mode="default"
            type="submit"
            disabled={isLoading}
            tooltip="Clique para salvar sua nova senha"
          >
            {isLoading ? "Salvando..." : "Salvar Senha"}
          </ButtonTT>
        </Form>
      </div>
    </main>
  );
}
