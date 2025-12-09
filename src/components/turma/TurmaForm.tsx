"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TextField from "../input/textField";
import { Button } from "../ui/button";
import { showError, validateDate, validateRequired } from "@/utils/formValidation";
import { atualizarTurma } from "@/api/turmas";
import { Turma } from "@/utils/types";
import { toast } from "sonner";

interface TurmaFormProps {
    title: string;
    initialData?: Turma;
    onSubmit?: (form: Turma) => void;
    isLoading?: boolean;
}

export default function TurmaForm({ title, initialData, onSubmit, isLoading: externalLoading }: TurmaFormProps) {
    const router = useRouter();
    const params = useParams();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isLoading = externalLoading || isSubmitting;

    const [form, setForm] = useState<Turma>({
        id: undefined,
        nome: "",
        curso: "",
        dataInicio: "",
        dataFinal: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Garante o ID vindo do initialData OU da URL
        const idFinal = initialData?.id || (params?.id ? Number(params.id) : undefined);

        if (initialData || idFinal) {
            setForm({
                id: idFinal,
                nome: initialData?.nome || "",
                curso: initialData?.curso || "",
                dataInicio: initialData?.dataInicio ? String(initialData.dataInicio).split('T')[0] : "",
                dataFinal: initialData?.dataFinal ? String(initialData.dataFinal).split('T')[0] : "",
            });
        }
    }, [initialData, params]);

    const handleChange = (field: string, eventOrValue: any) => {
        let value = "";
        if (eventOrValue && eventOrValue.target && typeof eventOrValue.target.value !== 'undefined') {
            value = eventOrValue.target.value;
        } else {
            value = String(eventOrValue);
        }
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setErrors({});
        const newErrors: { [key: string]: string } = {};

        newErrors.nome = validateRequired(form.nome, "Nome da turma");
        newErrors.curso = validateRequired(form.curso, "Nome do curso");
        if (form.dataInicio) newErrors.dataInicio = validateDate(form.dataInicio);
        if (form.dataFinal) newErrors.dataFinal = validateDate(form.dataFinal);

        const hasErrors = Object.values(newErrors).some(val => val !== undefined && val !== "");

        if (!hasErrors) {
            setIsSubmitting(true);
            try {
                if (form.id) {
                    await atualizarTurma(form);
                    toast.success("Turma salva com sucesso!");
                    router.refresh();
                    router.back();

                } else if (onSubmit) {
                    await onSubmit(form);
                } else {
                    toast.error("Erro Crítico: ID não encontrado ou função de criação ausente.");
                    setIsSubmitting(false);
                    return;
                }

            } catch (error: any) {
                console.error("ERRO CAPTURADO:", error);

                if (error.response?.status === 403) {
                    toast.error("ERRO 403: Permissão Negada. Seu usuário não pode editar turmas.");
                } else if (error.response?.status === 404) {
                    toast.error("ERRO 404: Turma não encontrada.");
                } else {
                    toast.error("Erro ao salvar. Tente novamente.");
                }
            } finally {
                setIsSubmitting(false);
            }

        } else {
            setErrors(newErrors);
            toast.warning("Verifique os campos obrigatórios.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="w-full md:w-1/2 flex flex-col items-start">
                <div className="pb-0 w-full mt-6 h-full flex flex-col">

                    {/* AQUI EU REMOVI O SPAN QUE MOSTRAVA O ID */}
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        {title}
                    </h2>

                    <div className="mb-4 w-full">
                        <TextField
                            label="Nome"
                            id="className"
                            value={form.nome}
                            placeholder="Ex: MI 74"
                            editavel={!isLoading}
                            onChange={(e: any) => handleChange("nome", e)}
                            error={errors.nome}
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <TextField
                            label="Curso"
                            id="course"
                            value={form.curso}
                            placeholder="Insira o curso"
                            editavel={!isLoading}
                            onChange={(e: any) => handleChange("curso", e)}
                            error={errors.curso}
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <TextField
                            label="Data de Início"
                            type="date"
                            id="dataInicio"
                            placeholder="Insira a Data de Início do curso"
                            value={form.dataInicio}
                            editavel={!isLoading}
                            onChange={(e: any) => handleChange("dataInicio", e)}
                            error={errors.dataInicio}
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <TextField
                            label="Data de Fim"
                            type="date"
                            id="dataFim"
                            placeholder="Insira a Data de Fim do curso"
                            value={form.dataFinal}
                            editavel={!isLoading}
                            onChange={(e: any) => handleChange("dataFinal", e)}
                            error={errors.dataFinal}
                        />
                    </div>

                    <div className="flex justify-start gap-2 mt-auto">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}