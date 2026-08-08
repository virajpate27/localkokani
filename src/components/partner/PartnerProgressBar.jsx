// src/components/partner/PartnerProgressBar.jsx
import { FiCheck } from "react-icons/fi";

const STEP_LABELS = [
  "Owner Details", "Property Details", "Location", "Accommodation",
  "Photos", "Policies", "Plan", "Verification", "Agreement", "Confirm & Submit",
];

export default function PartnerProgressBar({ currentStep, totalSteps, hiddenSteps = [] }) {
  const visibleSteps = STEP_LABELS.map((label, i) => i + 1).filter((s) => !hiddenSteps.includes(s));

  return (
    <div className="mb-8">
      {/* Mobile: simple text progress */}
      <p className="sm:hidden text-sm text-gray-500 mb-3">
        Step {visibleSteps.indexOf(currentStep) + 1} of {visibleSteps.length}:{" "}
        <span className="font-medium text-primary">{STEP_LABELS[currentStep - 1]}</span>
      </p>

      {/* Desktop: dot stepper */}
      <div className="hidden sm:flex items-center">
        {visibleSteps.map((step, index) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  step < currentStep
                    ? "bg-accent text-white"
                    : step === currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step < currentStep ? <FiCheck /> : index + 1}
              </div>
            </div>
            {index < visibleSteps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${step < currentStep ? "bg-accent" : "bg-gray-100"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="hidden sm:block text-sm font-medium text-primary mt-3">
        {STEP_LABELS[currentStep - 1]}
      </p>
    </div>
  );
}