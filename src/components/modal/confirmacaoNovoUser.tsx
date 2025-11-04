// src/components/modals/confirmacaoNovoUser.tsx

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
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {children || (
          <>
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500">{message}</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
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