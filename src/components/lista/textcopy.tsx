import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TextClickCopy({
    children,
    ...props
  }: React.HTMLAttributes<HTMLSpanElement>) {
    const [show, setShow] = useState(false);
  
    return (
      <span className="flex flex-row items-center">
        <p
          onClick={() => {
            navigator.clipboard.writeText(String(children));
            toast.success("Texto copiado: " + String(children));
          }}
          onMouseOver={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className={cn(
            props.className,
            "cursor-pointer truncate text-muted-foreground"
          )}
        >
          {children}
        </p>
        <Copy
          className={`ml-1 inline max-h-3 max-w-3 ${
            show ? "text-inherit" : "text-transparent"
          }`}
        />
      </span>
    );
  }