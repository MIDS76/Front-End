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
  periodoInicio(periodoInicio: any): import("react").ReactNode;
  status: string;
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
  isActive: boolean;
}

export const USER_ROLES = [
  { value: "TECNICO_PEDAGOGICO", label: "Técnico Pedagógico" },
  { value: "SECRETARIA_PEDAGOGICA", label: "Secretaria Pedagógica"},
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "PROFESSOR", label: "Professor" },
  { value: "ALUNO", label: "Aluno"},

] as const;

export const ACTIVE = [
  { value: "true", label: "Ativo" },
  { value: "false", label: "Inativo" },
]

export type UserRoles = (typeof USER_ROLES)[number]["value"];

export type UserRoleLabels = (typeof USER_ROLES)[number]["label"];

export const etapas = [
  "Pré conselho",
  "Reunião",
  "Conversas particulares",
  "Resultados",
];
