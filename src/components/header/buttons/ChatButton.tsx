import ButtonTT from "@/components/button/ButtonTT";


export default function ChatButton() {
    return (
        <ButtonTT
        tooltip="Abrir chat"
        mode="small"
        variant="ghost"
        icon={"IoIosChatboxes"}
        onClick={() => open("/chat", "_self")}
        />
    )
}