export default function StatCard({
  label,
  value,
  accent = "forest",
}: {
  label: string;
  value: string;
  accent?: "forest" | "clay" | "gold";
}) {
  const accentColor =
    accent === "clay"
      ? "text-clay"
      : accent === "gold"
      ? "text-gold"
      : "text-forest-700";

  return (
    <div className="bg-white/60 border border-ink/10 rounded-sm p-6">
      <p className="text-xs uppercase tracking-widest text-ink/50 mb-2">
        {label}
      </p>
      <p className={`tabular text-3xl font-medium ${accentColor}`}>{value}</p>
    </div>
  );
}
