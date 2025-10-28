import ButtonTT from "@/components/button/ButtonTT";


export default function DashboardButton(){
    return (
        <ButtonTT
        tooltip="Abrir gráficos"
        mode="small"
        variant="ghost"
        icon={"IoBarChart"}
        onClick={() => open("/dashboard", "_self")}
        />
    )
}