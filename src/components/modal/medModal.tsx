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
      className={
        className +
        ` h-full flex flex-col hover:shadow-md cursor-pointer ${
          loading ? "animate-pulse bg-muted transition-all" : ""
        }`
      }
      onClick={onClick}
    >
      <CardHeader
        className={`bg-primary flex-row items-start p-4 pt-2 ${
          simple ? "rounded-lg h-full w-full" : "rounded-t-lg"
        } flex justify-between ${
          loading ? "bg-card/70 dark:bg-muted brightness-95" : ""
        }`}
      >
        <div className="pt-2 h-full">
          <h3
            className={`font-semibold text-lg text-card dark:text-card-foreground ${
              loading ? "text-card/70 dark:text-muted/70" : ""
            }`}
          >
            {courseCode}
          </h3>
          <p
            className={`text-sm ${
              loading
                ? "text-card/70 dark:text-muted"
                : "text-background dark:text-card-foreground"
            }`}
          >
            {courseName}
          </p>
        </div>
      </CardHeader>
      {!simple && (
        <CardContent
          className={`flex-1 p-4 ${loading ? "bg-muted rounded-lg" : ""}`}
        >
          <div
            className={`text-sm ${
              loading ? "text-muted dark:text-muted" : "text-muted-foreground"
            }`}
          >
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
