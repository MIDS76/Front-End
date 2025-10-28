"use client";

import { useState } from "react";
import TextField from "@/components/input/textField";
import ButtonTT from "@/components/button/ButtonTT";

interface PasswordProps {
  onClose: () => void;
}

export default function PasswordResetModal({ onClose }: PasswordProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    await new Promise(resolve => setTimeout(resolve, 2000));
    setMessage("Um link de recuperação será enviado no seu email.");
    setIsLoading(false);

    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
<div className="bg-white px-8 py-12  rounded-xl shadow-2xl  max-w-md relative mt-20 " >


      
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

    
        <h2 className="text-2xl font-bold text-left mb-4">Esqueceu sua senha?</h2>


        <p className="text-left text-gray-600 mb-6 text-sm">
          Insira o endereço de e-mail que você usa no Portal do Conselho. 
          Enviaremos um link por e-mail para redefinir sua senha.
        </p>

  
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            name="email"
            label="E-mail"
            placeholder="Insira o email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message && <p className="text-sm text-center text-green-600">{message}</p>}

          <ButtonTT mode="default" type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Redefinir senha"}
          </ButtonTT>
        </form>
      </div>
    </div>
  );
}