const STEPS = [
  { id: "registration", label: "Registration" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" },
];

function getStepIndex(step) {
  if (step === "payment_retry" || step === "payment") {
    return STEPS.findIndex((s) => s.id === "payment");
  }
  if (step === "confirmation") {
    return STEPS.findIndex((s) => s.id === "confirmation");
  }
  return STEPS.findIndex((s) => s.id === "registration");
}

export default function ProgressSteps({ step }) {
  const index = getStepIndex(step);

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
      {STEPS.map((s, i) => {
        const active = i <= index;

        return (
          <div key={s.id} className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                active ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm font-medium ${
                active ? "text-orange-600" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
