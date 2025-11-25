"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TextField from "@/components/input/textField";
import ButtonTT from "@/components/button/ButtonTT";
import SenhaSucess from "@/components/modal/senhaAlteradaSucesso";
import { validatePassword, validatePasswordMatch } from "@/utils/formValidation";
import { set } from "date-fns";
import { apiAtualizarSenha } from "@/api/atualizarSenha";
import Cookies from "js-cookie";

export default function ResetPassword() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();

  const handleInputChange = () => {
    if (error) setError("");
  };

  const handleResetPassword = async (data: FormData) => {
    setError("");
    setIsLoading(true);

    const newPassword = data.get("newPassword") as string;
    const confirmPass = data.get("confirmPassword") as string;

    let validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    validationError = validatePasswordMatch(newPassword, confirmPass);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    const userId = Cookies.get("session") ? JSON.parse(Cookies.get("session")!).id : "";
    console.log(Cookies.get('session'));  // Verifique o conteúdo do cookie


    if (!userId) {
        setError("Usuário não autenticado.");
        setIsLoading(false);
        return;
    }

    try{

      await apiAtualizarSenha(userId, newPassword);

      setIsLoading(false);
      setShowSuccessModal(true);
    }catch(error){
      setError("Erro ao atualizar a senha. Tente novamente!")
      setIsLoading(false)
  }
   
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

        <div className="relative z-10 h-full flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md ring-4 ring-black ring-opacity-10">
            <div className="text-left mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Alterar Senha
              </h1>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                handleResetPassword(data);
              }}
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
                error={error}
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
                error={error}
              />

              <ButtonTT
                mode="default"
                type="submit"
                disabled={isLoading}
                tooltip="Clique para salvar sua nova senha"
              >
                {isLoading ? "Salvando..." : "Salvar Senha"}
              </ButtonTT>
            </form>
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
