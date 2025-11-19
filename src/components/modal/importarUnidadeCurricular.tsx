"use client";

import ImportarCSV from "./importarCSV"; 

interface ImportarCSVProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalFecharAfora({ isOpen, setOpen }: ImportarCSVProps) {
  
  if (!isOpen) return null;

  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100"
      onClick={closeModal}
    >
      <ImportarCSV isOpen={true} setOpen={setOpen} onImported={() => setOpen(false)} />
    </div>
  );
}
