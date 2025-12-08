import { Button } from "../ui/button";
import { BiSolidBell } from "react-icons/bi";
import { FaGear } from "react-icons/fa6";
import { IoIosChatboxes } from "react-icons/io";
import { HTMLAttributes } from "react";
import { MdFilterAlt } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { Plus } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { ChevronRight } from "lucide-react";
import { IoBarChart } from "react-icons/io5";
import { MoreHorizontal } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { RiChatNewLine } from "react-icons/ri";
import { BiSolidTrashAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";
import { Star } from "lucide-react"; // Usamos só o Star

import { cn } from "@/lib/utils";

export interface SmallButtonProps extends HTMLAttributes<HTMLOrSVGElement> {
  micro?: boolean;
  filled?: boolean;
  icon?:
    | "BiSolidBell"
    | "FaGear"
    | "IoIosChatboxes"
    | "MdFilterAlt"
    | "Menu"
    | "Plus"
    | "ChevronLeft"
    | "ChevronRight"
    | "IoClose"
    | "IoBarChart"
    | "MoreHorizontal"
    | "MoreVertical"
    | "RiChatNewLine"
    | "BiSolidTrashAlt"
    | "FaCheck"
    | "MdEditSquare"
    | "Star";
}

export default function SmallButton({
  icon,
  micro,
  filled,
  ...props
}: SmallButtonProps) {
  return micro ? (
    <button
      className={cn(
        `p-1 h-fit text-card hover:bg-secondary/20 rounded-sm ${props.className} `
      )}
      {...props}
    >
      <Icon icon={icon} filled={filled} className={"size-6"} />
    </button>
  ) : (
    <Button size={"icon"} className="" {...props}>
      <Icon icon={icon} filled={filled} className="scale-150" />
    </Button>
  );
}

export function Icon({
  icon,
  filled,
  ...props
}: SmallButtonProps) {
  const Tag =
    icon === "BiSolidBell"
      ? BiSolidBell
      : icon === "FaGear"
      ? FaGear
      : icon === "IoIosChatboxes"
      ? IoIosChatboxes
      : icon === "Menu"
      ? IoMenu
      : icon === "MdFilterAlt"
      ? MdFilterAlt
      : icon === "ChevronLeft"
      ? ChevronLeft
      : icon === "ChevronRight"
      ? ChevronRight
      : icon === "IoClose"
      ? IoClose
      : icon === "IoBarChart"
      ? IoBarChart
      : icon === "MoreHorizontal"
      ? MoreHorizontal
      : icon === "MoreVertical"
      ? MoreVertical
      : icon === "RiChatNewLine"
      ? RiChatNewLine
      : icon === "BiSolidTrashAlt"
      ? BiSolidTrashAlt
      : icon === "FaCheck"
      ? FaCheck
      : icon === "Plus"
      ? Plus
      : icon === "MdEditSquare"
      ? MdEditSquare
      : icon === "Star"
      ? Star
      : () => <span />; // Fallback para um span vazio

  const isStar = icon === "Star";

  return (
    <Tag
      {...props}
      className={cn(
        props.className,
        isStar &&
          (filled
            ? "text-primary fill-primary"
            : "text-muted-foreground fill-none")
      )}
    />
  );
}