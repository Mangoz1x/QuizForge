export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
