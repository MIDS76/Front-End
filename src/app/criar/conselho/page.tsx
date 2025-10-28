import { Suspense } from "react";
import NovoConselho from "./pagina";

export default function Conselho() {

  return (
    <Suspense>
      <NovoConselho />
    </Suspense>
  );
}
