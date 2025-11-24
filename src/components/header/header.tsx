"use client";

import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import Logo from "../../../public/logo";
import { cn } from "@/lib/utils";
import ButtonTT from "../button/ButtonTT";
import HeaderButtons from "./HeaderButtons";
import { verifySession } from "@/app/actions/session";
import { useEffect, useState } from "react";
import { Role } from "@/utils/types";

interface HeaderProps {
  login?: boolean;
  className?: string;
}

export default function Header({ login = false, className }: HeaderProps) {
  const [userRole, setUserRole] = useState<Role>("aluno"); 

  useEffect(() => {
    const fetchSession = async () => {
      const user = await verifySession();
      const role = user?.role?.toLowerCase() as Role || "aluno";
      setUserRole(role);
    };

    fetchSession();
  }, []);

  if (userRole === null) {
    return <div>Carregando...</div>;
  }

  const header = !login ? "border-b bg-card" : "";
  
  return (
    <header className={cn(
<<<<<<< HEAD
      "fixed top-0 left-0 right-0 z-50 flex h-20 py-4 w-full shrink-0 items-center px-4 md:px-8 justify-between", //header fica fixo no topo da página
      header,
      className
    )}

    >
      <Link href={`/${userRole}`} className="mr-6 flex items-center gap-2 sm:gap-4" prefetch>
=======
      "fixed top-0 left-0 right-0 z-50 flex h-20 py-4 w-full shrink-0 items-center px-4 laptop:px-8 justify-between", //header fica fixo no topo da página
     header, 
     className
     )}

     >
      <Link href={`/${userRole}`} className="mr-6 flex items-center gap-2 tablet:gap-4" prefetch>
>>>>>>> origin/develop
        <Logo size={48} fill="fill-accent-foreground" />
        <h1 className="hidden tablet:block tablet:text-3xl text-accent-foreground font-title font-bold">
          Portal do Conselho
        </h1>
      </Link>

      {!login && (
        <>
          {/* Mobile Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="laptop:hidden">
                <ButtonTT mode="small" tooltip="Menu" icon="Menu" variant="ghost" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-fit px-8 pt-12">
              <SheetTitle className="sr-only">Sidebar</SheetTitle>
              <HeaderButtons role={userRole} sidebar />
            </SheetContent>
          </Sheet>

          {/* Desktop Buttons */}
          <div className="hidden laptop:flex">
            <HeaderButtons role={userRole} />
          </div>
        </>
      )}
    </header>
  );
}
