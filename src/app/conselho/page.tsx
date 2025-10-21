import { Suspense } from "react";
import ConselhoContent from "./pagina";

export default function Conselho() {
  return (
    <Suspense>
      <ConselhoContent />
    </Suspense>
  );
}
