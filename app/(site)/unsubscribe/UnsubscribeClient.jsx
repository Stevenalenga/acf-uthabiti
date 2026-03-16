"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Unsubscribe() {
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
    }
  }, []);

  return (
    <div className="p-20 text-center">
      <h1 className="text-2xl font-bold">
        You have been unsubscribed
      </h1>
    </div>
  );
}