"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TextField from "../input/textField";
import { Button } from "../ui/button";
import { showError, validateDate, validateRequired } from "@/utils/formValidation";

interface TurmaFormProps {
    title: string;
    initialData?: {
        codigoTurma: string;
        nomeCurso: string;
        dataInicio: string;
        dataFim: string;
    };
    onSubmit: (form: {
        codigoTurma: string;
        nomeCurso: string;
        dataInicio: string;
        dataFim: string;
    }) => void;
}

export default function TurmaForm({ title, initialData, onSubmit }: TurmaFormProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        codigoTurma: initialData?.codigoTurma || "",
        nomeCurso: initialData?.nomeCurso || "",
        dataInicio: initialData?.dataInicio || "",
        dataFim: initialData?.dataFim || "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = () => {
        setErrors({});
        const newErrors: { [key: string]: string } = {};

        newErrors.codigoTurma = validateRequired(form.codigoTurma, "código da turma");
        newErrors.nomeCurso = validateRequired(form.nomeCurso, "nome do Curso");
        newErrors.dataInicio = validateDate(form.dataInicio);
        newErrors.dataFim = validateDate(form.dataFim);

        if (Object.values(newErrors).every((e) => !e)) {
            onSubmit(form);
            setTimeout(() => router.back(), 1500);
        } else {
            setErrors(newErrors);
            showError;
        }
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 flex flex-col items-start">
                    <div className="pb-0 w-full mt-6 h-full flex flex-col">
                        <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                            {title}
                        </h2>

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
                            <Button variant="outline" onClick={() => router.back()}>
                                Cancelar
                            </Button>

                            <Button onClick={handleSubmit}>Salvar</Button>
                        </div>
                    </div>
                </div>
            </div>
    );
}
