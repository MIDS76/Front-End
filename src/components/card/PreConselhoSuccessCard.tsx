"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreConselhoSuccessCardProps {
  onBackToHome?: () => void;
}

export default function PreConselhoSuccessCard({ 
  onBackToHome 
}: PreConselhoSuccessCardProps) {
  return (
    <div className="w-full max-w-[calc(100%-464px)] mx-auto py-8">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Pré-Conselho
        </h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold text-green-800">
            Sua resposta foi registrada.
          </p>
        </div>
        
        <Button
          onClick={onBackToHome}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-2 text-[14px] leading-[20px] font-medium"
        >
          Voltar a tela inicial
        </Button>
      </div>
    </div>
  );
}