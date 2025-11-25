"use client";

import CreateButton from "./buttons/createButton";
import NotificationButton from "./buttons/NotificationButton";
import ConfigurationButton from "./buttons/ConfigurationButton";
import { Role } from "@/utils/types";

interface HeaderButtonsProps {
    role: Role;
    sidebar?: boolean;
}

export default function HeaderButtons({ role, sidebar }: HeaderButtonsProps) {
  const baseButtons = {
    aluno: [<NotificationButton key="notifications" />, <ConfigurationButton key="config" />],
    admin: [<CreateButton key="create" />, <NotificationButton key="notifs" />, <ConfigurationButton key="config" />],
    pedagogico: [<CreateButton key="create" />, <NotificationButton key="notifs" />, <ConfigurationButton key="config" />],
    supervisor: [<CreateButton key="create" />, <NotificationButton key="notifs" />, <ConfigurationButton key="config" />],
    weg: [<NotificationButton key="notifications" />, <ConfigurationButton key="config" />],
  };

  return (
    <nav className={sidebar ? "flex flex-col gap-6 items-center justify-center" : "ml-auto hidden laptop:flex gap-6 items-center"}>
      {baseButtons[role].map(button => button)}
    </nav>
  );
}
