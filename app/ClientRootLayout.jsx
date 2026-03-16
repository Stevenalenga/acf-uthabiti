"use client";

import ToastProvider from "@/components/ui/ToastProvider";

export default function ClientRootLayout({ children }) {
  return (
    <>
    <ToastProvider>
      {children}
    </ToastProvider>
    </>
  );
}
