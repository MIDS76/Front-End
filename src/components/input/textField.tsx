"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface CampoTextoProps {
  name?: string;
  label: string;
  placeholder: string;
  type: string;
  id?: string;
  className?: string;
  value?: string;
  editavel?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string; // 👈 adicionada
}

export default function TextField({
  editavel = true,
  value: externalValue,
  name,
  label,
  placeholder,
  type,
  id,
  className,
  onChange,
  error,
}: CampoTextoProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(externalValue || "");

  // 🔁 Mantém o estado interno sincronizado com o externo (controlado)
  useEffect(() => {
    if (externalValue !== undefined) setValue(externalValue);
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e); // repassa pro pai
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label
        className={`whitespace-nowrap flex items-center font-semibold ${
          error ? "text-red-600" : ""
        }`}
        htmlFor={id}
      >
        {label}
      </Label>

      <div className="flex flex-col items-end relative">
        <Input
          name={name}
          id={id}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          autoComplete="off"
          className={`${className || ""} ${
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-gray-300 focus-visible:ring-gray-400"
          }`}
          value={value}
          readOnly={!editavel}
          onChange={handleChange}
        />

        {/* 👁️ botão de mostrar/ocultar senha */}
        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeIcon className="w-4 h-4 text-accent-foreground" />
            ) : (
              <EyeOffIcon className="w-4 h-4 text-accent-foreground" />
            )}
          </Button>
        )}
      </div>

      {/* 🔴 mensagem de erro */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
