"use client";

import { Usuario } from "@/utils/types";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import TextField from "../input/textField";
import { Button } from "../ui/button";
import Lista from "../lista";

interface TurmaFormProps {
    title: string;
    initialData?: {
        codigoTurma: string;
        nomeCurso: string;
        dataIncio: string;
        dataFim: string;
    };
    alunos: Usuario[];
    onSubmit: (form: { codigoTurma: string; nomeCurso: string; dataIncio: string; dataFim: string },
        alunos: Usuario[]) => void;
}

export default function TurmaForm({ title, initialData, alunos, onSubmit }: TurmaFormProps) {
    const router = useRouter();

    const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]);
    const [form, setForm] = useState({
        codigoTurma: initialData?.codigoTurma || "",
        nomeCurso: initialData?.nomeCurso || "",
        dataIncio: initialData?.dataIncio || "",
        dataFim: initialData?.dataFim || "",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 flex flex-col items-start">
                    <div className="p-6 pb-0 w-full mt-16 h-full flex flex-col">
                        <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                            {title}
                        </h2>
                        <div className="bg-muted rounded-lg mb-4 p-4">
                            <h3 className="font-medium text-card-foreground">Resumo</h3>
                            <p className="text-sm text-muted-foreground">
                                Alunos Ativos: <b>{alunos.length}</b>
                            </p>
                        </div>
                        <div className="mb-4">
                            <TextField
                                label="Nome"
                                type="text"
                                id="className"
                                value={form.codigoTurma}
                                placeholder="Ex: MI 74"
                                editavel={true}
                                onChange={(e) => handleChange("codigoTurma", e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                value={form.nomeCurso}
                                label="Curso"
                                type="text"
                                id="course"
                                placeholder="Insira o curso"
                                onChange={(e) => handleChange("nomeCurso", e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                value={form.dataIncio}
                                label="Data de Início"
                                type="text"
                                id="dataInicio"
                                placeholder="Insira a data de início da turma"
                                onChange={(e) => handleChange("dataInicio", e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                value={form.dataIncio}
                                label="Data de Fim"
                                type="text"
                                id="dataFim"
                                placeholder="Insira a data de fim da turma"
                                onChange={(e) => handleChange("dataFim", e.target.value)}
                            />
                        </div>
                        <div className="flex justify-start gap-2 mt-auto">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    router.back();
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => {
                                    onSubmit(form, selectedUsers);
                                    setTimeout(() => {
                                        router.back();
                                    }, 1500);
                                }}
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-3/5 px-4 mt-8">
                    <div className="flex mb-4 ml-4 rounded-md overflow-hidden">
                        {/*Colocar lugar para importar planilha*/}
                    </div>

                    <h2 className="ml-4 text-2xl font-semibold mb-4 text-card-foreground">
                        Alunos da Turma
                    </h2>

                    <Lista
                        isDialogOpen={false}
                        setIsDialogOpen={() => { }}
                        usuarios={alunos}
                        setSelectedContact={(u) =>
                            setSelectedUsers((prev) =>
                                prev.some((s) => s.id === u.id) ? prev : [...prev, u]
                            )
                        }
                        tipo={"edit"}
                        selectedUsers={selectedUsers}
                    />
                    <div
                        className="rounded-md shadow-sm overflow-y-auto pr-2"
                        style={{ maxHeight: "60vh" }}
                    ></div>
                </div>
            </div>
        </div>
    );
}