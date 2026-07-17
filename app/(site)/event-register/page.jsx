"use client";

import { useState, useEffect } from "react";
import { Calendar, Info } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import FormInput from "@/components/registration/FormInput";
import FormTextarea from "@/components/registration/FormTextarea";
import FormSelect from "@/components/registration/FormSelect";
import CountryCombobox from "@/components/registration/CountryCombobox";
import CheckboxGroup from "@/components/registration/CheckboxGroup";
import RadioGroup from "@/components/registration/RadioGroup";
import FormSection from "@/components/registration/FormSection";
import ProgressSteps from "@/components/registration/ProgressSteps";
import { FEES } from "@/lib/documents/constants";

const FIELD_ORDER = [
  "fullName",
  "email",
  "phone",
  "organization",
  "country",
  "profession",
  "otherProfession",
  "accessibility",
  "dietaryRestrictions",
  "mediaConsent",
  "reportConsent",
  "phase",
  "type",
];

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

  const scrollToFirstError = (newErrors) => {
    const firstField = FIELD_ORDER.find((field) => newErrors[field]);
    if (!firstField) return;

    const el = document.querySelector(`[data-field="${firstField}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const focusable = el.querySelector("input, select, textarea");
      focusable?.focus();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.organization.trim())
      newErrors.organization = "Organization is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.profession) newErrors.profession = "Profession is required";
    if (form.profession === "Other" && !form.otherProfession.trim())
      newErrors.otherProfession = "Please specify your profession";
    if (!form.phase) newErrors.phase = "Registration phase is required";
    if (!form.type) newErrors.type = "Registration type is required";

    if (!form.accessibility || form.accessibility.length === 0)
      newErrors.accessibility = "Select at least one accessibility option";

    if (!form.dietaryRestrictions || form.dietaryRestrictions.length === 0)
      newErrors.dietaryRestrictions = "Select at least one dietary option";

    if (!form.mediaConsent) newErrors.mediaConsent = "Please choose one option";
    if (!form.reportConsent) newErrors.reportConsent = "Please choose one option";

    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, newErrors };
  };

  const fee = form.phase && form.type ? FEES[form.phase]?.[form.type] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { valid, newErrors } = validate();
    if (!valid) {
      showToast({
        type: "error",
        message: "Please fix the highlighted fields",
      });
      scrollToFirstError(newErrors);
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

      setStep("payment");

      const paymentRes = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participantId }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok || !paymentData.authorization_url) {
        setStep("payment_retry");
        showToast({
          type: "warning",
          message:
            paymentData.error ||
            "Registration saved, but payment could not start. Please retry payment.",
        });
        return;
      }

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

      if (!res.ok || !data.authorization_url) {
        showToast({
          type: "error",
          message: data.error || "Retry failed",
        });
        setStep("payment_retry");
        return;
      }

      window.location.href = data.authorization_url;
    } catch {
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

  if (step === "payment") {
    return (
      <main className="bg-white min-h-screen text-gray-900">
        <section className="max-w-xl mx-auto px-6 py-28 text-center">
          <ProgressSteps step={step} />

          <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-6" />

          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Initializing Secure Payment
          </h2>

          <p className="text-gray-600">Preparing your payment session...</p>

          <p className="text-sm text-gray-500 mt-4">
            You can pay with card, M-Pesa, or bank transfer.
          </p>

          <p className="text-gray-600 mt-4">
            If nothing happens, please wait or retry.
          </p>
        </section>
      </main>
    );
  }

  if (step === "payment_retry") {
    return (
      <main className="bg-white min-h-screen text-gray-900">
        <section className="max-w-xl mx-auto px-6 py-28 text-center">
          <ProgressSteps step={step} />

          <div className="bg-yellow-50 border border-yellow-200 p-10 rounded-xl">
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">
              Payment Not Completed
            </h2>

            <p className="text-gray-700 mb-6">
              If you closed the payment window or something went wrong, you can
              retry or cancel your payment.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={handleRetryPayment}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                Retry Payment
              </button>

              <button
                type="button"
                onClick={handleCancelPayment}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (step === "confirmation") {
    return (
      <main className="bg-white min-h-screen text-gray-900">
        <section className="max-w-xl mx-auto px-6 py-28 text-center">
          <ProgressSteps step={step} />

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
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen text-gray-900">
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <ProgressSteps step={step} />
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Conference Registration
        </h1>
        <p className="text-gray-600 mb-10">
          Please complete the form below to register for the conference.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          <FormSection
            title="Personal Details"
            description="Tell us how to reach you and where you are based."
          >
            <FormInput
              placeholder="Full Name"
              label="Full Name*"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <FormInput
              placeholder="Email Address"
              label="Email Address*"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              error={errors.email}
            />
            <FormInput
              placeholder="Phone Number"
              label="Phone Number*"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <FormInput
              placeholder="Organization"
              label="Organization*"
              name="organization"
              value={form.organization}
              onChange={handleChange}
              error={errors.organization}
            />
            <CountryCombobox
              label="Country*"
              name="country"
              value={form.country}
              onChange={handleChange}
              error={errors.country}
            />
          </FormSection>

          <FormSection
            title="Professional Background"
            description="Help us understand your sector and any travel support needs."
          >
            <FormSelect
              label="Professional sector*"
              helper="Which sector or industry best describes your professional background?"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              options={[
                { label: "- select profession -", value: "" },
                { label: "Philanthropy", value: "Philanthropy" },
                { label: "Private Sector", value: "PrivateSector" },
                { label: "Academia", value: "Academia" },
                { label: "NGO Practitioner", value: "NGO Practitioner" },
                { label: "Government", value: "Government" },
                { label: "Other", value: "Other" },
              ]}
              error={errors.profession}
            />

            {form.profession === "Other" && (
              <FormInput
                span
                label="Specify Profession*"
                name="otherProfession"
                value={form.otherProfession}
                onChange={handleChange}
                error={errors.otherProfession}
              />
            )}

            <FormTextarea
              span
              label="Visa invitation letter"
              helper="If you require a visa invitation letter for travel to Kenya, provide your passport details here. Details will be used strictly for visa support."
              name="visaInfo"
              value={form.visaInfo}
              onChange={handleChange}
            />
          </FormSection>

          <FormSection
            title="Accessibility & Preferences"
            description="Share any needs so we can support your full participation."
          >
            <CheckboxGroup
              span
              label="Accessibility needs*"
              helper="Select all that apply and specify any additional needs."
              name="accessibility"
              value={form.accessibility}
              onChange={handleChange}
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
              <FormInput
                span
                label="Other Accessibility Needs"
                name="otherAccessibility"
                value={form.otherAccessibility}
                onChange={handleChange}
              />
            )}

            <FormInput
              span
              label="Translation requirements"
              helper="If you require translation, specify the language(s) you need."
              name="requiredTranslation"
              value={form.requiredTranslation}
              onChange={handleChange}
            />

            <CheckboxGroup
              span
              label="Dietary restrictions*"
              name="dietaryRestrictions"
              value={form.dietaryRestrictions}
              onChange={handleChange}
              error={errors.dietaryRestrictions}
              options={[
                { label: "None", value: "None" },
                { label: "Vegetarian", value: "Vegetarian" },
                { label: "Vegan", value: "Vegan" },
                { label: "Halal", value: "Halal" },
                { label: "Gluten-Free", value: "GlutenFree" },
                { label: "Lactose-Free", value: "LactoseFree" },
                { label: "Other", value: "Other" },
              ]}
            />

            {form.dietaryRestrictions.includes("Other") && (
              <FormInput
                span
                label="Other Dietary Restrictions"
                name="otherDietaryRestrictions"
                value={form.otherDietaryRestrictions}
                onChange={handleChange}
              />
            )}

            <FormTextarea
              span
              label="Emergency Contact"
              helper="Name, relationship, and phone number."
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
            />
          </FormSection>

          <FormSection
            title="Consent"
            description="Please review and confirm the following."
          >
            <RadioGroup
              span
              label="Media consent*"
              helper="We may use photographs, video, or sound recordings captured of you in printed and electronic media for educational or promotional purposes. Select whether you allow this use."
              name="mediaConsent"
              value={form.mediaConsent}
              onChange={handleChange}
              options={[
                { label: "Yes, I Allow", value: "Yes" },
                { label: "No, Exempt Me", value: "No" },
              ]}
              error={errors.mediaConsent}
            />

            <RadioGroup
              span
              label="Post-conference materials*"
              helper="Are you interested in receiving post-conference reports, whitepapers, and research publications?"
              name="reportConsent"
              value={form.reportConsent}
              onChange={handleChange}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
              error={errors.reportConsent}
            />
          </FormSection>

          <FormSection
            title="Registration & Payment"
            description="Choose your registration phase and participant type."
          >
            <div className="md:col-span-2 bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-start gap-4">
              <div className="flex-shrink-0">
                <Info className="text-orange-600 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-700 mb-2">
                  Registration Timeline
                </h3>
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

            <FormSelect
              label="Registration Phase*"
              name="phase"
              value={form.phase}
              onChange={handleChange}
              options={[
                { label: "- Select phase -", value: "" },
                { label: "Early Bird", value: "EarlyBird" },
                { label: "Regular", value: "Regular" },
                { label: "Late / On-site", value: "LateOnsite" },
              ]}
              error={errors.phase}
            />

            <FormSelect
              label="Registration Type*"
              name="type"
              value={form.type}
              onChange={handleChange}
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

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submit}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {submit ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </FormSection>
        </form>
      </section>
    </main>
  );
}
