"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import FormInput from "@/components/registration/FormInput";
import FormSelect from "@/components/registration/FormSelect";
import FormSection from "@/components/registration/FormSection";
import {
  KE_GOVERNMENT_OFFICIAL_FEE_KES,
  formatInvoiceAmount,
  keGovernmentOfficialUsdAmount,
} from "@/lib/documents/constants";

const COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita-Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi",
];

export default function GovernmentForm() {
  const { showToast } = useToast();
  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    title: "",
    address: "",
    county: "",
    department: "",
    invoiceCurrency: "KES",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Name is required";
    if (!form.email.trim()) next.email = "Email address is required";
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.address.trim()) next.address = "Address is required";
    if (!form.county) next.county = "County is required";
    if (!form.department.trim()) next.department = "Department is required";
    if (form.invoiceCurrency !== "USD" && form.invoiceCurrency !== "KES") {
      next.invoiceCurrency = "Select USD or KES";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast({ type: "error", message: "Please complete the required fields." });
      return;
    }

    try {
      setSubmit(true);
      const res = await fetch("/api/event/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          title: form.title,
          address: form.address,
          county: form.county,
          department: form.department,
          governmentOfficial: true,
          invoiceCurrency: form.invoiceCurrency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");

      sessionStorage.setItem("participantId", data.participantId);
      localStorage.setItem("participantId", data.participantId);

      if (data.paymentStatus === "SUCCESS") {
        window.location.href = `/payment-success?reference=${data.reference || ""}`;
        return;
      }

      fetch("/api/payment/invoice-currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: data.participantId,
          currency: form.invoiceCurrency,
        }),
      }).catch(() => {});

      const paymentRes = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: data.participantId }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok || !paymentData.authorization_url) {
        throw new Error(
          paymentData.error ||
            "Registration saved, but payment could not start. Please try again."
        );
      }

      sessionStorage.setItem("paymentInProgress", "true");
      window.location.href = paymentData.authorization_url;
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setSubmit(false);
    }
  };

  return (
    <main className="bg-white min-h-screen text-gray-900">
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Kenyan Government Officials Registration
        </h1>
        <p className="text-gray-600 mb-6">
          This link is only for Kenyan government officials.
        </p>

        <div className="mb-8 bg-orange-50 border border-orange-200 p-5 rounded-xl">
          <h2 className="font-semibold text-orange-800">
            Kenyan government officials only
          </h2>
          <p className="text-sm text-orange-900 mt-1">
            This registration link is only for use by Kenyan government
            officials. The special fee is{" "}
            <strong>
              KES {KE_GOVERNMENT_OFFICIAL_FEE_KES.toLocaleString("en-KE")}
            </strong>
            .
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          <FormSection
            title="Official details"
            description="Enter the official's name, title, address, county, and department."
          >
            <FormInput
              label="Name*"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Full name"
            />
            <FormInput
              label="Title*"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="For example, CEC or Director"
            />
            <FormInput
              label="Email address*"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Email for the invoice"
              helper="The invoice is sent to this address."
            />
            <FormInput
              span
              label="Address*"
              name="address"
              value={form.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Postal or office address"
            />
            <FormSelect
              label="County*"
              name="county"
              value={form.county}
              onChange={handleChange}
              error={errors.county}
              options={[
                { label: "- Select county -", value: "" },
                { label: "National Government", value: "National Government" },
                ...COUNTIES.map((county) => ({ label: county, value: county })),
              ]}
            />
            <FormInput
              label="Department*"
              name="department"
              value={form.department}
              onChange={handleChange}
              error={errors.department}
              placeholder="Ministry or department"
            />
          </FormSection>

          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <p className="text-sm text-gray-600 text-center">
              Kenyan government official fee
            </p>
            <p className="text-2xl font-bold text-orange-600 text-center mt-1">
              {form.invoiceCurrency === "USD"
                ? formatInvoiceAmount(keGovernmentOfficialUsdAmount(), "USD")
                : `KES ${KE_GOVERNMENT_OFFICIAL_FEE_KES.toLocaleString("en-KE")}`}
            </p>
            <p className="text-sm font-medium text-gray-900 mt-4 mb-3">
              Pay in*
            </p>
            <div className="flex flex-col gap-2">
              {[
                {
                  value: "KES",
                  label: `Kenyan Shillings · KES ${KE_GOVERNMENT_OFFICIAL_FEE_KES.toLocaleString("en-KE")}`,
                },
                {
                  value: "USD",
                  label: `US Dollars · ${formatInvoiceAmount(keGovernmentOfficialUsdAmount(), "USD")}`,
                },
              ].map((option) => {
                const selected = form.invoiceCurrency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        invoiceCurrency: option.value,
                      }))
                    }
                    className={`flex items-center gap-3 w-full rounded-lg border px-4 py-3 text-left text-sm cursor-pointer ${
                      selected
                        ? "border-orange-600 bg-white text-orange-900"
                        : "border-gray-200 bg-white text-gray-800"
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
            {errors.invoiceCurrency && (
              <p className="mt-2 text-sm text-red-600">{errors.invoiceCurrency}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={submit}
              className="inline-flex items-center justify-center bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition disabled:opacity-60 cursor-pointer"
            >
              {submit ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
