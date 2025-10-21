export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)]">
      <h1 className="text-4xl font-bold font-title text-accent-foreground">
        404 - Página Não Encontrada
      </h1>
      <p className="text-muted-foreground">
        A página que você procura não existe.
      </p>
    </div>
  );
}
