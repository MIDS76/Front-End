"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // usa o botão padrão do sistema

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Fundo com imagem e overlay */}
      <main className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
          src="/loginbg.jpg"
          alt="Imagem de fundo de uma sala de reunião"
        />
        
     <div className="absolute inset-0 bg-sky-950/45"></div>
        <div className="absolute inset-0 "></div>
      </main>

          {/* Conteúdo do modal */}
          <div className="relative z- bg-white rounded-xl p-12 w-full max-w-sm shadow-lg flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Senha alterada com sucesso!
        </h2>

        <Button
          onClick={handleClick}
          className="w-full max-w-xs text-sm font-semibold"
        >
          Voltar para a página de login
        </Button>
      </div>
    </div>
  );
};

export default SenhaSucessoModal;
