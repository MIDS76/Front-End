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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div className="bg-white rounded-2xl p-8 shadow-md w-[36rem] max-w-full">
        <ImportarCSV
          isOpen={true} 
          setOpen={setOpen} 
          width="32rem"    
          height="32rem"   
          onImported={() => {
            console.log("CSV importado");
            setOpen(false); 
          }} 
        />
      </div>
    </div>
  );
}
