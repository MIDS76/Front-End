"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@radix-ui/react-dropdown-menu";

export type ComboboxItem = {
  value: string;
  label: string;
};

export interface ComboboxProps {
  items: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  width?: string;
  label?: string;
  error?: string;
  id: string;
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select an item...",
  emptyMessage = "No item found.",
  className,
  width,
  label,
  error,
  id,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState<number | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setButtonWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(buttonRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const normalizedItems: ComboboxItem[] = items.map((item) => {
    return item;
  });

  const selectedItem = normalizedItems.find((item) => item.value === value);
  const buttonStyle = width ? { width } : undefined;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          className={`whitespace-nowrap flex items-center font-semibold ${error ? "text-red-600" : ""}`}
          htmlFor={id}
        >
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between",
              "text-muted-foreground font-normal",
              `${className || ""} ${error
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-gray-300 focus-visible:ring-gray-400"
              }`
            )}
            style={buttonStyle}
          >
            {selectedItem ? selectedItem.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{
            width: buttonWidth ? `${buttonWidth}px` : undefined,
            pointerEvents: "all",
          }}
          align="start"
          sideOffset={5}
        >
          <Command>
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {normalizedItems.map((item) => (
                  <CommandItem
                    className="cursor-pointer"
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
