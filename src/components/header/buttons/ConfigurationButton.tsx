"use client";

import { ConfigDialog } from "@/components/perfil/configDialog";

export default function ConfigurationButton() {
  let userId: string | number |null = null;

    if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        userId = user ? user.id : null;
    }

        const handlePasswordChange = () => {
                console.log("Abrir modal de alteração de senha");
        };

    
    return (
        <ConfigDialog
            userId={userId}
            onChangePassword={handlePasswordChange} // Ensure ConfigDialogProps includes this prop
        />
    );
}
