import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Notificacao } from "../header/buttons/NotificationButton";

interface SmallModalProps {
  title: string;
  description: string;
  content: string;
  notif?: () => void;
  onClick?: () => void;
  onDelete?: () => void;
  id?: number;
  lido: boolean,
  setNotificacoes: React.Dispatch<React.SetStateAction<Notificacao[]>>;
}

export default function SmallModal({
  title,
  description,
  content,
  notif,
  onClick,
  onDelete,
  lido,
  id,
  setNotificacoes,
}: SmallModalProps) {

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Card
      className="bg-card max-w-sm cursor-pointer hover:shadow-lg m-4 ml-2"
      onClick={handleClick}
    >
      <CardHeader
        className={`rounded-t-lg ${notif ? "bg-accent" : "bg-secondary"
          } flex flex-row items-center gap-2 px-4 ${notif ? "py-2" : "py-4"}`}
      >
        {notif && (
          <div className="mt-1.5 rounded-full bg-black w-10 h-10"></div>
        )}
        <div>
          <CardTitle className={`${notif ? "" : "text-card"} text-xl`}>
            {title}
          </CardTitle>
          <CardDescription
            className={`${notif ? "" : "text-background"} ml-auto`}
          >
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className={`truncate-multiline`}>
          {!notif && <span className="font-bold">Status: </span>}
          {content}
        </p>
      </CardContent>
    </Card>
  );
}
