"use client";

import React, { useState, useEffect } from "react";
import ButtonTT from "@/components/button/ButtonTT";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TeacherOpinion {
  id: string;
  teacherName: string;
  teacherSubject: string;
  teacherAvatar?: string;
  teacherEmail?: string;
  pontosFortes?: string;
  pontosMelhorar?: string;
  sugestoesMelhoria?: string;
}

interface Student {
  id: number;
  name: string;
  attendance: number;
  pontosFortes: string;
  pontosAMelhorar: string;
  sugestoes: string;
  image?: string;
  teacherOpinions: TeacherOpinion[];
}

const teacherOpinions: TeacherOpinion[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  teacherName: `Professor ${i + 1}`,
  teacherSubject: `Matéria ${i + 1}`,
  teacherAvatar: `/loginbg.jpg`,
  teacherEmail: `professor${i + 1}@example.com`,
  pontosFortes: `Ótimo desempenho em ${i + 1}.`,
  pontosMelhorar: `Melhorar organização em ${i + 1}.`,
  sugestoesMelhoria: `Dedicar mais tempo à revisão do conteúdo ${i + 1}.`,
}));

const students: Student[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Aluno ${i + 1}`,
  attendance: Math.floor(Math.random() * 100),
  pontosFortes: "Participa bem das aulas.",
  pontosAMelhorar: "Precisa se organizar melhor.",
  sugestoes: "Criar rotina de estudos.",
  image: "/placeholder.svg",
  teacherOpinions: teacherOpinions,
}));

export default function DevolutivaConselhoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"pessoal" | "turma">("pessoal");
  const currentStudent = students[currentStudentIndex];

  const goToPreviousStudent = () => {
    setCurrentStudentIndex((prev) =>
      prev === 0 ? students.length - 1 : prev - 1
    );
  };

  const goToNextStudent = () => {
    setCurrentStudentIndex((prev) =>
      prev === students.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <aside
      className={cn(
        "inset-auto right-0 z-10 flex flex-col bg-card w-[480px] h-full",
        "transform transition-transform duration-300 ease-in-out border-l",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <Card className="w-full h-full mb-4 border-t-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <ButtonTT
              variant="ghost"
              mode="small"
              onClick={onClose}
              icon="IoClose"
              tooltip="none"
            />
            <h2 className="font-title text-accent-foreground">
              Devolutiva do Conselho
            </h2>
            <div className="flex items-center space-x-2">
              <ButtonTT
                onClick={goToPreviousStudent}
                mode="small"
                variant="ghost"
                tooltip="Anterior"
                icon="ChevronLeft"
              />
              <ButtonTT
                onClick={goToNextStudent}
                mode="small"
                variant="ghost"
                tooltip="Próximo"
                icon="ChevronRight"
              />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm">Presença</p>
            <span className="font-bold">{currentStudent.attendance}%</span>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as "pessoal" | "turma")}
            >
              <ToggleGroupItem value="pessoal">Pessoal</ToggleGroupItem>
              <ToggleGroupItem value="turma">Turma</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {viewMode === "pessoal" ? (
            <>
              <div>
                <Label>Pontos positivos</Label>
                <Textarea
                  value={currentStudent.pontosFortes}
                  readOnly
                  className="resize-none"
                />
              </div>
              <div>
                <Label>Pontos de melhoria</Label>
                <Textarea
                  value={currentStudent.pontosAMelhorar}
                  readOnly
                  className="resize-none"
                />
              </div>
              <div>
                <Label>Sugestões</Label>
                <Textarea
                  value={currentStudent.sugestoes}
                  readOnly
                  className="resize-none"
                />
              </div>
            </>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              {currentStudent.teacherOpinions.map((opinion) => (
                <Card key={opinion.id} className="bg-background mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={opinion.teacherAvatar} />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex justify-between w-full">
                        <div>
                          <CardTitle className="text-base">
                            {opinion.teacherName}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            {opinion.teacherEmail}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {opinion.teacherSubject}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-primary">
                        Pontos Fortes
                      </h4>
                      <p className="text-sm">{opinion.pontosFortes}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary">
                        Pontos a Melhorar
                      </h4>
                      <p className="text-sm">{opinion.pontosMelhorar}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-primary">
                        Sugestões de Melhoria
                      </h4>
                      <p className="text-sm">{opinion.sugestoesMelhoria}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}