"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const professores = [
  {
    id: "prof1",
    nome: "Prof. Ana Clara",
    pontosFortes:
      "Organização das aulas, domínio do conteúdo e clareza na explicação.",
    melhorias: "Maior uso de recursos visuais e tecnológicos durante as aulas.",
    sugestoes:
      "Explorar metodologias ativas para aumentar o engajamento dos alunos.",
  },
  {
    id: "prof2",
    nome: "Prof. João Paulo",
    pontosFortes: "Boa interação com os alunos e excelente disponibilidade.",
    melhorias:
      "Necessita melhorar a pontualidade nas devolutivas de atividades.",
    sugestoes: "Utilizar mais exemplos práticos relacionados ao conteúdo.",
  },
  {
    id: "prof3",
    nome: "Prof. Marina Silva",
    pontosFortes: "Didática envolvente e excelente domínio pedagógico.",
    melhorias: "Aprofundar a abordagem em alguns tópicos teóricos.",
    sugestoes: "Incluir mais momentos de feedback individual aos alunos.",
  },
];

const alunos = [
  {
    id: "aluno1",
    nome: "Alice Martins",
    comportamento: "Muito participativa e respeitosa em sala de aula.",
    desempenho: "Excelente desempenho em matemática e ciências.",
    sugestoes: "Estimular ainda mais a leitura e produção textual.",
  },
  {
    id: "aluno2",
    nome: "Bruno Carvalho",
    comportamento: "Bom comportamento, mas precisa evitar conversas paralelas.",
    desempenho: "Desempenho regular, com potencial para melhora em história.",
    sugestoes: "Incentivar revisão de conteúdos em casa.",
  },
  {
    id: "aluno3",
    nome: "Camila Souza",
    comportamento:
      "Responsável, demonstra interesse e cooperação com os colegas.",
    desempenho: "Ótima em atividades práticas e trabalhos em grupo.",
    sugestoes: "Desafiar com atividades de lógica e raciocínio.",
  },
];
const instituicao = [
  {
    id: "supervisao",
    nome: "Supervisão",
    pontosFortes:
      "Boa organização pedagógica e acompanhamento contínuo dos professores.",
    melhorias:
      "Maior presença nas salas de aula para observar práticas docentes.",
    sugestoes:
      "Realizar formações pedagógicas mensais com foco em metodologias ativas.",
  },
  {
    id: "secretaria",
    nome: "Secretaria Pedagógica",
    pontosFortes:
      "Atendimento ágil aos professores e organização de registros escolares.",
    melhorias:
      "Melhorar a comunicação com os responsáveis dos alunos.",
    sugestoes:
      "Implantar sistema digital para emissão de documentos escolares.",
  },
  {
    id: "infraestrutura",
    nome: "Infraestruturas",
    pontosFortes: "Ambientes amplos, limpos e organizados.",
    melhorias:
      "Melhorar a acústica das salas de aula e climatização de alguns ambientes.",
    sugestoes:
      "Investir em tecnologia e recursos digitais acessíveis a todos os alunos.",
  },
];


export default function DevolutivaAluno() {

  return (
    <div className="w-full px-4">
      <div className="w-full max-w-2xl mx-auto">
        <Tabs defaultValue="instituicao" className="w-full">
          <TabsList className="bg-muted rounded-xl p-1 mb-4">
            <TabsTrigger
              value="alunos"
              className="font-bold text-popover-foreground"
            >
              Alunos
            </TabsTrigger>
            <TabsTrigger
              value="professores" 
              className="font-bold text-popover-foreground"
            >
              Professores
            </TabsTrigger>
            <TabsTrigger
              value="instituicao"
              className="font-bold text-popover-foreground"
            >
              Instituição
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alunos">
            <h2 className="text-lg font-bold mb-4">Devolutiva aos Alunos</h2>
            <Accordion type="single" collapsible className="w-full">
              {alunos.map((aluno) => (
                <AccordionItem
                  key={aluno.id}
                  value={aluno.id}
                  className="bg-card rounded-md mt-3"
                >
                  <AccordionTrigger className="p-4 font-bold">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback className="select-none font-normal">
                          {aluno.nome.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        {aluno.nome}
                        <span className="text-sm font-normal text-muted-foreground">
                          {aluno.nome.replace(" ", ".").toLocaleLowerCase()}
                          @gmail.com
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 text-sm text-foreground bg-card rounded-b-md space-y-4">
                    <div>
                      <h3 className="font-semibold">Comportamento</h3>
                      <p>{aluno.comportamento}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Desempenho Acadêmico</h3>
                      <p>{aluno.desempenho}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Sugestões</h3>
                      <p>{aluno.sugestoes}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="professores">
            <h2 className="text-lg font-bold mb-4">
              Devolutiva aos Professores
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {professores.map((prof) => (
                <AccordionItem
                  key={prof.id}
                  value={prof.id}
                  className="bg-card rounded-md mt-3"
                >
                  <AccordionTrigger className="p-4 font-bold">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback className="select-none font-normal">
                          {prof.nome.substring(5, 8)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        {prof.nome}
                        <span className="text-sm font-normal text-muted-foreground">
                          {prof.id}
                          @gmail.com
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 text-sm text-foreground bg-card rounded-b-md space-y-4">
                    <div>
                      <h3 className="font-semibold">Pontos Fortes</h3>
                      <p>{prof.pontosFortes}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Oportunidades de Melhoria
                      </h3>
                      <p>{prof.melhorias}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Sugestões</h3>
                      <p>{prof.sugestoes}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="instituicao">
            <h2 className="text-lg font-bold mb-4">Devolutiva à Instituição</h2>
            <Accordion type="single" collapsible className="w-full">
              {instituicao.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-card rounded-md mt-3"
                >
                  <AccordionTrigger className="p-4 font-bold">
                    {item.nome}
                  </AccordionTrigger>
                  <AccordionContent className="p-4 text-sm text-foreground bg-card rounded-b-md space-y-4">
                    <div>
                      <h3 className="font-semibold">Pontos Fortes</h3>
                      <p>{item.pontosFortes}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Oportunidades de Melhoria</h3>
                      <p>{item.melhorias}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Sugestões</h3>
                      <p>{item.sugestoes}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
