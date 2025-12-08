export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Turma {
  id?: number;
  nome: string;
  curso: string;
  dataInicio: string;
  dataFinal: string;
}

export interface Conselho {
  id: number;
  idTurma: number;
  nomeTurma?: string;
  dataInicio: string;
  dataFim: string;
  etapas: string;
}

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  role: string;
  isActive?: boolean;
}

export const USER_ROLES = [
  { value: "pedagogico", label: "Técnico Pedagógico" },
  { value: "weg", label: "WEG" },
  { value: "supervisor", label: "Supervisor" },
  { value: "professor", label: "Professor" }

] as const;

export const ACTIVE = [
  { value: "true", label: "Ativo" },
  { value: "false", label: "Inativo" },
]

export type UserRoles = (typeof USER_ROLES)[number]["value"];

export type UserRoleLabels = (typeof USER_ROLES)[number]["label"];

export type Role = "aluno" | "admin" | "pedagogico";

export const etapas = [
  "Não inciado",
  "Pré-conselho",
  "Conselho",
  "Agudando resultado",
  "Resultado"
];