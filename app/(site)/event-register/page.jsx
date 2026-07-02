"use client";

import { useState, useEffect } from "react";
import { countryCodes } from "@/lib/countryCodes";
import { Calendar, Clock, Info } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

// Fee structure based on registration phase and participant type
const FEES = {
  EarlyBird: { student: 60, eastAfrica: 300, other: 375 },
  Regular: { student: 75, eastAfrica: 350, other: 425 },
  LateOnsite: { student: 90, eastAfrica: 400, other: 475 },
};

export default function RegistrationPage() {
  const [step, setStep] = useState("registration");
  const { showToast } = useToast();
  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    country: "",
    profession: "",
    otherProfession: "",
    visaInfo: "",
    phase: "",
    type: "",
    accessibility: [],
    otherAccessibility: "",
    requiredTranslation: "",
    dietaryRestrictions: [],
    otherDietaryRestrictions: "",
    mediaConsent: "",
    reportConsent: "",
    emergencyContact: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.profession) newErrors.profession = "Profession is required";
    if (!form.phase) newErrors.phase = "Registration phase is required";
    if (!form.type) newErrors.type = "Registration type is required";
    if (!form.mediaConsent) newErrors.mediaConsent = "Please select an option";

    if (!form.accessibility || form.accessibility.length === 0)
      newErrors.accessibility = "Select at least one accessibility option";

    if (!form.dietaryRestrictions || form.dietaryRestrictions.length === 0)
      newErrors.dietaryRestrictions = "Select at least one dietary option";

    if (!form.mediaConsent) newErrors.mediaConsent = "Please choose one option";

    if (!form.reportConsent) newErrors.reportConsent = "Please choose one option";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fee = form.phase && form.type ? FEES[form.phase]?.[form.type] : null;

  // Progress steps 

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    showToast({
      type: "error",
      message: "All fields are required",
    });
    return;
  }

  try {
    setSubmit(true);

    const res = await fetch("/api/event/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        amount: fee,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    sessionStorage.setItem("participantId", data.participantId);
    localStorage.setItem("participantId", data.participantId);

    const { participantId, paymentStatus } = data;

    /* ---------------- HANDLE STATUS ---------------- */

    if (paymentStatus === "SUCCESS") {
      sessionStorage.removeItem("paymentInProgress");
      sessionStorage.removeItem("participantId");
      localStorage.removeItem("participantId");
      window.location.href = `/payment-success?reference=${data.reference}`;
      return;
    }

    if (form.phase === "LateOnsite") {
      sessionStorage.removeItem("paymentInProgress");
      sessionStorage.removeItem("participantId");
      localStorage.removeItem("participantId");
      setStep("confirmation");
      return;
    }

    // If PENDING or FAILED reinitialize
    setStep("payment");

    const paymentRes = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participantId }),
    });

    const paymentData = await paymentRes.json();

    sessionStorage.setItem("paymentInProgress", "true");

    window.location.href = paymentData.authorization_url;

  } catch (error) {
    setStep("registration");

    showToast({
      type: "error",
      message: error.message,
    });

  } finally {
    setSubmit(false);
  }
};

useEffect(() => {
  const inProgress = sessionStorage.getItem("paymentInProgress");

  if (!inProgress) return;
  setStep("payment_retry");
}, []);


const handleRetryPayment = async () => {
  try {
    const participantId =
  sessionStorage.getItem("participantId") ||
  localStorage.getItem("participantId");

    if (!participantId) {
      showToast({ type: "error", message: "Session expired" });
      return;
    }

    setStep("payment");

    const res = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participantId }),
    });

    const data = await res.json();

    window.location.href = data.authorization_url;

  } catch (err) {
    showToast({ type: "error", message: "Retry failed" });
  }
};

