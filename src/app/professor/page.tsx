"use client";

import ConselhosModal, { Turma } from "@/components/modal/conselhosModal";
import MedModal from "@/components/modal/medModal";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useState } from "react";

export default function ProfessorHome() {

    const dataAleatoria = "20/03/25"
    const turmas: Turma[] = [
        {
            id: 1, codigoTurma: "MI 76", nomeCurso: "Desenvolvimento de Sistemas",
            conselhos: [{
                id: 1,
                dataInicio: new Date("2025-10-20"),
                dataFim: new Date("2025-10-24"),
                etapa: 2,
                turma: { id: 1, codigoTurma: "MI 76", nomeCurso: "Desenvolvimento de Sistemas" }
            },
            {
                id: 1,
                dataInicio: new Date("2025-10-20"),
                dataFim: new Date("2025-10-24"),
                etapa: 3,
                turma: { id: 1, codigoTurma: "MI 76", nomeCurso: "Desenvolvimento de Sistemas" }
            },
            {
                id: 1,
                dataInicio: new Date("2025-10-20"),
                dataFim: new Date("2025-10-24"),
                etapa: 3,
                turma: { id: 1, codigoTurma: "MI 76", nomeCurso: "Desenvolvimento de Sistemas" }
            },
            {
                id: 1,
                dataInicio: new Date("2025-10-20"),
                dataFim: new Date("2025-10-24"),
                etapa: 3,
                turma: { id: 1, codigoTurma: "MI 76", nomeCurso: "Desenvolvimento de Sistemas" }
            }
        ]
        },
        { id: 2, codigoTurma: "MT 75", nomeCurso: "Eletrotécnica" },
        { id: 3, codigoTurma: "WU 77", nomeCurso: "Usinagem" },
        { id: 4, codigoTurma: "MI 77", nomeCurso: "Desenvolvimento de Sistemas" },
        { id: 5, codigoTurma: "MM 78", nomeCurso: "Manutenção Mecânica" },
        { id: 6, codigoTurma: "MI 78", nomeCurso: "Desenvolvimento de Sistemas" },
    ];

    const [sideModalOpen, setSideModalOpen] = useState(false);
    const [selectedTurma, setSelectedTurma] = useState({} as Turma);
    const [filteredMedModals, setFilteredMedModals] = useState<Turma[]>(turmas);

    return (
        <main className="w-full flex flex-col">
            <div className="flex flex-row flex-auto">
                <section className="w-full max-h-full md:w-3/5 xl:w-3/4 h-full flex flex-col items-start p-4 pt-16 gap-y-4">
                    <h2 className=" font-title text-2xl font-bold text-accent-foreground px-4">
                        Todas as turmas
                    </h2>
                    <ScrollArea className="w-full h-[500px] mt-8">
                        <ul className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full px-4">
                            <ListaTurmas />
                        </ul>
                    </ScrollArea>
                </section>
                <section className={`${sideModalOpen ? "pointer-events-auto" : "pointer-events-none"} 
                md:h-auto absolute right-0 w-3/4 md:w-2/5 xl:w-1/4 md:flex flex-col items-center justify-center md:bg-accent bg-none overflow-x-hidden`}>
                    <p className="hidden md:block md:absolute bottom-1/2 text-muted-foreground">
                        Selecione uma turma
                    </p>
                    <ConselhosModal
                        turma={selectedTurma} // Passa a turma selecionada para o modal.
                        isOpen={sideModalOpen} // Define se o modal está aberto.
                        onClose={() => setSideModalOpen(false)} // Função para fechar o modal.
                    />
                </section>
            </div>
        </main>
    );

    function ListaTurmas() {
        return filteredMedModals?.map((medModal, index) => (
            <MedModal
                key={index}
                courseCode={medModal.codigoTurma} // Exibe o código da turma.
                courseName={medModal.nomeCurso} // Exibe o nome do curso.
                onClick={() => {
                    // Lógica para abrir e fechar o modal lateral ao selecionar uma turma.
                    if (sideModalOpen && selectedTurma.id !== medModal.id) {
                        setSideModalOpen(false); // Fecha o modal atual.
                        setTimeout(() => {
                            setSideModalOpen(true); // Abre o modal novamente com a nova turma.
                            setSelectedTurma(medModal); // Atualiza a turma selecionada.
                        }, 300);
                    } else {
                        setSideModalOpen(true); // Abre o modal pela primeira vez.
                        setSelectedTurma(medModal); // Define a turma selecionada.
                    }
                }}
            >
                <b>Último conselho:</b> {dataAleatoria}
            </MedModal>
        ));
    }
}