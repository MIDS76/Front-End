"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TextField from "@/components/input/textField";
import Form from "next/form";
import ButtonTT from "@/components/button/ButtonTT";
import SenhaSucess from "@/components/modal/senhaAlteradaSucesso";



export default function ResetPassword() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // state do modal

  const router = useRouter();

  const handleInputChange = () => {
    if (error) setError("");
  };

  const handleResetPassword = async (data: FormData) => {
    setError("");
    setIsLoading(true);

    const newPassword = data.get("newPassword") as string;
    const confirmPass = data.get("confirmPassword") as string;

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
      setError(`A senha deve conter: ${missing.join(", ")}.`);
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

    setIsLoading(false);
    setShowSuccessModal(true); 
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/login"); 
  };

  return (
    <>
      <main className="relative h-screen w-full overflow-hidden">
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          src="/loginbg.jpg"
          alt="Imagem de fundo de uma sala de reunião"
        />
        <div className="absolute inset-0 bg-sky-950/45"></div>
        <div className="absolute inset-0 bg-opacity-50 z-0"></div>
        <div className="relative z-10 h-full flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md ring-4 ring-black ring-opacity-10">
            <div className="text-left mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Alterar Senha</h1>
            </div>

            <Form
              action={handleResetPassword}
              className="flex flex-col gap-4 w-full"
            >
              <TextField
                id="newPassword"
                name="newPassword"
                label="Nova senha"
                placeholder="Digite a nova senha"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleInputChange();
                }}
                required
                className={error ? "border-red-500" : ""}
              />

              <TextField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar nova senha"
                placeholder="Confirme a nova senha"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  handleInputChange();
                }}
                required
                className={error ? "border-red-500" : ""}
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
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
        </div>
      </main>

     
      <SenhaSucess
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
    </>
  );
}