const handleCancelPayment = async () => {
  try {
    const participantId =
  sessionStorage.getItem("participantId") ||
  localStorage.getItem("participantId");

    if (!participantId) return;

    await fetch("/api/payment/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participantId }),
    });

      sessionStorage.removeItem("paymentInProgress");
      sessionStorage.removeItem("participantId");
      localStorage.removeItem("participantId");

    setStep("registration");

    showToast({
      type: "info",
      message: "Payment cancelled",
    });

  } catch {
    showToast({
      type: "error",
      message: "Could not cancel payment",
    });
  }
};

  const ProgressSteps = () => {

    const steps = [
      { id: "registration", label: "Registration" },
      { id: "payment", label: "Payment" },
      { id: "confirmation", label: "Confirmation" },
    ];

    const index = steps.findIndex((s) => s.id === step);

    return (
      <div className="flex justify-center gap-12 mb-12">

        {steps.map((s, i) => {

          const active = i <= index;

          return (
            <div key={s.id} className="flex items-center gap-3">

              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold
                ${active ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {i + 1}
              </div>

              <span
                className={`text-sm font-medium
                ${active ? "text-orange-600" : "text-gray-400"}`}
              >
                {s.label}
              </span>

            </div>
          );

        })}

      </div>
    );
  };

  // Payment step
  if (step === "payment") {

    return (
      <section className="max-w-xl mx-auto py-28 text-center">

        <ProgressSteps />

        <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-6" />

        <h2 className="text-xl font-semibold mb-2">
          Initializing Secure Payment
        </h2>

        <p className="text-gray-600">
          Preparing your payment session...
        </p>

        <p className="text-sm text-gray-500 mt-4">
          You can pay with card, M-Pesa, or bank transfer.
        </p>

        <p className="text-gray-600 mt-4">
         If nothing happens, please wait or retry.
        </p>

      </section>
    );

  }

  if (step === "payment_retry") {
  return (
    <section className="max-w-xl mx-auto py-28 text-center">

      <ProgressSteps />

      <div className="bg-yellow-50 border border-yellow-200 p-10 rounded-xl">

        <h2 className="text-2xl font-bold text-yellow-700 mb-4">
          Payment Not Completed
        </h2>

        <p className="text-gray-700 mb-6">
          If you closed the payment window or something went wrong,
          you can retry or cancel your payment.
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={handleRetryPayment}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 cursor-pointer"
          >
            Retry Payment
          </button>

          <button
            onClick={handleCancelPayment}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>

        </div>

      </div>

    </section>
  );
}

  // Confirm step
   if (step === "confirmation") {

    return (
      <section className="max-w-xl mx-auto py-28 text-center">

        <ProgressSteps />

        <div className="bg-green-50 border border-green-200 p-10 rounded-xl">

          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Registration Successful
          </h2>

          <p className="text-gray-700 mb-4">
            Your registration has been successfully submitted.
          </p>

          <p className="text-gray-700">
            Payment will be completed onsite during conference check-in.
          </p>

          <p className="text-sm text-gray-500 mt-4">
            A confirmation email has been sent to {form.email}
          </p>

        </div>

      </section>
    );

  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-22">
      <ProgressSteps />
      <h1 className="text-3xl font-bold mb-2">Conference Registration</h1>
      <p className="text-gray-600 mb-10">
        Please complete the form below to register for the conference.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input placeholder="Full Name" required label="Full Name*" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
        <Input placeholder="Email Address" required label="Email Address*" name="email" value={form.email} onChange={handleChange} type="email" error={errors.email} />

        <Input placeholder="Phone Number" required label="Phone Number*" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
        <Input placeholder="Organization" required label="Organization" name="organization" value={form.organization} onChange={handleChange} error={errors.organization}/>

        <CountrySelect
          label="Country*"
          name="country"
          value={form.country}
          onChange={handleChange}
          error={errors.country}
        />
        <Select
          label="Which sector or industry best describes your professional background?"
          name="profession"
          value={form.profession}
          onChange={handleChange}
          options={[
            { label: "- select profession -", value: "" },
            {label: "Philanthropy", value: "Philanthropy"},
            { label: "Private Sector", value: "PrivateSector" },
            { label: "Academia", value: "Academia" },
            { label: "NGO Practitioner", value: "NGO Practitioner" },
            { label: "Government", value: "Government" },
            { label: "Other", value: "Other" },
          ]}
          error={errors.profession}
        />

        {form.profession === "Other" && (
          <Input
            span
            label="Specify Profession"
            name="otherProfession"
            value={form.otherProfession}
            onChange={handleChange}
          />
        )}

        <Textarea
          span
          label="Do you require a visa invitation letter to facilitate your travel to Kenya, and if so, kindly provide your passport details 
          for official processing? (Details will be used strictly for visa support.)"
          name="visaInfo"
          value={form.visaInfo}
          onChange={handleChange}
        />

        <CheckboxGroup
          span
          label="Do you have any disabilities or accessibility needs that we should be aware of in order to ensure you can fully participate in the conference? 
          (Please select what apply and specify any additional needs)."
          name="accessibility"
          value={form.accessibility}
          onChange={handleChange}
          required
          error={errors.accessibility}
          options={[
            { label: "None", value: "None" },
            { label: "Wheelchair Access", value: "Wheelchair" },
            { label: "Sign Language Interpreter", value: "SignLanguage" },
            { label: "Braille Materials", value: "Braille" },
            { label: "Other", value: "Other" },
          ]}
        />

        {form.accessibility.includes("Other") && (
          <Input
            span
            label="Other Accessibility Needs"
            name="otherAccessibility"
            value={form.otherAccessibility}
            onChange={handleChange}
          />
        )}

        <Input
            span
            label="If you require translation, please specify the language(s) you need."
            name="requiredTranslation"
            value={form.requiredTranslation}
            onChange={handleChange}
          />

        <CheckboxGroup
          span
          label="Do you have any dietary restrictions?"
          name="dietaryRestrictions"
          value={form.dietaryRestrictions}
          required
          onChange={handleChange}
          options={[
            { label: "None", value: "None" },
            { label: "Vegetarian", value: "Vegetarian" },
            { label: "Vegan", value: "Vegan" },
            { label: "Halal", value: "Halal" },
            { label: "Gluten-Free", value: "GlutenFree" },
            { label: "Lactose-Free", value: "LactoseFree" },
            { label: "Other", value: "Other" },
          ]}
          error={errors.dietaryRestrictions}
        />
        {form.dietaryRestrictions.includes("Other") && (
          <Input
            span
            label="Other Dietary Restrictions"
            name="otherDietaryRestrictions"
            value={form.otherDietaryRestrictions}
            onChange={handleChange}
          />
        )}

        <RadioGroup
          span
          label="We are privacy-conscious especially in this age of rapid digitalization and to that effect, we wish to request your permission to use any
           photographs/video/sound recordings captured of you in our printed and electronic media, including the internet for educational or promotional purposes. 
           If you would like to be exempted, please let us know."
          name="mediaConsent"
          value={form.mediaConsent}
          onChange={handleChange}
          required
          options={[
            { label: "Yes, I Allow", value: "Yes" },
            { label: "No, Excempt Me", value: "No" },
          ]}
          error={errors.mediaConsent}
        />

        <RadioGroup
          span
          label="Are you interested in receiving post-conference reports, whitepapers, and research publications related to philanthropy trends discussed at the conference? (Select Yes or No)."
          name="reportConsent"
          value={form.reportConsent}
          onChange={handleChange}
          required
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          error={errors.reportConsent}
        />

        <Textarea
          span
          label="Emergency Contact Information (Name, Relationship, Phone Number)"  
          name="emergencyContact"
          value={form.emergencyContact}
          onChange={handleChange}
        />

        <div className="md:col-span-2 bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <Info className="text-orange-600 w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-700 mb-2">Registration Timeline</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Early Bird: Jan 15 – Mar 31, 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Regular: Apr 1 – Jun 30, 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Late / On-site: Jul 1 – Aug 10, 2026</span>
              </li>
            </ul>
          </div>
        </div>

        <Select
          label="Registration Phase*"
          name="phase"
          value={form.phase}
          onChange={handleChange}
          required
          options={[
            { label: "- Select phase -", value: "" },
            { label: "Early Bird", value: "EarlyBird" },
            { label: "Regular", value: "Regular" },
            { label: "Late / On-site", value: "LateOnsite" },
          ]}
          error={errors.phase}
        />

        <Select
          label="Registration Type*"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          options={[
            { label: "- Select type -", value: "" },
            { label: "Student", value: "student" },
            { label: "East Africa Participant", value: "eastAfrica" },
            { label: "Other Participant", value: "other" },
          ]}
          error={errors.type}
        />

        {fee && (
          <div className="md:col-span-2 bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Registration Fee</p>
            <p className="text-2xl font-bold text-orange-600">${fee}</p>
          </div>
        )}

        <button
        
          type="submit"
          disabled={submit}
          className="md:col-span-2 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer"
        >

          {submit ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Submitting...
            </>
          ) : (
            "Submit Registration"
          )}

        </button>

      </form>
    </section>
  );
}

