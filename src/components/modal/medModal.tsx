import {
  Card,
  CardContent,
  CardHeader,
} from "../ui/card";

interface MedModalProps {
  courseCode: string;
  courseName: string;
  children?: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  simple?: boolean;
  className?: string;
}

export default function MedModal({
  courseCode,
  courseName,
  children,
  onClick,
  loading,
  className,
  simple,
}: MedModalProps) {
  return (
    <Card
      className={`
        cursor-pointer rounded-lg overflow-hidden 
        transition hover:scale-[1.02] shadow-sm
        ${loading ? "animate-pulse bg-muted" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      <CardHeader
        className={`
          bg-[#22565F] text-white p-4 
          ${loading ? "bg-card/70" : ""}
        `}
      >
        <div>
          <h3 className="text-lg font-bold leading-tight">{courseCode}</h3>
          <p className="text-xs opacity-90">{courseName}</p>
        </div>
      </CardHeader>

      {!simple && (
        <CardContent className="bg-white p-3">
          <div className="text-xs text-right font-medium text-muted-foreground">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
