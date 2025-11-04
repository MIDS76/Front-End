import React from "react";
import ButtonTT from "@/components/button/ButtonTT";

interface AddButtonProps {
  isUserAlreadySelected?: boolean;
  onOpen: () => void;
  className?: string;
}

export default function AddButton({ isUserAlreadySelected, onOpen, className }: AddButtonProps) {
  if (isUserAlreadySelected) return null;

  return (

    <ButtonTT
      tooltip="Adicionar"
      variant="ghost"
      icon="Plus"
      mode="small"
      className={className ?? "text-secondary"}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    />
  );
}
