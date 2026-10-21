"use client";

import { useState } from "react";
import { MonitorPlay, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { LIVESTREAM, livestreamKesAmount } from "@/lib/livestream";
import { FAMILY_BANK_USD_TO_KES } from "@/lib/documents/constants";

const AMOUNT_KES = livestreamKesAmount(LIVESTREAM.usd);

export default function LivestreamCheckout() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
  });
  const [resendEmail, setResendEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      showToast({
        type: "error",
        message: "Name, email, and phone number are required.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/livestream/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error || "Payment could not be started.");
      }
      window.location.href = data.authorization_url;
    } catch (error) {
      showToast({ type: "error", message: error.message });
      setSubmitting(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      showToast({
        type: "error",
        message: "Enter the email you used when paying.",
      });
      return;
    }

    try {
      setResending(true);
      const res = await fetch("/api/livestream/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not resend the emails.");
      }
      showToast({
        type: "success",
        message:
          data.message ||
          "If we find a paid purchase, the invoice and livestream link will be emailed shortly.",
      });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="bg-white text-gray-900">
      <section className="bg-[#FFF4F0] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[#E5553C] font-semibold tracking-wide">
            ACFMombasa2026 · Virtual access
          </p>
          <h1 className="text-4xl font-bold mt-3">Stream the conference live</h1>
          <p className="mt-4 text-lg text-gray-600">
            Join the Africa Childcare Forum from anywhere. Pay{" "}
            <strong>US$120</strong> for livestream access on {LIVESTREAM.datesLabel}.
            After payment we email your paid invoice and a personal link to the live
            stream.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 grid gap-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold">What you receive</h2>
            <ul className="mt-4 space-y-3 text-gray-700">
              {[
                "Livestream access for the forum (13–15 October 2026)",
                "Paid invoice emailed immediately after payment",
                "A personal livestream link emailed to you",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2
                    className="h-5 w-5 text-[#E5553C] shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Fee</h2>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">
              US${LIVESTREAM.usd}
            </p>
            <p className="mt-2 text-gray-700">
              Charged as{" "}
              <strong>KES {AMOUNT_KES.toLocaleString("en-KE")}</strong> at
              checkout (Family Bank rate KES {FAMILY_BANK_USD_TO_KES} = US$1).
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Pay by card, M-Pesa, or bank transfer. This is virtual access only
              and does not include in-person registration in Mombasa.
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePay}
          className="border border-gray-200 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#FFF4F0] flex items-center justify-center">
              <MonitorPlay className="h-6 w-6 text-[#E5553C]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Pay for livestream access</h2>
              <p className="text-gray-600">
                We will send the invoice and stream link to the email you enter
                below.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <label className="block text-sm">
              Full name*
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </label>
            <label className="block text-sm">
              Email*
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </label>
            <label className="block text-sm">
              Phone / WhatsApp*
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </label>
            <label className="block text-sm">
              Organisation
              <input
                name="organization"
                value={form.organization}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </label>
          </div>

          <p className="mt-6 text-lg font-semibold">
            Total: US${LIVESTREAM.usd}{" "}
            <span className="text-gray-500 font-normal text-base">
              (KES {AMOUNT_KES.toLocaleString("en-KE")})
            </span>
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex bg-[#E5553C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#cf4b35] disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Starting payment..." : "Pay US$120 now"}
          </button>
        </form>

        <form
          onSubmit={handleResend}
          className="bg-[#FFF4F0] rounded-2xl p-8"
        >
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#E5553C]" />
            <h2 className="text-xl font-bold">Already paid?</h2>
          </div>
          <p className="mt-2 text-gray-700">
            Enter the email you used at checkout and we will resend your invoice
            and livestream link.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white"
              required
            />
            <button
              type="submit"
              disabled={resending}
              className="inline-flex justify-center bg-[#E5553C] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#cf4b35] disabled:opacity-60 cursor-pointer"
            >
              {resending ? "Sending…" : "Resend emails"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
