"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TextField from "../input/textField";
import { Button } from "../ui/button";
import { showError, validateDate, validateRequired } from "@/utils/formValidation";
import { Turma } from "@/utils/types";


interface TurmaFormProps {
    title: string;
    initialData?: {
        nome: string;
        curso: string;
        dataInicio: string;
        dataFinal: string;
    };
    onSubmit: (form: Turma) => void;
    isLoading?: boolean;
}

export default function TurmaForm({ title, initialData, onSubmit, isLoading }: TurmaFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<Turma>({
        nome: initialData?.nome || "",
        curso: initialData?.curso || "",
        dataInicio: initialData?.dataInicio || "",
        dataFinal: initialData?.dataFinal || "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = () => {
        setErrors({});
        const newErrors: { [key: string]: string } = {};

        newErrors.nome = validateRequired(form.nome, "código da turma");
        newErrors.curso = validateRequired(form.curso, "nome do Curso");
        newErrors.dataInicio = validateDate(form.dataInicio);
        newErrors.dataFinal = validateDate(form.dataFinal);

        if (Object.values(newErrors).every((e) => !e)) {
            onSubmit(form);
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
                            value={form.nome}
                            placeholder="Ex: MI 74"
                            editavel={true}
                            onChange={(e) => handleChange("nome", e.target.value)}
                            error={errors.nome}
                        />
                    </div>

                    <div className="mb-4">
                        <TextField
                            value={form.curso}
                            label="Curso"
                            type="text"
                            id="course"
                            placeholder="Insira o curso"
                            onChange={(e) => handleChange("curso", e.target.value)}
                            error={errors.curso}
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
                            value={form.dataFinal}
                            label="Data de Fim"
                            type="date"
                            id="dataFim"
                            placeholder="Insira a data de fim da turma"
                            onChange={(e) => handleChange("dataFinal", e.target.value)}
                            error={errors.dataFinal}
                        />
                    </div>

                    <div className="flex justify-start gap-2 mt-auto">
                        <Button variant="outline" onClick={() => router.back()}>
                            Cancelar
                        </Button>

                        <Button onClick={handleSubmit} disabled={isLoading}>Salvar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
