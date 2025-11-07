"use client";

import { Usuario } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextField from "../input/textField";
import { Button } from "../ui/button";
import Lista from "../lista";
import { toast } from "sonner";

interface TurmaFormProps {
    title: string;
    initialData?: {
        codigoTurma: string;
        nomeCurso: string;
        dataInicio: string;
        dataFim: string;
    };
    alunos: Usuario[];
    onSubmit: (form: { codigoTurma: string; nomeCurso: string; dataInicio: string; dataFim: string },
        alunos: Usuario[]) => void;
}

export default function TurmaForm({ title, initialData, alunos, onSubmit }: TurmaFormProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        codigoTurma: initialData?.codigoTurma || "",
        nomeCurso: initialData?.nomeCurso || "",
        dataInicio: initialData?.dataInicio || "",
        dataFim: initialData?.dataFim || "",
    });

    const [errors, setErrors] = useState<{ codigoTurma?: string; nomeCurso?: string; dataInicio?: string; dataFim?: string; listaAlunos?: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!form.codigoTurma.trim()) newErrors.codigoTurma = "O código da turma é obrigatório.";
        if (!form.nomeCurso.trim()) newErrors.nomeCurso = "O nome do curso é obrigatório.";
        if (!form.dataInicio.trim()) newErrors.dataInicio = "Selecione a data de início da turma.";
        if (!form.dataFim.trim()) newErrors.dataFim = "Selecione a data de fim da turma.";
        if (alunos.length === 0) newErrors.listaAlunos = "Adicione os alunos à turma.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(form, alunos);
            setTimeout(() => {
                router.back();
            }, 1500);
        } else {
            toast.error("Preencha todos os campos corretamente!");
        }
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
            toast.success("Arquivo selecionado com sucesso!");
        }
    };

    const handleFileUpload = () => {
        if (file) {
            toast.success("Planilha importada com sucesso!");
        } else {
            toast.error("Nenhum arquivo selecionado.");
        }
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
                                error={errors.codigoTurma}
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
                                error={errors.nomeCurso}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                value={form.dataInicio}
                                label="Data de Início"
                                type="date"
                                id="dataInicio"
                                placeholder="Insira a data de início da turma"
                                onChange={(e) => handleChange("dataInicio", e.target.value)}
                                error={errors.dataInicio}
                            />
                        </div>
                        <div className="mb-4">
                            <TextField
                                value={form.dataFim}
                                label="Data de Fim"
                                type="date"
                                id="dataFim"
                                placeholder="Insira a data de fim da turma"
                                onChange={(e) => handleChange("dataFim", e.target.value)}
                                error={errors.dataFim}
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
                                    handleSubmit();
                                }}
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-3/5 px-4 mt-8">
                    <div className="flex mb-4 ml-4 rounded-md overflow-hidden">
                        {title === "Criar Turma" && (
                            <div className="mt-6">
                                <label className="text-sm font-semibold text-gray-800">Importar Planilha</label>
                                <input
                                    type="file"
                                    accept=".csv, .xlsx"
                                    className="block w-full mt-2 text-sm text-gray-800"
                                    onChange={handleFileChange}
                                />
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={handleFileUpload}
                                >
                                    Importar
                                </Button>
                            </div>
                        )}
                    </div>

                    <h2 className="ml-4 text-2xl font-semibold mb-4 text-card-foreground">
                        Alunos da Turma
                    </h2>
                    
                    {errors.listaAlunos && (
                            <p className="text-red-500 text-sm mt-2 text-center">{errors.listaAlunos}</p>
                        )}

                    <Lista
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        usuarios={alunos}
                        tipo={title === "Criar Turma" ? "limpa" : "edit"}
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