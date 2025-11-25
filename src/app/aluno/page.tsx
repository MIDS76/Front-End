"use client";



// ------------------ TIPOS ------------------
export interface Feedback {
  pontosFortes: string;
  oportunidades: string;
  sugestoes: string;
}

export interface Conselho {
  id: number;
  periodo: string;
  status: string;
  feedback: Feedback | null;
}

// ------------------ DADOS MOCK ------------------
export const conselhos: Conselho[] = [
  {
    id: 1,
    periodo: "03/2024 até 04/2024",
    status: "Publicado",
    feedback: {
      pontosFortes: `Demonstra liderança em projetos de grupo, sempre assumindo a frente na organização de tarefas e incentivando os colegas.`,
      oportunidades: `Pode desenvolver mais segurança ao expor ideias em público.`,
      sugestoes: `Participar de workshops e eventos voltados à comunicação e liderança.`,
    },
  },
  {
    id: 2,
    periodo: "09/2024 até 10/2024",
    status: "Publicado",
    feedback: {
      pontosFortes: `Excelente capacidade analítica e atenção aos detalhes.`,
      oportunidades: `Desenvolver habilidades de trabalho em equipe.`,
      sugestoes: `Participar de grupos de estudo colaborativos.`,
    },
  },
  {
    id: 3,
    periodo: "01/2025 até 03/2025",
    status: "Publicado",
    feedback: {
      pontosFortes: `Muita criatividade e inovação nas abordagens.`,
      oportunidades: `Aprimorar habilidades técnicas específicas.`,
      sugestoes: `Fazer cursos online para reforçar as competências técnicas.`,
    },
  },
  {
    id: 4,
    periodo: "05/2025 até 07/2025",
    status: "Publicado",
    feedback: {
      pontosFortes: `Boa comunicação e proatividade.`,
      oportunidades: `Melhorar a gestão do tempo.`,
      sugestoes: `Participar mais nas discussões e buscar feedback constante.`,
    },
  },
]
