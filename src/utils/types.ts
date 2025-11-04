export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Turma {
  id: number;
  codigoTurma: string;
  nomeCurso: string;
  conselhos?: Conselho[];
  usuarios?: Usuario[];
}

export interface Conselho {
  id: number;
  dataInicio: Date;
  dataFim: Date;
  etapa: number;
  turma: Turma;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export const USER_ROLES = [
  { value: "TECNICO_PEDAGOGICO", label: "Técnico Pedagógico" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "PROFESSOR", label: "Professor" },

] as const;

export type UserRoles = (typeof USER_ROLES)[number]["value"];

export type UserRoleLabels = (typeof USER_ROLES)[number]["label"];

export const etapas = [
  "Pré conselho",
  "Reunião",
  "Conversas particulares",
  "Resultados",
];
