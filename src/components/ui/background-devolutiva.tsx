"use client";

import React, { ReactNode } from "react";

interface SidebarProps {
  children?: ReactNode;
  className?: string; 
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = "" }) => {
  return (
    <section
      className={`h-[calc(100vh-0rem)] pointer-events-none md:pointer-events-auto bottom-0 right-0 absolute md:static w-3/4 md:w-2/5 xl:w-1/4 md:flex flex-col items-center justify-center md:bg-accent bg-none ${className}`}
      >
      <p className="hidden md:block md:absolute bottom-1/2 text-muted-foreground">Selecione um conselho para acesso</p>
    
    
      {children}
    </section>
  );
};

export default Sidebar;
