"use client";

import "./globals.css";

import Header from "@/components/header/header";
import { Toaster } from "sonner";
import { Tema } from "@/components/tema/tema";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  useEffect(() => {}, [pathname]);

  useEffect(() => {
    document.title = "Portal do Conselho";
  }, []);

  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className="antialiased h-screen">
        <Tema attribute="class">
          {" "}
          <AuthProvider>
            {pathname !== "/login" && pathname !== "/alterarSenha" && <Header />}

              {children}
              <Toaster richColors />
          </AuthProvider>
        </Tema>
      </body>
    </html>
  );
}
