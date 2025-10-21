"use client";

import React, { useState } from "react";
import ButtonTT from "@/components/button/ButtonTT";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWindowSize } from "usehooks-ts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
const teacherOpinions: TeacherOpinion[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: String(i + 1),
    teacherName: `Professor ${i + 1}`,
    teacherSubject: `Matéria ${i + 1}`,
    teacherAvatar: `/loginbg.jpg`,
    teacherEmail: `professor${i + 1}@example.com`,
    pontosFortes: `Ótimo desempenho em ${
      i + 1
    }. Domina os conceitos e aplica com facilidade.`,
    pontosMelhorar: `Precisa melhorar a organização em ${
      i + 1
    } e a pontualidade na entrega de trabalhos.`,
    sugestoesMelhoria: `Sugiro dedicar mais tempo à revisão dos conteúdos de ${
      i + 1
    } e organizar um cronograma de estudos.`,
  })
);

const students: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Aluno ${i + 1}`,
  attendance: Math.floor(Math.random() * 100),
  pontosFortes: "Participação ativa nas aulas.",
  pontosAMelhorar: "Organização do tempo de estudo.",
  sugestoes: "Criar um cronograma de estudos.",
  image: "/placeholder.svg?width=32&height=32",
  teacherOpinions: teacherOpinions,
}));

export interface TeacherOpinion {
  id: string;
  teacherName: string;
  teacherSubject: string;
  teacherAvatar?: string;
  teacherEmail?: string;
  pontosFortes?: string;
  pontosMelhorar?: string;
  sugestoesMelhoria?: string;
}
interface DevolutivaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConsideracoesModalProps extends DevolutivaModalProps {
  teacherOpinions: TeacherOpinion[];
}

export default function DevolutivaModal({
  isOpen = false,
  onClose,
}: DevolutivaModalProps) {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
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

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <aside
        className={cn(
          "inset-auto right-0 z-10 flex flex-col bg-card w-[480px] h-full",
          "transform transition-transform duration-300 ease-in-out border-l",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Card className="full-screen-dialog h-full mb-4 border-t-0">
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
              <div className="flex items-center space-x-2">
                <ButtonTT
                  onClick={goToPreviousStudent}
                  mode="small"
                  variant="ghost"
                  tooltip="Aluno anterior"
                  icon="ChevronLeft"
                />

                <ButtonTT
                  onClick={goToNextStudent}
                  mode="small"
                  variant="ghost"
                  tooltip="Próximo Aluno"
                  icon="ChevronRight"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{currentStudent.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{currentStudent.name}@email.com</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="pontosFortes">Pontos Fortes</Label>
                <Textarea
                  id="pontosFortes"
                  value={currentStudent.pontosFortes}
                  readOnly
                  className="resize-none"
                />
              </div>
              <div>
                <Label htmlFor="pontosAMelhorar">Pontos a Melhorar</Label>
                <Textarea
                  id="pontosAMelhorar"
                  value={currentStudent.pontosAMelhorar}
                  readOnly
                  className="resize-none"
                />
              </div>
              <div>
                <Label htmlFor="sugestoes">Sugestões</Label>
                <Textarea
                  id="sugestoes"
                  value={currentStudent.sugestoes}
                  readOnly
                  className="resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>

      <ConsideracoesModal
        isOpen={isOpen}
        onClose={onClose}
        teacherOpinions={currentStudent.teacherOpinions}
      />
    </>
  );
}

function ConsideracoesModal({
  isOpen,
  onClose,
  teacherOpinions,
}: ConsideracoesModalProps) {
  const { width = 0 } = useWindowSize();

  return (
    width > 768 && (
      <Dialog modal={false} open={isOpen} onOpenChange={onClose}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-[700px] max-h-[90vh] flex flex-col bg-card [&>button:last-child]:hidden"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-title font-bold text-accent-foreground">
              Feedback dos Professores
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="pr-4 h-[60vh]">
            {teacherOpinions.map((opinion) => (
              <Card key={opinion.id} className="bg-background mb-4">
                <CardHeader className="pb-2 w-full">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={opinion.teacherAvatar}
                        alt={opinion.teacherName}
                      />
                    </Avatar>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <CardTitle className="text-base">
                          {opinion.teacherName}
                        </CardTitle>
                        {opinion.teacherEmail && (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            {opinion.teacherEmail}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {opinion.teacherSubject}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-primary">
                      Pontos Fortes
                    </h4>
                    <p className="text-sm">
                      {opinion.pontosFortes || (
                        <span className="text-muted-foreground italic">
                          O professor não registrou pontos fortes.
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-1 text-primary">
                      Pontos a Melhorar
                    </h4>
                    <p className="text-sm">
                      {opinion.pontosMelhorar || (
                        <span className="text-muted-foreground italic">
                          O professor não registrou pontos a melhorar.
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-1 text-primary">
                      Sugestões de Melhoria
                    </h4>
                    <p className="text-sm">
                      {opinion.sugestoesMelhoria || (
                        <span className="text-muted-foreground italic">
                          O professor não registrou sugestões de melhoria.
                        </span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  );
}
