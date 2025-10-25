"use client";

import Header from "@/components/header/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

export default function RepresentantePage() {
  const router = useRouter();

  const representante = {
    turma: "MI76",
    curso: "Desenvolvimento de Sistemas",
    conselhos: [
      {
        id: 1,
        titulo: "Conselho do 1º trimestre",
        data: "10/04/2025",
        status: "feito",
      },
      {
        id: 2,
        titulo: "Conselho do 2º trimestre",
        data: "12/07/2025",
        status: "feito",
      },
      {
        id: 3,
        titulo: "Conselho do 3º trimestre",
        status: "pendente",
      },
    ],
  };

  return (
    <main className="w-full flex flex-col min-h-screen bg-muted/10 font-text">
      <div className="flex flex-row flex-auto">
        <section className="w-full max-h-full md:w-3/5 xl:w-3/4 h-full flex flex-col items-start p-4 pt-16 gap-y-4">
          <h2 className="font-title text-2xl font-bold text-accent-foreground px-4">
            Formulário de Avaliação
          </h2>

          <ScrollArea className="w-full h-[500px] mt-8">
            <ul className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full px-4">
              {representante.conselhos.map((conselho) => (
                <li
                  key={conselho.id}
                  className="bg-secondary text-secondary-foreground rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:bg-secondary/90"
                >
                  <div className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{conselho.titulo}</h3>
                      <p className="text-sm opacity-90">
                        {conselho.data ? `Data: ${conselho.data}` : "Sem data definida"}
                      </p>
                      <p className="text-sm mt-2">
                        Status:{" "}
                        <span
                          className={
                            conselho.status === "feito"
                              ? "text-green-300 font-semibold"
                              : "text-yellow-300 font-semibold"
                          }
                        >
                          {conselho.status === "feito" ? "Feito" : "Pendente"}
                        </span>
                      </p>
                    </div>

                    {conselho.status === "pendente" && (
                      <button
                        onClick={() => router.push("/preConselhoForm")}
                        className="mt-4 w-full py-2 bg-white text-[#1E545A] font-semibold rounded-md hover:bg-gray-100 transition-all duration-200"
                      >
                        Fazer Conselho
                      </button>
                    )}

                    {conselho.status === "feito" && (
                      <button
                        className="mt-4 w-full py-2 bg-white text-[#1E545A] font-semibold rounded-md hover:bg-gray-100 transition-all duration-200"
                      >
                        Ver feedbacks
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </section>
      </div>
    </main>
  );
}