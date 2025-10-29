import { Suspense } from "react";
import ConselhoContent from "./pagina";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Conselho() {
  return (
    <ProtectedRoute>
      <Suspense>
        <ConselhoContent />
      </Suspense>
    </ProtectedRoute>
  );
}
