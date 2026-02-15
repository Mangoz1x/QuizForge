"use client";

import { useForm } from "@/lib/form-context";

export default function FormHeader() {
  const { form, updateFormHeader } = useForm();

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-2">
      <input
        type="text"
        value={form.title}
        onChange={(e) => updateFormHeader({ title: e.target.value })}
        placeholder="Form title"
        className="text-lg font-medium text-slate-900 bg-transparent border-none outline-none w-full placeholder:text-slate-400 focus:ring-0 p-0"
      />
      <input
        type="text"
        value={form.description}
        onChange={(e) => updateFormHeader({ description: e.target.value })}
        placeholder="Form description (optional)"
        className="text-sm text-slate-600 bg-transparent border-none outline-none w-full placeholder:text-slate-400 focus:ring-0 p-0"
      />
    </div>
  );
}
