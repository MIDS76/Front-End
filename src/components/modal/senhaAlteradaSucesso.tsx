"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SenhaSucessoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleClick = () => {
    onClose(); 
    router.push("/login"); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center text-center w-15 ">
        <h2 className="text-2xl font-bold mb-4">Senha alterada com <br/>sucesso!</h2>
        <button
          onClick={handleClick}
          className="mt-6 bg-teal-900 hover:bg-teal-900 text-white font-medium py-2 px-4 rounded-lg w-15 h-20"
        >
          Voltar para a página de login
        </button>
      </div>
    </div>
  );
};

export default SenhaSucessoModal;
