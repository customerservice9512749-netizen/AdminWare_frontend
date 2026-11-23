export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>}
      <input
        className={`w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-lg outline-none transition-all ${
          error ? 'border-rose-400 focus:ring-rose-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15'
        } ${className}`}
        {...props}
      />
      {error && <span className="block mt-1 text-xs text-rose-600">{error}</span>}
    </label>
  );
}
