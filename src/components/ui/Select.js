"use client";

import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, options = [], className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <select
        ref={ref}
        className={`
          w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900
          hover:border-slate-300
          focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100
          transition-colors cursor-pointer
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
