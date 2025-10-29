import { Suspense } from "react";
import NovoConselho from "./pagina";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Conselho() {

  return (
    <ProtectedRoute>
      <Suspense>
        <NovoConselho />
      </Suspense>
    </ProtectedRoute>
  );
}
