import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import React from "react";

interface ConselhoCardProps {
  periodo: string;
  status: string;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ConselhoCard({ periodo, status, selected, onClick }: ConselhoCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`
        cursor-pointer
        rounded-lg
        shadow-sm
        border
        border-gray-200
        bg-[#1F2A37]  
        hover:shadow-md
        transition-shadow
        ${selected ? "ring-2 ring-blue-500" : ""}
      `}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-white text-lg font-semibold">{periodo}</CardTitle>
        <CardDescription className="text-gray-300 text-right">Status: {status}</CardDescription>
      </CardHeader>
    </Card>
  );
}
