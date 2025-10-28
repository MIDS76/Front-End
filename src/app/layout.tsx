"use client";

import "./globals.css";
import Header from "@/components/header/header";
import { Toaster } from "sonner";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { Tema } from "@/components/tema";
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
      <body className={`antialiased h-screen`}>
        <Tema attribute="class">
          {" "}
          <AuthProvider>
            <WebSocketProvider>
              {pathname !== "/login" && <Header userRole={"admin"} />}
              {children}
              <Toaster richColors />
            </WebSocketProvider>
          </AuthProvider>
        </Tema>
      </body>
    </html>
  );
}
