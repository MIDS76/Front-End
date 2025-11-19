"use client";

import CreateButton from "./buttons/createButton";
import DashboardButton from "./buttons/DashboardButton";
import NotificationButton from "./buttons/NotificationButton";
import ChatButton from "./buttons/ChatButton";
import ConfigurationButton from "./buttons/ConfigurationButton";

interface HeaderButtonsProps {
    role: "aluno" | "admin" | "pedagogico";
    sidebar?: boolean;
}

export default function HeaderButtons({ role, sidebar }: HeaderButtonsProps) {
  const baseButtons = {
    aluno: [<ChatButton key="chat" />, <NotificationButton key="notifications" />, <ConfigurationButton key="config" />],
    admin: [<CreateButton key="create" />, <ChatButton key="chat" />, <NotificationButton key="notifs" />, <ConfigurationButton key="config" />],
    pedagogico: [<CreateButton key="create" />, <DashboardButton key="dashboard" />, <ChatButton key="chat" />, <NotificationButton key="notifs" />, <ConfigurationButton key="config" />],
  };

  return (
    <nav className={sidebar ? "flex flex-col gap-6 items-center justify-center" : "ml-auto hidden laptop:flex gap-6 items-center"}>
      {baseButtons[role].map(button => button)}
    </nav>
  );
}
