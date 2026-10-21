"use client";

import { useMemo, useState } from "react";
import { Clock, MapPin, UtensilsCrossed, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import {
  PARTNERSHIP_DINNER,
  partnershipDinnerAmountKes,
  partnershipDinnerAmountUsd,
} from "@/lib/dinner";

export default function PartnershipDinnerClient() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [paybillResult, setPaybillResult] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    idNumber: "",
    guests: 1,
    notes: "",
    currency: "KES",
  });

  const guests = Number(form.guests) || 0;
  const amountKes = useMemo(
    () => partnershipDinnerAmountKes(guests),
    [guests]
  );
  const amountUsd = useMemo(
    () => partnershipDinnerAmountUsd(guests),
    [guests]
  );
  const isUsd = form.currency === "USD";
  const accountNumber = form.idNumber.trim() || form.fullName.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      showToast({
        type: "error",
        message: "Name, email, and phone number are required.",
      });
      return;
    }
    if (guests < 1) {
      showToast({
        type: "error",
        message: "Enter at least one guest.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/dinner/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "partnership",
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          organization: form.organization,
          idNumber: form.idNumber,
          guests,
          notes: form.notes,
          currency: form.currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration could not be started.");
      }

      setPaybillResult(data);
      showToast({
        type: "success",
        message: "Your place is reserved. Pay via M-Pesa using the details below.",
      });
      setSubmitting(false);
    } catch (error) {
      showToast({ type: "error", message: error.message });
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-white text-gray-900">
      <section className="bg-[#FFF4F0] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[#E5553C] font-semibold tracking-wide">
            ACFMombasa2026 · Tonight
          </p>
          <h1 className="text-4xl font-bold mt-3">
            Dinner Cruise
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Join fellow delegates and partners for an evening dinner cruise at
            Char-Choma Restaurant. Register below and pay{" "}
            <strong>KES 1,500</strong> or the alternative fee of{" "}
            <strong>USD 12</strong> per person by M-Pesa.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 grid gap-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-2xl p-6">
            <MapPin className="text-[#E5553C]" size={22} />
            <h2 className="text-xl font-bold mt-3">Venue</h2>
            <p className="mt-2 text-gray-700">{PARTNERSHIP_DINNER.venue}</p>
            <p className="mt-1 text-sm text-gray-500">
              {PARTNERSHIP_DINNER.venueDetail}
            </p>
          </div>
          <div className="border border-gray-200 rounded-2xl p-6">
            <Clock className="text-[#E5553C]" size={22} />
            <h2 className="text-xl font-bold mt-3">Time</h2>
            <p className="mt-2 text-gray-700">{PARTNERSHIP_DINNER.dateLabel}</p>
            <p className="mt-1 text-gray-700">{PARTNERSHIP_DINNER.timeLabel}</p>
          </div>
          <div className="border border-gray-200 rounded-2xl p-6">
            <UtensilsCrossed className="text-[#E5553C]" size={22} />
            <h2 className="text-xl font-bold mt-3">Fee</h2>
            <p className="mt-2 text-gray-700">
              <strong>
                KES {PARTNERSHIP_DINNER.feeKes.toLocaleString("en-KE")}
              </strong>{" "}
              per person
            </p>
            <p className="mt-1 text-gray-700">
              Alternative:{" "}
              <strong>USD {PARTNERSHIP_DINNER.feeUsd}</strong> per person
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-8">
          <div className="flex items-center gap-2">
            <Smartphone className="text-[#E5553C]" size={22} />
            <h2 className="text-2xl font-bold">M-Pesa payment</h2>
          </div>
          <p className="mt-3 text-gray-600">
            Payment is by M-Pesa Paybill only.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-gray-700">
            <p>
              Paybill:{" "}
              <strong>{PARTNERSHIP_DINNER.mpesa.paybill}</strong>
            </p>
            <p>
              Account number:{" "}
              <strong>{PARTNERSHIP_DINNER.mpesa.accountHint}</strong>
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            On your phone: Lipa na M-Pesa → Paybill → enter{" "}
            {PARTNERSHIP_DINNER.mpesa.paybill} → enter your name or ID number as
            the account number → enter the amount → PIN.
          </p>
        </div>

        {paybillResult ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-green-800">
              Place reserved
            </h2>
            <p className="mt-3 text-gray-700">
              Complete payment by M-Pesa using the details below. A copy has
              also been emailed to you.
            </p>
            <div className="mt-6 bg-white border rounded-xl p-5 text-gray-700 space-y-2">
              <p>
                Amount: <strong>{paybillResult.amountLabel}</strong>
              </p>
              <p>
                Paybill: <strong>{paybillResult.mpesa.paybill}</strong>
              </p>
              <p>
                Account number:{" "}
                <strong>{paybillResult.accountNumber}</strong>
              </p>
              <p className="text-sm text-gray-500">
                You may use your name or ID number as the account number.
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="border border-gray-200 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold">Register and pay</h2>
            <p className="mt-2 text-gray-600">
              Reserve your place, then pay by M-Pesa Paybill{" "}
              {PARTNERSHIP_DINNER.mpesa.paybill} using your name or ID number as
              the account number.
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
                ID number (optional)
                <input
                  name="idNumber"
                  value={form.idNumber}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Use as M-Pesa account number"
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
                Number of guests*
                <input
                  type="number"
                  min="1"
                  max="20"
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </label>
              <label className="block text-sm md:col-span-2">
                Dietary notes (optional)
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-gray-700">
                Fee
              </legend>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <label className="flex items-start gap-3 border rounded-xl p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="currency"
                    value="KES"
                    checked={form.currency === "KES"}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-semibold">
                      KES {PARTNERSHIP_DINNER.feeKes.toLocaleString("en-KE")}
                    </span>
                    <span className="block text-sm text-gray-500">
                      Per person
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 border rounded-xl p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="currency"
                    value="USD"
                    checked={form.currency === "USD"}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-semibold">
                      USD {PARTNERSHIP_DINNER.feeUsd}
                    </span>
                    <span className="block text-sm text-gray-500">
                      Alternative fee per person
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>

            <p className="mt-6 text-lg font-semibold">
              Total:{" "}
              {isUsd
                ? `USD ${amountUsd.toFixed(2)}`
                : `KES ${amountKes.toLocaleString("en-KE")}`}
              <span className="text-gray-500 font-normal text-base">
                {" "}
                ({guests} {guests === 1 ? "guest" : "guests"})
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              M-Pesa Paybill <strong>{PARTNERSHIP_DINNER.mpesa.paybill}</strong>
              {accountNumber ? (
                <>
                  {" "}
                  · Account number: <strong>{accountNumber}</strong>
                </>
              ) : (
                <> · Account number: your name or ID number</>
              )}
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 inline-flex bg-[#E5553C] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#cf4b35] disabled:opacity-60"
            >
              {submitting ? "Please wait..." : "Reserve and get M-Pesa details"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
