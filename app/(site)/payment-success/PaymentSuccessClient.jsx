"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

/* ---------------- Progress Steps ---------------- */

function ProgressSteps() {

  const steps = [
    { label: "Registration" },
    { label: "Payment" },
    { label: "Confirmation" },
  ];

  return (
    <div className="flex justify-center gap-10 mb-14">

      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
            ✓
          </div>

          <span className="text-green-700 font-medium">
            {step.label}
          </span>

        </div>
      ))}

    </div>
  );
}

/* ---------------- Page ---------------- */

export default function PaymentSuccess() {

  const params = useSearchParams();
  const reference = params.get("reference");

  const [status, setStatus] = useState("loading");

  useEffect(() => {

    if (!reference) {
      setStatus("failed");
      return;
    }

    const verifyPayment = async () => {

      try {

        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        });

        if (res.ok) {
          sessionStorage.removeItem("paymentInProgress");
          sessionStorage.removeItem("participantId");
          localStorage.removeItem("participantId");
          setStatus("success");
        } else {
          setStatus("failed");
        }

      } catch {
        setStatus("failed");
      }

    };

    verifyPayment();

  }, [reference]);

  /* ---------------- Loading UI ---------------- */

  if (status === "loading") {

    return (
      <section className="max-w-2xl mx-auto px-6 py-28 text-center">

        <ProgressSteps />

        <Loader2 className="animate-spin mx-auto h-14 w-14 text-orange-600 mb-6" />

        <h2 className="text-2xl font-semibold mb-2">
          Verifying Payment
        </h2>

        <p className="text-gray-600">
          Please wait while we confirm your transaction.
        </p>

      </section>
    );
  }

  /* ---------------- Failure UI ---------------- */

  if (status === "failed") {

    return (
      <section className="max-w-2xl mx-auto px-6 py-28 text-center">

        <ProgressSteps />

        <div className="bg-red-50 border border-red-200 p-10 rounded-xl">

          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-6" />

          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Payment Verification Failed
          </h2>

          <p className="text-gray-700 mb-6">
            We could not verify your payment. If your account was charged,
            please contact the conference support team.
          </p>

          <Link
            href="/registration"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Try Again
          </Link>

        </div>

      </section>
    );
  }

  /* ---------------- Success UI ---------------- */

  return (

    <section className="max-w-2xl mx-auto px-6 py-28 text-center">

      <ProgressSteps />

      <div className="bg-green-50 border border-green-200 p-12 rounded-xl">

        <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-6" />

        <h1 className="text-3xl font-bold text-green-700 mb-3">
          Payment Successful
        </h1>

        <p className="text-gray-700 mb-6">
          Your conference registration has been successfully confirmed.
        </p>

        {reference && (
          <div className="bg-white border rounded-lg px-6 py-4 text-sm text-gray-600 mb-6">
            <p className="font-medium text-gray-700 mb-1">
              Payment Reference
            </p>
            <p className="font-mono break-all">
              {reference}
            </p>
          </div>
        )}

        <p className="text-gray-600 mb-8">
          A confirmation email with your registration details has been sent
          to your email address.
        </p>

        <Link
          href="/event-register"
          className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          Return to Conference registation page
        </Link>

      </div>

    </section>

  );
}