/* ------------------ COMPONENTS ------------------ */

const Input = ({ label, name, value, onChange, type = "text", span, error, placeholder }) => (
  <div className={span ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-lg border px-3 py-2 text-sm ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

const Textarea = ({ label, name, value, onChange, span }) => (
  <div className={span ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      rows={4}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options, span, error }) => (
  <div className={span ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-lg border px-3 py-2 text-sm ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

const CountrySelect = ({ label, name, value, onChange, error, span }) => (
  <div className={span ? "md:col-span-2" : ""}>
    <label className="text-xs text-gray-600 mb-1 block">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="">- select country -</option>
      {countryCodes.map((country) => (
        <option key={country.name} value={country.name}>
          {country.name}
        </option>
      ))}
    </select>

    {error && (
      <p className="text-red-500 text-xs mt-1">
        {error}
      </p>
    )}
  </div>
);

const CheckboxGroup = ({ label, name, value = [], onChange, options, error }) => {
  const toggle = (v) => {
    const updated = value.includes(v)
      ? value.filter((x) => x !== v)
      : [...value, v];
    onChange({ target: { name, value: updated } });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={value.includes(o.value)}
              onChange={() => toggle(o.value)}
              className="accent-orange-600"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const RadioGroup = ({ label, name, value, onChange, options, span, error }) => (
  <div className={span ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <div className="flex gap-6">
      {options.map((o) => (
        <label key={o.value} className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={onChange}
            className="accent-orange-600"
          />
          {o.label}
        </label>
      ))}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);