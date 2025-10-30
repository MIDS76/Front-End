export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const USER_ROLES = [
  { value: "TECNICO_PEDAGOGICO", label: "Técnico Pedagógico" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "PROFESSOR", label: "Professor" },
  { value: "REPRESENTANTE", label: "Representante" },
  { value: "ALUNO", label: "Aluno" },
] as const;

export type UserRoles = (typeof USER_ROLES)[number]["value"];

export type UserRoleLabels = (typeof USER_ROLES)[number]["label"];

export const etapas = [
  "Pré conselho",
  "Reunião",
  "Conversas particulares",
  "Resultados",
];
