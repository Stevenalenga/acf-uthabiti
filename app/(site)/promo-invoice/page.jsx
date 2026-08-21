"use client";

import { useEffect, useState } from "react";
import { Gift, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import {
  PROMO_DISCOUNT,
  formatPromoEndDate,
  isPromoActive,
} from "@/lib/documents/constants";

export default function PromoInvoicePage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const promoActive = isPromoActive();
  const promoEnds = formatPromoEndDate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("code");
    if (fromQuery) setCode(fromQuery);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!email.trim() || !code.trim()) {
      showToast({
        type: "error",
        message: "Enter your registration email and the discount code.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/promo/claim-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, currency }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not request the discounted invoice.");
      }

      setResult(data);
      showToast({ type: "success", message: data.message });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-gradient-to-br from-orange-50 via-white to-green-50 min-h-screen">
      <section className="max-w-xl mx-auto px-4 py-28">
        <div className="bg-white border border-orange-100 shadow-xl rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Gift className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Claim Discount Invoice
              </h1>
              <p className="text-sm text-gray-500">
                For registered participants who have not paid yet
              </p>
            </div>
          </div>

          {promoActive ? (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-900">
              <p className="font-semibold">Limited-time rates</p>
              <p className="mt-1">
                East Africa: <strong>${PROMO_DISCOUNT.fees.eastAfrica} USD</strong>
                {" · "}
                International: <strong>${PROMO_DISCOUNT.fees.other} USD</strong>
              </p>
              <p className="mt-1 text-xs text-green-700">
                Offer ends {promoEnds}. Enter the email from your original
                registration and the special discount code.
              </p>
            </div>
          ) : (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              This discount offer ended on {promoEnds}.
            </div>
          )}

          {result ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-green-900 mb-2">
                New invoice sent
              </h2>
              <p className="text-sm text-green-800 mb-4">{result.message}</p>
              <dl className="text-sm text-left space-y-2 bg-white/70 rounded-lg p-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{result.fullName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium text-gray-900">{result.type}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">New amount</dt>
                  <dd className="font-medium text-gray-900">
                    {result.amountLabel || `$${result.amount} USD`}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Invoice</dt>
                  <dd className="font-medium text-gray-900">
                    {result.invoiceNumber}
                  </dd>
                </div>
              </dl>
              <a
                href="/event-register"
                className="inline-block mt-5 text-sm font-semibold text-orange-700 hover:text-orange-800"
              >
                Return to registration
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    disabled={!promoActive || submitting}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:light] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Discount code*
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter special code"
                    disabled={!promoActive || submitting}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:light] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Registration currency*
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: "USD", label: "Register in USD" },
                    { value: "KES", label: "Register in Kenyan Shillings" },
                  ].map((option) => {
                    const selected = currency === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={!promoActive || submitting}
                        onClick={() => setCurrency(option.value)}
                        className={`flex items-center gap-3 w-full rounded-lg border px-4 py-3 text-left text-sm transition cursor-pointer disabled:opacity-60 ${
                          selected
                            ? "border-orange-600 bg-orange-50 text-orange-900"
                            : "border-gray-300 bg-white text-gray-800"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                            selected
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-gray-400 bg-white"
                          }`}
                          aria-hidden
                        >
                          {selected ? "✓" : ""}
                        </span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={!promoActive || submitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? "Updating invoice…" : "Request discounted invoice"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We’ll email a new invoice at the discounted rate and void your
                previous unpaid invoice.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
