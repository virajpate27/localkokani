// src/components/ui/MathCaptcha.jsx
"use client";

import { FiRefreshCw, FiShield } from "react-icons/fi";

export default function MathCaptcha({ captcha, label = "Quick check — you're human, right?" }) {
  const { problem, userAnswer, setUserAnswer, error, refresh, honeypot, setHoneypot } = {
    ...captcha,
    refresh: captcha.reset,
  };

  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
        <FiShield className="text-secondary text-xs" /> {label}
      </label>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 select-none">
          <span className="font-display font-semibold text-primary text-lg tabular-nums">
            {problem.a} {problem.operation} {problem.b}
          </span>
          <span className="text-gray-400 font-medium">=</span>
        </div>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value.replace(/[^0-9-]/g, ""))} // digits + minus sign only, for negative results
          placeholder="?"
          aria-label="Answer to the math problem above"
          className={`w-20 px-3 py-3 rounded-xl border text-center text-sm font-medium outline-none transition-colors ${
            error ? "border-red-300" : "border-gray-200 focus:border-secondary"
          }`}
        />

        <button
          type="button"
          onClick={refresh}
          aria-label="Get a new problem"
          className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-secondary hover:border-secondary transition-colors shrink-0"
        >
          <FiRefreshCw className="text-sm" />
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1.5" role="alert">{error}</p>}

      {/* Honeypot field — invisible to real users, irresistible to basic bots that auto-fill every input */}
      <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
    </div>
  );
}