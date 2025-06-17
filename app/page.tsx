import { Suspense } from "react";
import HomePage from "../components/HomePage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading cars...</div>}>
      <HomePage />
    </Suspense>
  );
}
