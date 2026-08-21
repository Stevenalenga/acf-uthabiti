"use client";

import { useState, useEffect } from "react";
import { Calendar, Info, Gift } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import FormInput from "@/components/registration/FormInput";
import FormTextarea from "@/components/registration/FormTextarea";
import FormSelect from "@/components/registration/FormSelect";
import CountryCombobox from "@/components/registration/CountryCombobox";
import CheckboxGroup from "@/components/registration/CheckboxGroup";
import RadioGroup from "@/components/registration/RadioGroup";
import FormSection from "@/components/registration/FormSection";
import ProgressSteps from "@/components/registration/ProgressSteps";
import {
  FEES,
  PHASE_WINDOWS,
  getOpenPhases,
  isPhaseOpen,
  isPromoActive,
  getRegistrationFee,
  getStandardFee,
  formatPromoEndDate,
  PROMO_DISCOUNT,
} from "@/lib/documents/constants";

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
  "invoiceCurrency",
];

export default function RegistrationPage() {
  const [step, setStep] = useState("registration");
  const { showToast } = useToast();
  const [submit, setSubmit] = useState(false);
  const [invoiceBusy, setInvoiceBusy] = useState(false);
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
    invoiceCurrency: "",
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

  // Special CEO invitation (via ?invite=TOKEN in the URL)
  const [invite, setInvite] = useState(null);
  const [inviteError, setInviteError] = useState("");
  const openPhases = getOpenPhases();
  const registrationOpen = openPhases.length > 0;

  useEffect(() => {
    if (!form.phase || invite) return;
    if (!isPhaseOpen(form.phase)) {
      setForm((prev) => ({ ...prev, phase: "" }));
    }
  }, [form.phase, invite]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("invite");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`/api/invite/${token}`);
        const result = await res.json();

        if (!res.ok) {
          setInviteError(
            result.error || "This invitation link is not valid."
          );
          return;
        }

        setInvite(result.data);
        setForm((prev) => ({
          ...prev,
          email: result.data.email || prev.email,
          fullName: prev.fullName || result.data.name || "",
          // Invited guests skip the phase/type fee matrix; sensible defaults
          // are stored for the registration record.
          phase: "Regular",
          type: "other",
        }));
      } catch {
        setInviteError(
          "Could not verify your invitation link. Please try again."
        );
      }
    })();
  }, []);

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
    if (!invite) {
      if (!registrationOpen) {
        newErrors.phase = "Online registration is currently closed";
      } else if (!form.phase) {
        newErrors.phase = "Registration phase is required";
      } else if (!isPhaseOpen(form.phase)) {
        newErrors.phase =
          "This registration phase has ended. Please select an open phase.";
      }

      if (!form.type) newErrors.type = "Registration type is required";
    }

    if (!form.accessibility || form.accessibility.length === 0)
      newErrors.accessibility = "Select at least one accessibility option";

    if (!form.dietaryRestrictions || form.dietaryRestrictions.length === 0)
      newErrors.dietaryRestrictions = "Select at least one dietary option";

    if (!form.mediaConsent) newErrors.mediaConsent = "Please choose one option";
    if (!form.reportConsent) newErrors.reportConsent = "Please choose one option";
    if (!form.invoiceCurrency)
      newErrors.invoiceCurrency = "Select a registration currency";

    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, newErrors };
  };

  const promoActive = isPromoActive();
  const promoEnds = formatPromoEndDate();

  const standardFee =
    !invite && form.phase && form.type
      ? getStandardFee(form.phase, form.type)
      : null;
  const fee = invite
    ? invite.amount
    : form.phase && form.type
      ? getRegistrationFee(form.phase, form.type)
      : null;
  const feeIsDiscounted =
    promoActive &&
    fee != null &&
    standardFee != null &&
    Number(fee) < Number(standardFee);

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
          invoiceCurrency: form.invoiceCurrency,
          inviteToken: invite?.token || undefined,
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

      // Email selected invoice in the background; continue payment flow immediately.
      emailInvoiceInBackground(form.invoiceCurrency, { silent: true });

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

  const getStoredParticipantId = () =>
    sessionStorage.getItem("participantId") ||
    localStorage.getItem("participantId");

  const emailInvoiceInBackground = (currency, { silent = false } = {}) => {
    const participantId = getStoredParticipantId();
    if (!participantId || !currency) return;

    setInvoiceBusy(true);
    fetch("/api/payment/invoice-currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId, currency }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Could not send invoice");
        if (!silent) {
          showToast({
            type: "success",
            message: "Invoice sent to your email",
          });
        }
      })
      .catch((error) => {
        if (!silent) {
          showToast({
            type: "error",
            message: error.message || "Could not send invoice",
          });
        } else {
          console.error("Background invoice email failed:", error);
        }
      })
      .finally(() => setInvoiceBusy(false));
  };

  const handleRetryPayment = async () => {
    try {
      const participantId = getStoredParticipantId();

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

            <div className="flex flex-wrap justify-center gap-4 mb-8">
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

            <div className="text-left border-t border-yellow-200 pt-6">
              <p className="text-sm font-medium text-gray-800 mb-3 text-center">
                Register in
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { value: "USD", label: "Register in USD" },
                  { value: "KES", label: "Register in Kenyan Shillings" },
                ].map((option) => {
                  const selected = form.invoiceCurrency === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={invoiceBusy}
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          invoiceCurrency: option.value,
                        }));
                        emailInvoiceInBackground(option.value);
                      }}
                      className={`flex items-center gap-3 w-full rounded-lg border px-4 py-3 text-left text-sm transition disabled:opacity-60 cursor-pointer ${
                        selected
                          ? "border-orange-600 bg-orange-50 text-orange-900"
                          : "border-gray-200 bg-white text-gray-800 hover:border-orange-300"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded border text-xs font-bold ${
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
              Payment will be completed onsite during conference check-in. Your
              invoice has been sent to your email.
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

        {invite && (
          <div className="mb-8 bg-green-50 border border-green-200 p-5 rounded-xl flex items-start gap-3">
            <Gift className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">
                Special Invitation
              </h3>
              <p className="text-sm text-green-700 mt-1">
                You have been personally invited by the CEO of Uthabiti Africa.
                Your registration rate is locked at{" "}
                <strong>${invite.amount} USD</strong>.
              </p>
            </div>
          </div>
        )}

        {inviteError && (
          <div className="mb-8 bg-red-50 border border-red-200 p-5 rounded-xl">
            <h3 className="font-semibold text-red-700">Invitation Link Issue</h3>
            <p className="text-sm text-red-600 mt-1">
              {inviteError} You can still register below at the standard rates,
              or contact us for assistance.
            </p>
          </div>
        )}

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
              onChange={invite ? () => {} : handleChange}
              type="email"
              error={errors.email}
              helper={
                invite
                  ? "Your invitation is linked to this email address."
                  : undefined
              }
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
            description={
              invite
                ? "Your registration fee has been set by your invitation."
                : "Choose your registration phase and participant type."
            }
          >
            {!invite && (
            <div className="md:col-span-2 bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-start gap-4">
              <div className="flex-shrink-0">
                <Info className="text-orange-600 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-700 mb-2">
                  Registration Timeline
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {Object.entries(PHASE_WINDOWS).map(([phaseKey, window]) => {
                    const open = isPhaseOpen(phaseKey);
                    return (
                      <li key={phaseKey} className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className={open ? "" : "text-gray-400 line-through"}>
                          {window.label}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            open
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {open ? "Open" : "Closed"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {!registrationOpen && (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    Online registration is closed for all published phases.
                    Please contact support if you need assistance.
                  </p>
                )}
              </div>
            </div>
            )}

            {!invite && promoActive && registrationOpen && (
              <div className="md:col-span-2 bg-green-50 border border-green-200 p-5 rounded-xl flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-shrink-0">
                  <Gift className="text-green-600 w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-1">
                    Limited-time registration discount
                  </h3>
                  <p className="text-sm text-green-900/80 mb-3">
                    Available now through <strong>{promoEnds}</strong>. After
                    this date, standard late registration fees apply.
                  </p>
                  <ul className="text-sm text-green-900 space-y-1">
                    <li>
                      East Africa participants:{" "}
                      <strong>${PROMO_DISCOUNT.fees.eastAfrica} USD</strong>
                      <span className="text-green-700/70">
                        {" "}
                        (was ${FEES.LateOnsite.eastAfrica})
                      </span>
                    </li>
                    <li>
                      International participants:{" "}
                      <strong>${PROMO_DISCOUNT.fees.other} USD</strong>
                      <span className="text-green-700/70">
                        {" "}
                        (was ${FEES.LateOnsite.other})
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {!invite && registrationOpen && (
            <FormSelect
              label="Registration Phase*"
              name="phase"
              value={form.phase}
              onChange={handleChange}
              options={[
                { label: "- Select phase -", value: "" },
                ...openPhases.map((phaseKey) => ({
                  label:
                    phaseKey === "EarlyBird"
                      ? "Early Bird"
                      : phaseKey === "LateOnsite"
                        ? "Late / On-site"
                        : "Regular",
                  value: phaseKey,
                })),
              ]}
              error={errors.phase}
            />
            )}

            {!invite && registrationOpen && (
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
            )}

            {fee && (
              <div
                className={`md:col-span-2 p-4 rounded-lg text-center ${
                  invite
                    ? "bg-green-50 border border-green-200"
                    : feeIsDiscounted
                      ? "bg-green-50 border border-green-200"
                      : "bg-orange-50"
                }`}
              >
                <p className="text-sm text-gray-600">
                  {invite
                    ? "Special Invitation Rate"
                    : feeIsDiscounted
                      ? "Discounted Registration Fee"
                      : "Registration Fee"}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    invite || feeIsDiscounted
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {feeIsDiscounted && (
                    <span className="mr-3 text-lg text-gray-400 line-through font-medium">
                      ${standardFee}
                    </span>
                  )}
                  ${fee}
                </p>
                {feeIsDiscounted && (
                  <p className="text-xs text-green-700 mt-1">
                    Offer ends {promoEnds}
                  </p>
                )}
              </div>
            )}

            <div className="md:col-span-2" data-field="invoiceCurrency">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Registration currency*
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { value: "USD", label: "Register in USD" },
                  { value: "KES", label: "Register in Kenyan Shillings" },
                ].map((option) => {
                  const selected = form.invoiceCurrency === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          invoiceCurrency: option.value,
                        }));
                        setErrors((prev) => ({ ...prev, invoiceCurrency: "" }));
                      }}
                      className={`flex items-center gap-3 w-full rounded-lg border px-4 py-3 text-left text-sm transition cursor-pointer ${
                        selected
                          ? "border-orange-600 bg-orange-50 text-orange-900"
                          : "border-gray-200 bg-white text-gray-800 hover:border-orange-300"
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
                <p className="mt-2 text-sm text-red-600">
                  {errors.invoiceCurrency}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submit || (!invite && !registrationOpen)}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {submit ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : !invite && !registrationOpen ? (
                  "Registration Closed"
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
