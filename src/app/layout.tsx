"use client";

import "./globals.css";

import Header from "@/components/header/header";
import { Toaster } from "sonner";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { Tema } from "@/components/tema/tema";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
    document.title = "Portal do Conselho";
  }, []);

  if (!mounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased h-screen bg-slate-50 dark:bg-slate-900">
           {}
           <div className="hidden">Carregando...</div>
        </body>
      </html>
    );
  }

  const isPublicPage =
    pathname === "/login" ||
    pathname?.startsWith("/alterarSenha") ||
    pathname?.includes("/alterarSenha");

  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className="antialiased h-screen">
        <Tema attribute="class">
          <AuthProvider>
           
            {isPublicPage ? (
              <>
                {children}
                <Toaster richColors />
              </>
            ) : (
              <WebSocketProvider>
                <Header />
                {children}
                <Toaster richColors />
              </WebSocketProvider>
            )}
            
          </AuthProvider>
        </Tema>
      </body>
    </html>
  );
}
