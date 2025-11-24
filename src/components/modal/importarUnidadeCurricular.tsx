"use client";

import { toast } from "sonner";
import ImportarCSV from "./importarCSV";
import { useEffect, useState } from "react";
import { criarUnidadeCurricularLista } from "@/api/preConselho";

interface ImportarCSVProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalFecharAfora({ isOpen, setOpen }: ImportarCSVProps) {
  if (!isOpen) return null;

  const handleImport = async (listaUcs: any[]) => {
    console.log("Importando unidades:", listaUcs);

    if (listaUcs.length > 0) {
      try {
        const unidades = await criarUnidadeCurricularLista(listaUcs);
        console.log(unidades);
        toast.success("Lista de Unidades curriculares importada com sucesso!");
        setOpen(false);
      } catch (err) {
        toast.error("Erro ao salvar lista de Unidades curriculares.");
      }
    }
  };

  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div className="bg-white rounded-2xl p-8 shadow-md w-[36rem] max-w-full">
        <ImportarCSV
          isOpen={true}
          setOpen={setOpen}
          width="32rem"
          height="32rem"
          onImported={handleImport}
        />
      </div>
    </div>
  );
}
