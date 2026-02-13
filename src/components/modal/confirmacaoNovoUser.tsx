"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  // Renderização do Modal
  const modalContent = (
    <div
      // CAMADA 1: O Overlay (Fundo Escuro)
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{
        // Garante que fique acima de TUDO (ActionModal, Toasts, Header)
        zIndex: 2147483647,
        // Garante que o elemento ocupe a tela toda
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        // CRUCIAL: Força o navegador a reconhecer cliques neste elemento
        pointerEvents: "auto",
        // Cria um novo contexto de empilhamento
        isolation: "isolate"
      }}
      // Para a propagação para não fechar modais anteriores
      onClick={(e) => e.stopPropagation()}
    >
      {/* CAMADA 2: O Card do Modal */}
      <div
        className="bg-white rounded-2xl p-7 max-w-md w-full mx-4 shadow-2xl animate-in fade-in-0 zoom-in-95"
        style={{
          // Garante que o card também aceite cliques
          pointerEvents: "auto",
          position: "relative",
          zIndex: 2147483648
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    if (onCancel) onCancel();
                    setOpen(false);
                }}
                className="px-6 py-2 rounded-md font-medium text-white shadow-sm hover:brightness-95 transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: "#931632", pointerEvents: "auto" }}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onConfirm();
                }}
                className="px-6 py-2 rounded-md font-medium text-white shadow-sm hover:brightness-95 transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: "#19323C", pointerEvents: "auto" }}
              >
                {confirmText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Garante que seja renderizado direto no BODY, fora da hierarquia do ActionModal
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}