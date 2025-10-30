"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CampoTextoProps {

  name?: string;
  label: string;
  placeholder: string;
  type: string;
  id?: string;
  className?: string;
  value?: string;
  editavel?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // new add
  required?: boolean;// new add
}

export default function TextField({
  editavel = true,
  value: initialValue,
  name,
  label,
  placeholder,
  type,
  id,
  className,
}: CampoTextoProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(initialValue || "");
  return (
    <div className="flex flex-col gap-2 ">
      <Label
        className={className + " whitespace-nowrap flex items-center"}
        htmlFor={id}
      >
        {label}
      </Label>
      <div className="flex flex-col items-end">
        <Input
          name={name}
          id={id}
          type={type === "password" ? (showPassword ? "text" : type) : type}
          placeholder={placeholder}
          autoComplete="off"
          className={className}
          value={value}
          readOnly={!editavel}
          onChange={(e) => setValue(e.target.value)}
        />
        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="relative bottom-[38px] hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeIcon
                className="w-4 h-4 text-accent-foreground"
                aria-hidden="true"
              />
            ) : (
              <EyeOffIcon
                className="w-4 h-4 text-accent-foreground"
                aria-hidden="true"
              />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
