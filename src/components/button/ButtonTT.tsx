"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button, ButtonProps } from "../ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";

import SmallButton, { Icon, SmallButtonProps } from "./smallButton";

export interface ButtonTTProps extends ButtonProps {
  mode?: "micro" | "small" | "default" | "text-icon";
  tooltip?: string;
  children?: React.ReactNode;
  iconSide?: "left" | "right";
  className?: string;
}

function TooltipPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
}

export default function ButtonTT({
  mode,
  children,
  tooltip,
  iconSide,
  className,
  ...props
}: ButtonTTProps & SmallButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          {mode === "default" ? (
            <Button className={className} {...props}>
              {children}
            </Button>
          ) : mode === "text-icon" ? (
            <Button {...props} className={className + " gap-2"}>
              {iconSide === "left" ? (
                <>
                  <Icon icon={props.icon} /> {children}
                </>
              ) : (
                <>
                  {children} <Icon icon={props.icon} />
                </>
              )}
            </Button>
          ) : (
            <SmallButton
              className={className}
              {...props}
              micro={mode === "micro"}
            />
          )}
        </TooltipTrigger>
        {tooltip !== "none" && (
          <TooltipPortal>
            <TooltipContent className="z-[100]" side="top">
              {tooltip}
            </TooltipContent>
          </TooltipPortal>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
