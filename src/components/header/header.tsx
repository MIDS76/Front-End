"use client";

import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import Logo from "../../../public/logo";
import { cn } from "@/lib/utils";
import ButtonTT from "../button/ButtonTT";
import HeaderButtons from "./HeaderButtons";
import { verifySession } from "@/app/actions/session";

interface HeaderProps {
  login?: boolean;
  className?: string;
}

export default function Header({ login = false, className }: HeaderProps) {
  const user  = verifySession(); // pega o usuário logado
  const userRole = (user?.role) || "aluno"; // default para aluno

  const header = !login ? "border-b bg-card" : "";

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 flex h-20 py-4 w-full shrink-0 items-center px-4 md:px-8 justify-between", //header fica fixo no topo da página
     header, 
     className
     )}

     >
      <Link href={`/${userRole}`} className="mr-6 flex items-center gap-2 sm:gap-4" prefetch>
        <Logo size={48} fill="fill-accent-foreground" />
        <h1 className="hidden sm:block sm:text-3xl text-accent-foreground font-title font-bold">
          Portal do Conselho
        </h1>
      </Link>

      {!login && (
        <>
          {/* Mobile Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="md:hidden">
                <ButtonTT mode="small" tooltip="Menu" icon="Menu" variant="ghost" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-fit px-8 pt-12">
              <SheetTitle className="sr-only">Sidebar</SheetTitle>
              <HeaderButtons role={userRole} sidebar />
            </SheetContent>
          </Sheet>

          {/* Desktop Buttons */}
          <div className="hidden md:flex">
            <HeaderButtons role={userRole} />
          </div>
        </>
      )}
    </header>
  );
}
