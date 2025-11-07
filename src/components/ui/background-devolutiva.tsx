"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Supondo que você use uma lib de utilitários como a do shadcn/ui

interface SidebarProps {
  children?: ReactNode;
  className?: string; 
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = "" }) => {
  return (
    <section
      className={cn(
        // Visível em mobile e desktop, mas OCULTA em tablet (md)
        "absolute bottom-0 right-0 w-3/4 sm:static sm:w-2/5 xl:w-1/4 flex flex-col items-center justify-center bg-none sm:bg-accent pointer-events-none sm:pointer-events-auto h-full sm:min-h-[calc(100vh-4rem)]",
        "md:hidden", // 👈 ESTA É A CLASSE QUE A ESCONDE NO TABLET
        "lg:flex", // 👈 E ESTA A MOSTRA NOVAMENTE NO DESKTOP
        className
      )}
    >
      <p className="hidden md:block md:static bottom-1/2 text-muted-foreground">
        Selecione um conselho para acesso
      </p>
      {children}
    </section>
  );
};

export default Sidebar;