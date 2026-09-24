"use client";

import { useState } from "react";
import { CreditCard, Mail, Hash, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function PayInvoicePage() {
  const { showToast } = useToast();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [registration, setRegistration] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();

    if (!invoiceNumber.trim() || !email.trim()) {
      showToast({
        type: "error",
        message: "Enter your invoice number and registration email.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/payment/lookup-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not find your registration.");
      }

      setRegistration(data);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async () => {
    if (!registration) return;

    try {
      setPaying(true);
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: registration.participantId }),
      });
      const data = await res.json();

      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error || "Payment could not start. Please retry.");
      }

      window.location.href = data.authorization_url;
    } catch (error) {
      showToast({ type: "error", message: error.message });
      setPaying(false);
    }
  };

  return (
    <main className="bg-gradient-to-br from-orange-50 via-white to-green-50 min-h-screen">
      <section className="max-w-xl mx-auto px-4 py-28">
        <div className="bg-white border border-orange-100 shadow-xl rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-orange-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Complete Your Payment
              </h1>
              <p className="text-sm text-gray-500">
                For registered participants with an unpaid invoice
              </p>
            </div>
          </div>

          {registration ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
                Registration found. Please confirm the details below, then
                proceed to secure payment.
              </div>

              <dl className="text-sm space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">
                    {registration.fullName}
                  </dd>
                </div>
                {registration.organization ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Organization</dt>
                    <dd className="font-medium text-gray-900 text-right">
                      {registration.organization}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium text-gray-900">
                    {registration.type}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Phase</dt>
                  <dd className="font-medium text-gray-900">
                    {registration.phase}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Invoice</dt>
                  <dd className="font-medium text-gray-900">
                    {registration.invoiceNumber}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-gray-200 pt-2 mt-2">
                  <dt className="text-gray-600 font-semibold">Amount due</dt>
                  <dd className="font-bold text-gray-900">
                    ${Number(registration.amount).toFixed(2)} USD
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handlePay}
                disabled={paying}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {paying ? "Redirecting to secure payment…" : "Pay Now"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                You will be redirected to our secure Paystack checkout, where
                you can pay using any of the available payment methods. Card
                charges are processed in Kenyan Shillings (KES).
              </p>

              <button
                type="button"
                onClick={() => setRegistration(null)}
                className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-700 mx-auto cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Look up a different registration
              </button>
            </div>
          ) : (
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Registration / Invoice number*
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="e.g. ACF2026/086/2026"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:light] disabled:opacity-60"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Find this on the invoice we emailed you after registration.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Registration email*
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:light] disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? "Looking up registration…" : "Find My Registration"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Not registered yet?{" "}
                <a
                  href="/event-register"
                  className="font-semibold text-orange-700 hover:text-orange-800"
                >
                  Register here
                </a>
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
