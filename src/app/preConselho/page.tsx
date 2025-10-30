"use client";

import { useState } from "react";
import ButtonTT from "@/components/button/ButtonTT";

export default function PortalDoPreConselho() {
  const [selectedDate, setSelectedDate] = useState(16); 

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const month = 9; 
    const year = 2025;
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const weekDayHeaders = weekDays.map((day, index) => (
      <div key={`header-${index}`} className="text-xs font-semibold text-gray-600 p-2">
        {day}
      </div>
    ));

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = i === selectedDate;
      const isHighlighted = i === 13; 

      let dayClass = "p-2 text-sm rounded cursor-pointer transition-colors ";
      if (isSelected) {
        dayClass += "bg-green-700 text-white font-bold";
      } else if (isHighlighted) {
        dayClass += "bg-gray-200 text-gray-700";
      } else {
        dayClass += "text-gray-700 hover:bg-gray-100";
      }

      days.push(
        <div
          key={`day-${i}`}
          className={dayClass}
          onClick={() => setSelectedDate(i)}
        >
          {i}
        </div>
      );
    }

    return [...weekDayHeaders, ...days];
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-white">
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl ring-4 ring-black ring-opacity-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Conselho da turma MI 76
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  05/2025 até 09/2025
                </p>
              </div>
              
              <ButtonTT
                mode="default"
                className=" text-white font-medium py-3 px-6 self-start"
              >
                Próximo passo &gt;
              </ButtonTT>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Selecione a data do Conselho
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center font-semibold text-gray-800 mb-4">
                  Outubro 2025
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}