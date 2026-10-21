"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { TAMARIND_DINNER, dinnerAmountKes } from "@/lib/dinner";

export default function TamarindDinnerPage() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    adults: 1,
    children: 0,
  });

  const amountKes = useMemo(
    () => dinnerAmountKes(Number(form.adults) || 0, Number(form.children) || 0),
    [form.adults, form.children]
  );
  const amountUsd =
    (Number(form.adults) || 0) * TAMARIND_DINNER.adultUsd +
    (Number(form.children) || 0) * TAMARIND_DINNER.childUsd;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitRequest = async (payNow, existingReference) => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      showToast({
        type: "error",
        message: "Name, email, and phone number are required.",
      });
      return;
    }
    if (amountKes < 1) {
      showToast({
        type: "error",
        message: "Add at least one adult or child.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/dinner/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          adults: Number(form.adults),
          children: Number(form.children),
          payNow,
          reference: existingReference || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not submit your dinner request.");
      }
      if (payNow && data.authorization_url) {
        window.location.href = data.authorization_url;
        return;
      }
      setResult(data);
      showToast({
        type: "success",
        message: "Your dinner request has been sent to the ACF secretariat.",
      });
      setSubmitting(false);
    } catch (error) {
      showToast({ type: "error", message: error.message });
      setSubmitting(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    submitRequest(false);
  };

  return (
    <main className="bg-white text-gray-900">
      <section className="bg-[#FFF4F0] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[#E5553C] font-semibold tracking-wide">
            ACFMombasa2026 · Optional evening
          </p>
          <h1 className="text-4xl font-bold mt-3">Tamarind Dhow Dinner Cruise</h1>
          <p className="mt-4 text-lg text-gray-600">
            A sunset dinner cruise for delegates, departing from Tamarind Dhow
            Jetty, Nyali. The route, tide permitting, passes Fort Jesus and Old
            Port Mombasa, then continues into Tudor Creek and under Nyali Bridge.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 grid gap-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Rate</h2>
            <p className="mt-3 text-gray-700">
              Adults: <strong>US$60</strong> / <strong>KES 7,764</strong> per person
            </p>
            <p className="mt-2 text-gray-700">
              Children under 12: <strong>US$30</strong> / <strong>KES 3,882</strong>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Includes a welcome drink, a four-course set meal, and live
              entertainment.
            </p>
          </div>
          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Timing</h2>
            <p className="mt-3 text-gray-700">Arrival and boarding from 6:00pm.</p>
            <p className="mt-2 text-gray-700">Sail time 6:30pm – 10:00pm.</p>
            <a
              href={TAMARIND_DINNER.pdfPath}
              download
              className="inline-flex items-center gap-2 mt-6 text-[#E5553C] font-semibold hover:underline"
            >
              <Download size={18} />
              Download the delegate guide
            </a>
          </div>
        </div>

        {result ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-green-800">
              Request received
            </h2>
            <p className="mt-3 text-gray-700">
              Your Tamarind Dhow dinner request has been sent to{" "}
              <strong>acf@uthabitiafrica.org</strong> and saved on the
              participants list as Dinner.
            </p>
            <div className="mt-6 bg-white border rounded-xl p-5 text-gray-700 space-y-2">
              <p>
                Adults: <strong>{form.adults}</strong>
              </p>
              <p>
                Children under 12: <strong>{form.children}</strong>
              </p>
              <p>
                Amount:{" "}
                <strong>KES {Number(result.amountKes).toLocaleString("en-KE")}</strong>
              </p>
              <p>
                Reference:{" "}
                <strong className="break-all">{result.reference}</strong>
              </p>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={() => submitRequest(true, result.reference)}
              className="mt-6 inline-flex bg-[#E5553C] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#cf4b35] disabled:opacity-60"
            >
              {submitting ? "Starting payment..." : "Pay now"}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleRegister}
            className="border border-gray-200 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold">Register for the cruise</h2>
            <p className="mt-2 text-gray-600">
              Submit your request here. It is emailed to the ACF secretariat and
              saved on the participants page as Dinner.
            </p>

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
              <label className="block text-sm">
                Adults
                <input
                  type="number"
                  min="0"
                  max="20"
                  name="adults"
                  value={form.adults}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                Children under 12
                <input
                  type="number"
                  min="0"
                  max="20"
                  name="children"
                  value={form.children}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
            </div>

            <p className="mt-6 text-lg font-semibold">
              Total: KES {amountKes.toLocaleString("en-KE")}{" "}
              <span className="text-gray-500 font-normal text-base">
                (US${amountUsd})
              </span>
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex bg-[#E5553C] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#cf4b35] disabled:opacity-60"
              >
                {submitting ? "Sending request..." : "Submit request"}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => submitRequest(true)}
                className="inline-flex border border-[#E5553C] text-[#E5553C] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#FFF4F0] disabled:opacity-60"
              >
                Submit and pay now
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
