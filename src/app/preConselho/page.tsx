"use client";

import Header from "@/components/header/header";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalConselho() {
  const [selectedDate, setSelectedDate] = useState<number | null>(16);

  const days = [
    [25, 26, 27, 28, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 1],
  ];

  // exemplo: dias que têm conselho (verde claro)
  const diasComConselho = [13];

  const cards = [
    { titulo: "Conselho", periodo: "05/2024 até 09/2024", status: "Publicado" },
    { titulo: "Conselho", periodo: "05/2024 até 09/2024", status: "Publicado" },
    { titulo: "Conselho", periodo: "05/2024 até 09/2024", status: "Publicado" },
    { titulo: "Conselho", periodo: "05/2024 até 09/2024", status: "Publicado" },
    { titulo: "Conselho", periodo: "05/2024 até 09/2024", status: "Publicado" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
    

      <main className="p-6 md:p-8 flex gap-6 md:gap-8">
        {/* Left column - Disponibilidades */}
        <section className="flex-1 max-w-[640px] bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#225B5C] text-white text-lg font-semibold py-3 px-6">
            Disponibilidades [...]
          </div>

          <div className="p-5 bg-[#E6F0F0] min-h-[420px]">
            <div className="grid grid-cols-2 gap-4">
              {cards.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-[#38A7A8] rounded-md shadow-md overflow-hidden w-full"
                >
                  <div className="p-3 text-white">
                    <div className="text-xs">Conselho</div>
                    <div className="text-sm font-semibold mt-1">{c.periodo}</div>
                  </div>

                  <div className="bg-white px-3 py-2 text-xs text-gray-700 flex justify-between items-center">
                    <span className="font-semibold text-xs">Status:</span>
                    <span className="text-xs">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right column - Calendário */}
        <section className="flex-[1] bg-white rounded-lg shadow-md overflow-hidden relative">
          <div className="bg-[#225B5C] text-white text-lg font-semibold py-3 px-6 text-center">
            Selecione a data do Conselho
          </div>

          {/* month header */}
          <div className="px-6 py-3 border-b flex items-center justify-between">
            <button className="p-2 text-gray-700 hover:text-[#225B5C]">
              <ChevronLeft />
            </button>
            <div className="text-sm font-semibold text-gray-800">ABRIL 2025</div>
            <button className="p-2 text-gray-700 hover:text-[#225B5C]">
              <ChevronRight />
            </button>
          </div>

          {/* calendar body */}
          <div className="p-6">
            <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-3 text-xs">
              <div>DOM</div>
              <div>SEG</div>
              <div>TER</div>
              <div>QUA</div>
              <div>QUI</div>
              <div>SEX</div>
              <div>SAB</div>
            </div>

            {/* grid with fixed row heights so the cells align nicely */}
            <div className="grid grid-cols-7 gap-3">
              {days.flat().map((day, i) => {
                const isConselho = diasComConselho.includes(day);
                const isSelected = selectedDate === day;

                // estilos diferenciados:
                // - selecionado: bloco maior, verde escuro, número em branco
                // - conselho: bloco verde claro (retângulo)
                // - padrão: número pequeno
                return (
                  <div
                    key={i}
                    className="flex justify-center items-start h-16"
                    // wrapper para manter célula alinhada
                  >
                    {isSelected ? (
                      <button
                        onClick={() => setSelectedDate(day)}
                        className="bg-[#225B5C] text-white rounded-lg px-4 py-2 shadow-md w-16 h-12 flex items-center justify-center text-sm font-semibold"
                      >
                        {day}
                      </button>
                    ) : isConselho ? (
                      <button
                        onClick={() => setSelectedDate(day)}
                        className="bg-[#C8DFDD] text-gray-800 rounded-lg px-4 py-2 w-16 h-12 flex items-center justify-center text-sm font-semibold border border-[#BFD6D3]"
                      >
                        {day}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedDate(day)}
                        className="text-sm text-gray-700 hover:bg-gray-100 rounded-md w-8 h-8 flex items-center justify-center"
                      >
                        {day}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next button bottom-right (like design) */}
          <div className="absolute right-6 bottom-6">
            <Button className="bg-[#225B5C] text-white hover:bg-[#1c4d4e] px-4 py-2 rounded-md">
              Próximo passo →
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
