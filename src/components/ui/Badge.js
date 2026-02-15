export default function Badge({ children, className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
