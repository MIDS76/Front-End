import ActionModal from "@/components/modal/actionModal";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Conselho, Usuario } from "@/utils/types";
import ButtonTT from "./button/ButtonTT";

export interface CampoConselho {
    id: number;
    pontosFortes: string;
    oportunidadesMelhoria: string;
    sugestoes: string;
    conselho: {
        id: number;
    };
    usuario: {
        id: number;
    };
    professor?: {
        id: number;
    };
    unidadeCurricular?: string;
}

interface UserConselhoProps {
    campoForm: CampoConselho | null;
    setCampoForm: React.Dispatch<React.SetStateAction<CampoConselho | null>>;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isFormModalOpen: boolean;
    usuario: Usuario;
    conselho: Conselho;
    usuarioProfessor: Usuario | undefined;
}

export function UserConselho({
    campoForm,
    setCampoForm,
    setIsDialogOpen,
    setIsFormModalOpen,
    isFormModalOpen,
    usuario,
    conselho,
    usuarioProfessor,
}: UserConselhoProps) {

    return (
        <>
            <ButtonTT
                tooltip="Fazer anotação"
                variant="ghost"
                icon="MdEditSquare"
                mode="small"
                className="text-secondary scale-75"
                onClick={() => {
                    setIsFormModalOpen(true);
                    setIsDialogOpen(true);
                }}
            />
            <ActionModal
                customPosition={!usuarioProfessor}
                removeBg
                isOpen={isFormModalOpen}
                setOpen={setIsFormModalOpen}
                title={usuario.nome}
                description={usuario.email}
                actionButtonLabel="Salvar"
                onConfirm={() => {
                    const campo: CampoConselho = {
                        id: campoForm?.id ?? 0,
                        pontosFortes: campoForm?.pontosFortes?.trim() || " ",
                        oportunidadesMelhoria: campoForm?.oportunidadesMelhoria?.trim() || " ",
                        sugestoes: campoForm?.sugestoes?.trim() || " ",
                        conselho: { id: conselho?.id ?? 0 },
                        usuario: { id: usuario?.id ?? 0 },
                    };

                    if (usuarioProfessor) {
                        campo.professor = { id: usuarioProfessor?.id ?? 0 };
                        campo.unidadeCurricular = "java";
                    } else {
                    }
                }}
                onClose={() => setIsDialogOpen(false)}
                conteudo={
                    <div className="flex flex-col gap-4">
                        <Label>Insira os pontos fortes</Label>
                        <Textarea
                            className="max-h-[200px]"
                            placeholder="Insira os pontos fortes"
                            value={campoForm?.pontosFortes ?? ""}
                            onChange={(e) =>
                                setCampoForm((prev) => ({
                                    ...(prev ?? {
                                        id: 0,
                                        pontosFortes: "",
                                        oportunidadesMelhoria: "",
                                        sugestoes: "",
                                        conselho: { id: conselho?.id ?? 0 },
                                        usuario: { id: usuario?.id ?? 0 },
                                    }),
                                    pontosFortes: e.target.value,
                                }))
                            }
                        />
                        <Label>Insira as oportunidades de melhoria</Label>
                        <Textarea
                            className="max-h-[200px]"
                            placeholder="Insira as oportunidades de melhoria"
                            value={campoForm?.oportunidadesMelhoria ?? ""}
                            onChange={(e) =>
                                setCampoForm((prev) => ({
                                    ...(prev ?? {
                                        id: 0,
                                        pontosFortes: "",
                                        oportunidadesMelhoria: "",
                                        sugestoes: "",
                                        conselho: { id: conselho?.id ?? 0 },
                                        usuario: { id: usuario?.id ?? 0 },
                                    }),
                                    oportunidadesMelhoria: e.target.value,
                                }))
                            }
                        />
                        <Label>Insira as sugestões</Label>
                        <Textarea
                            className="max-h-[200px]"
                            placeholder="Insira as sugestões"
                            value={campoForm?.sugestoes ?? ""}
                            onChange={(e) =>
                                setCampoForm((prev) => ({
                                    ...(prev ?? {
                                        id: 0,
                                        pontosFortes: "",
                                        oportunidadesMelhoria: "",
                                        sugestoes: "",
                                        conselho: { id: conselho?.id ?? 0 },
                                        usuario: { id: usuario?.id ?? 0 },
                                    }),
                                    sugestoes: e.target.value,
                                }))
                            }
                        />
                    </div>
                }
            />
        </>
    )
};