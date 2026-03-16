import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <UnsubscribeClient />
    </Suspense>
  );
}