import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TextClickCopy } from "./textcopy";

interface UserInfoProps {
  name: string;
  email: string;
  copy?: boolean;
  active: boolean;
}

const UserInfo = ({ name, email, copy, active }: UserInfoProps) => (
  <div className={`flex gap-2 items-center w-1/2 ${!active ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <Avatar>
      <AvatarImage alt={name} />
      <AvatarFallback className="select-none">
        {name?.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
    <div className="w-full">
      <span className="text-sm font-medium">{name}</span>
      {copy ? (
        <TextClickCopy className="text-sm">{email}</TextClickCopy>
      ) : (
        <p className="text-sm">{email}</p>
      )}
    </div>
  </div>
);

export default UserInfo;
