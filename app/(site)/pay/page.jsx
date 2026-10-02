"use client";

import { useState } from "react";
import {
  CreditCard,
  Mail,
  Hash,
  ArrowLeft,
  Search,
  Send,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const MODES = [
  { id: "pay", label: "Pay invoice" },
  { id: "find_invoice", label: "Find invoice #" },
  { id: "find_email", label: "Find email" },
  { id: "resend", label: "Resend invoice" },
];

function formatAmount(amount, currency) {
  if (currency === "KES") {
    return `KES ${Number(amount).toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${Number(amount).toFixed(2)} USD`;
}

export default function PayInvoicePage() {
  const { showToast } = useToast();
  const [mode, setMode] = useState("pay");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [foundInvoices, setFoundInvoices] = useState([]);
  const [foundEmail, setFoundEmail] = useState(null);

  const resetResults = () => {
    setRegistration(null);
    setFoundInvoices([]);
    setFoundEmail(null);
  };

  const switchMode = (next) => {
    setMode(next);
    resetResults();
  };

  const handlePayLookup = async (e) => {
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

  const handleFindInvoice = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast({
        type: "error",
        message: "Enter the email you used when registering.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setFoundInvoices([]);
      const res = await fetch("/api/payment/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "find_by_email", email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No invoice found for that email.");
      }

      setFoundInvoices(data.invoices || []);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFindEmail = async (e) => {
    e.preventDefault();

    if (!invoiceNumber.trim()) {
      showToast({
        type: "error",
        message: "Enter your registration / invoice number.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setFoundEmail(null);
      const res = await fetch("/api/payment/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "find_by_invoice",
          invoiceNumber,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not find that invoice.");
      }

      setFoundEmail(data);
      setInvoiceNumber(data.invoiceNumber || invoiceNumber);
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast({
        type: "error",
        message: "Enter the email you used when registering.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/payment/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend_invoice", email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not resend the invoice.");
      }

      showToast({
        type: "success",
        message:
          data.message ||
          "If we find an unpaid registration, the invoice will be emailed shortly.",
      });

      if (data.invoiceNumbers?.[0]) {
        setInvoiceNumber(data.invoiceNumbers[0]);
      }
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const useFoundInvoice = (invoice) => {
    setInvoiceNumber(invoice.invoiceNumber);
    setMode("pay");
    setFoundInvoices([]);
    showToast({
      type: "success",
      message: `Invoice ${invoice.invoiceNumber} ready. Confirm your email and continue to pay.`,
    });
  };

  const useFoundEmail = () => {
    if (!foundEmail?.email) return;
    setEmail(foundEmail.email);
    setInvoiceNumber(foundEmail.invoiceNumber || invoiceNumber);
    setMode("pay");
    setFoundEmail(null);
    showToast({
      type: "success",
      message: "Email filled in. You can now continue to pay.",
    });
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
                    {formatAmount(registration.amount, registration.currency)}
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
            <div className="space-y-5">
              <div
                className="grid grid-cols-2 gap-2"
                role="tablist"
                aria-label="Payment help options"
              >
                {MODES.map((item) => {
                  const active = mode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => switchMode(item.id)}
                      className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                        active
                          ? "bg-orange-600 text-white"
                          : "bg-orange-50 text-orange-900 hover:bg-orange-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {mode === "pay" ? (
                <form onSubmit={handlePayLookup} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter the invoice number and registration email from your
                    invoice to continue to payment.
                  </p>

                  <InvoiceField
                    value={invoiceNumber}
                    onChange={setInvoiceNumber}
                    disabled={submitting}
                  />
                  <EmailField
                    value={email}
                    onChange={setEmail}
                    disabled={submitting}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting
                      ? "Looking up registration…"
                      : "Find My Registration"}
                  </button>
                </form>
              ) : null}

              {mode === "find_invoice" ? (
                <form onSubmit={handleFindInvoice} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Forgot your invoice number? Enter the email you used to
                    register and we will look it up.
                  </p>

                  <EmailField
                    value={email}
                    onChange={setEmail}
                    disabled={submitting}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    {submitting ? "Searching…" : "Find invoice number"}
                  </button>

                  {foundInvoices.length > 0 ? (
                    <div className="space-y-3">
                      {foundInvoices.map((invoice) => (
                        <div
                          key={invoice.invoiceNumber}
                          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm"
                        >
                          <p className="font-semibold text-green-900">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-green-800 mt-1">
                            {invoice.fullName} ·{" "}
                            {formatAmount(invoice.amount, invoice.currency)}
                          </p>
                          <button
                            type="button"
                            onClick={() => useFoundInvoice(invoice)}
                            className="mt-3 text-sm font-semibold text-orange-700 hover:text-orange-800 cursor-pointer"
                          >
                            Use this invoice to pay →
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </form>
              ) : null}

              {mode === "find_email" ? (
                <form onSubmit={handleFindEmail} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Forgot which email you registered with? Enter your invoice
                    number and we will show the matching email.
                  </p>

                  <InvoiceField
                    value={invoiceNumber}
                    onChange={setInvoiceNumber}
                    disabled={submitting}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    {submitting ? "Searching…" : "Find registration email"}
                  </button>

                  {foundEmail ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm space-y-2">
                      <p className="text-green-900">
                        <span className="font-semibold">Invoice:</span>{" "}
                        {foundEmail.invoiceNumber}
                      </p>
                      <p className="text-green-900">
                        <span className="font-semibold">Email:</span>{" "}
                        {foundEmail.email}
                      </p>
                      <p className="text-xs text-green-800">
                        Hint: {foundEmail.emailMasked}
                      </p>
                      <button
                        type="button"
                        onClick={useFoundEmail}
                        className="mt-2 text-sm font-semibold text-orange-700 hover:text-orange-800 cursor-pointer"
                      >
                        Use this email to pay →
                      </button>
                    </div>
                  ) : null}
                </form>
              ) : null}

              {mode === "resend" ? (
                <form onSubmit={handleResend} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter your registration email and we will resend the unpaid
                    invoice PDF to your inbox.
                  </p>

                  <EmailField
                    value={email}
                    onChange={setEmail}
                    disabled={submitting}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Sending…" : "Email me my invoice"}
                  </button>
                </form>
              ) : null}

              <p className="text-xs text-gray-500 text-center">
                Not registered yet?{" "}
                <a
                  href="/event-register"
                  className="font-semibold text-orange-700 hover:text-orange-800"
                >
                  Register here
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function InvoiceField({ value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1">
        Registration / Invoice number*
      </label>
      <div className="relative">
        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. ACF2026/086/2026"
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:light] disabled:opacity-60"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        As shown on your invoice (e.g. ACF2026/086/2026). Dashes are also
        accepted.
      </p>
    </div>
  );
}

function EmailField({ value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1">
        Registration email*
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@example.com"
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:light] disabled:opacity-60"
        />
      </div>
    </div>
  );
}
