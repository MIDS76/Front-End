import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TextClickCopy } from "./textcopy";

interface UserInfoProps {
  nome: string;
  email: string;
  copy?: boolean;
}

const UserInfo = ({ nome, email, copy }: UserInfoProps) => (
  <div className="flex gap-2 items-center w-1/2">
    <Avatar>
      <AvatarImage alt={nome} />
      <AvatarFallback className="select-none">
        {nome?.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
    <div className="w-full">
      <span className="text-sm font-medium">{nome}</span>
      {copy ? (
        <TextClickCopy className="text-sm">{email}</TextClickCopy>
      ) : (
        <p className="text-sm">{email}</p>
      )}
    </div>
  </div>
);

export default UserInfo;
