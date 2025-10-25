"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Lista, { Usuario } from "@/components/lista"; // Podemos reaproveitar Lista para os conselhos, adaptando depois se necessário
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface Conselho {
  id: number;
  titulo: string;
  periodo: string; 
}

export default function TodosConselhos() {
  // Mock dos conselhos realizados
  const allConselhos: Conselho[] = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    titulo: `Conselho ${index + 1}`,
    periodo: `0${(index % 12) + 1}/2025 até 0${((index + 1) % 12) + 1}/2025`,
  }));

  const [selectedConselhos, setSelectedConselhos] = useState<Conselho[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectConselho = (conselho: Conselho) => {
    setSelectedConselhos((prev) =>
      prev.some((c) => c.id === conselho.id) ? prev : [...prev, conselho]
    );
  };

  const router = useRouter();

  useEffect(() => {
    document.title = "Todos os Conselhos - ConselhEXPERT";
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <div className="p-6 pb-0 w-full mt-16 h-full flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
              Todos os Conselhos
            </h2>
            <div className="bg-muted rounded-lg mb-4 p-4">
              <h3 className="font-medium text-card-foreground">Resumo</h3>
              <p className="text-sm text-muted-foreground">
                Conselhos realizados: <b>{allConselhos.length}</b>
              </p>
            </div>

            <div className="flex justify-start gap-2 mt-auto">
              <Button
                variant="outline"
                onClick={() => {
                  router.back();
                }}
              >
                Voltar
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 px-4 mt-8">
          <h2 className="ml-4 text-2xl font-semibold mb-4 text-card-foreground">
            Lista de Conselhos
          </h2>

          <div className="space-y-2">
            {allConselhos.map((conselho) => (
              <div
                key={conselho.id}
                className="flex justify-between items-center p-4 bg-muted rounded-md cursor-pointer hover:bg-primary hover:text-card transition"
                onClick={() => selectConselho(conselho)}
              >
                <div>
                  <h3 className="font-medium">{conselho.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{conselho.periodo}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {selectedConselhos.some((c) => c.id === conselho.id) ? "Selecionado" : ""}
                </span>
              </div>
            ))}
          </div>

          <div
            className="rounded-md shadow-sm overflow-y-auto pr-2 mt-4"
            style={{ maxHeight: "60vh" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
