import { ReactNode } from "react";

interface ConfirmacaoNovoUserProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

export default function ConfirmacaoNovoUser({
  isOpen,
  setOpen,
  title = "Tem certeza que deseja criar este item?",
  message = "Esta ação não pode ser desfeita.",
  onConfirm,
  onCancel,
  confirmText = "Adicionar",
  cancelText = "Cancelar",
  children,
}: ConfirmacaoNovoUserProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in-0 zoom-in-95">
        {children || (
          <>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-md font-medium text-white shadow-sm hover:brightness-95 transition-all duration-200"
                style={{ backgroundColor: "#931632" }}
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 rounded-md font-medium text-white shadow-sm hover:brightness-95 transition-all duration-200"
                style={{ backgroundColor: "#19323C" }}
              >
                {confirmText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
