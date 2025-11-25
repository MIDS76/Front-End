export default function AccessDeniedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)]">
            <h1 className="text-4xl font-bold font-title text-accent-foreground">
                403 - Acesso negado
            </h1>
            <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página.
            </p>
        </div>
    );
}