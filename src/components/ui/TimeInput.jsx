// src/components/ui/TimeInput.jsx
"use client";

export default function TimeInput({ value, onChange, label, icon: Icon, error, name, ...rest }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm" />
      )}

      <input
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white dark:bg-gray-900 dark:border-gray-800 ${
          error ? "border-red-300" : "border-gray-200 focus:border-secondary"
        } ${!value ? "text-transparent" : "text-gray-700"}`}
        {...rest}
      />

      {!value && (
        <span
          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none ${
            Icon ? "left-10" : "left-4"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}