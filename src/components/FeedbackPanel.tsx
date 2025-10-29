"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonTT from "@/components/button/ButtonTT";

interface Feedback {
  pontosFortes: string;
  oportunidades: string;
  sugestoes: string;
  periodo?: string;
  alunoNome?: string;
  alunoAvatar?: string;
}

interface DevolutivaAlunoProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback | null;
}

export default function DevolutivaAluno({
  isOpen,
  onClose,
  feedback,
}: DevolutivaAlunoProps) {
  if (!feedback) {
    return (
      <aside
        className={cn(
          "inset-auto right-0 z-10 flex flex-col bg-card w-[480px] h-full",
          "transform transition-transform duration-300 ease-in-out border-l",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Card className="h-full border-t-0 flex items-center justify-center text-muted-foreground">
          <p>Nenhuma devolutiva disponível no momento.</p>
        </Card>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "inset-auto right-0 z-10 flex flex-col bg-card w-[480px] h-full",
        "transform transition-transform duration-300 ease-in-out border-l",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <Card className="h-full mb-4 border-t-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <ButtonTT
              variant="ghost"
              mode="small"
              onClick={onClose}
              icon="IoClose"
              tooltip="none"
            ></ButtonTT>

            <h2 className="font-title text-accent-foreground">
              Devolutiva do Conselho
            </h2>

            <span className="text-sm text-muted-foreground">
              {feedback.periodo || "Período não informado"}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              {feedback.alunoAvatar ? (
                <AvatarImage
                  src={feedback.alunoAvatar}
                  alt={feedback.alunoNome || "Aluno"}
                />
              ) : (
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {feedback.alunoNome || "Aluno não identificado"}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <Label>Pontos Fortes</Label>
              <Textarea
                value={feedback.pontosFortes}
                readOnly
                className="resize-none"
              />
            </div>

            <div>
              <Label>Oportunidades de Melhoria</Label>
              <Textarea
                value={feedback.oportunidades}
                readOnly
                className="resize-none"
              />
            </div>

            <div>
              <Label>Sugestões</Label>
              <Textarea
                value={feedback.sugestoes}
                readOnly
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
