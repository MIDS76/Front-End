import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ButtonTT from "@/components/button/ButtonTT";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Professor {
  id: number;
  nome: string;
  email: string;
  pontosPositivos: string;
  pontosAMelhorar: string;
  sugestoesDeMelhoria: string;
  avatarUrl?: string;
}

const professores: Professor[] = [
  {
    id: 1,
    nome: "Roberto Baumgartel",
    email: "roberto.baumgartel@edu.sc.senai.br",
    pontosPositivos:
      "Demonstra boa lógica de raciocínio e consegue resolver os exercícios com autonomia. Participa ativamente das aulas e colabora com os colegas.",
    pontosAMelhorar:
      "Precisa revisar melhor os conceitos de estruturas condicionais e evitar erros por desatenção nos exercícios.",
    sugestoesDeMelhoria:
      "Recomendo praticar mais com exercícios de lógica do tipo 'desafio' e revisar os conteúdos com pequenos resumos após cada aula.",
  },
  {
    id: 2,
    nome: "Leandro Sebolt",
    email: "camila.andrade@edu.sc.senai.br",
    pontosPositivos:
      "Ótima capacidade de interpretação de comandos SQL e desenvolve bem consultas complexas. Demonstra interesse constante pelo conteúdo.",
    pontosAMelhorar:
      "Pode aprofundar o conhecimento em modelagem de dados e normalização de tabelas.",
    sugestoesDeMelhoria:
      "Sugiro utilizar simuladores online de banco de dados para praticar fora do horário de aula e acompanhar fóruns da área.",
  },
  {
    id: 3,
    nome: "Kristian Edermann",
    email: "lucas.oliveira@edu.sc.senai.br",
    pontosPositivos:
      "Boa organização de código e entendimento da estrutura HTML/CSS. Demonstra interesse por tecnologias modernas como React.",
    pontosAMelhorar:
      "Precisa melhorar o controle de versionamento com Git e ter mais atenção com responsividade.",
    sugestoesDeMelhoria:
      "Tente desenvolver pequenos projetos pessoais e hospedá-los no GitHub para praticar e criar portfólio.",
  },
];

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({
  isOpen = false,
  onClose,
}: FeedbackModalProps) {
  return (
    <aside
      className={cn(
        "full-screen-dialog inset-auto right-0 z-10 flex flex-col bg-card w-full max-w-[90vw]",
        "transform transition-transform duration-300 ease-in-out border-l",
        isOpen ? "translate-x-0" : "translate-x-full",
        "h-[calc(100vh-5rem)]"
      )}
    >
      <Card className="flex flex-col h-full border-0">
        <CardHeader className="flex flex-row items-start gap-2 space-y-0">
          <ButtonTT
            mode="small"
            icon="IoClose"
            variant="ghost"
            onClick={() => onClose()}
            tooltip="Fechar"
          />
          <div className="flex flex-row w-full justify-between">
            <div>
              <CardTitle className="pb-1 mt-2 font-title text-accent-foreground font-bold">
                Feedback dos Professores
              </CardTitle>
              <CardDescription className="text-foreground">
                Avaliações e sugestões dos professores
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {professores.length > 0 ? (
              <div className="space-y-4">
                {professores.map((professor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={professor.avatarUrl}
                          alt={professor.nome}
                        />
                        <AvatarFallback>
                          {professor.nome.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{professor.nome}</h3>
                            <p className="text-sm text-muted-foreground">
                              {professor.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div>
                        <h4 className="text-sm font-medium text-primary">
                          Pontos Positivos
                        </h4>
                        <p className="text-sm">{professor.pontosPositivos}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-primary">
                          Pontos a Melhorar
                        </h4>
                        <p className="text-sm">{professor.pontosAMelhorar}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-primary">
                          Sugestões de Melhoria
                        </h4>
                        <p className="text-sm">
                          {professor.sugestoesDeMelhoria}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-muted-foreground">
                  Nenhum feedback cadastrado
                </span>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </aside>
  );
}
