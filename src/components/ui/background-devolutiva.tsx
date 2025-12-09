// Componente: BackgroundDevolutiva.tsx (ou o nome que você estiver usando para o wrapper)
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BackgroundDevolutivaProps {
  children?: ReactNode;
  isOpen: boolean; // 👈 Adicione a prop isOpen
}

const BackgroundDevolutiva: React.FC<BackgroundDevolutivaProps> = ({ children, isOpen }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none" // 👈 Controla o overlay
      )}
    >
      {/* O painel DevoutivaAluno (a sidebar que desliza) deve estar aqui dentro */}
      {children}
    </div>
  );
};

export default BackgroundDevolutiva;