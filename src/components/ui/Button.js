"use client";

const variants = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800",
  secondary:
    "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  icon: Icon,
  iconClassName,
  iconPosition = "left",
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-colors cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : 16} className={iconClassName} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 14 : 16} className={iconClassName} />}
    </button>
  );
}
