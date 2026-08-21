// src/components/ui/DateInput.jsx
"use client";

export default function DateInput({
  value, onChange, label, icon: Icon, min, error, name, disabled, ...rest
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm" />
      )}
      <input
        type="date"
        name={name}
        value={value}
        min={min}
        onChange={onChange}
        disabled={disabled}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
          disabled ? "bg-gray-50 text-gray-400" : "bg-white"
        } ${error ? "border-red-300" : "border-gray-200 focus:border-secondary"} ${
          !value ? "text-transparent" : disabled ? "" : "text-gray-700"
        }`}
        {...rest}
      />
      {!value && (
        <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none ${Icon ? "left-10" : "left-4"}`}>
          {label}
        </span>
      )}
    </div>
  );
}