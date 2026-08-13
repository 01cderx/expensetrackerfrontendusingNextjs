import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  tint = "teal",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tint?: "teal" | "rose" | "amber";
}) {
  const tintClasses = {
    teal: "bg-teal-50 text-teal-600",
    rose: "bg-rose-50 text-rose-500",
    amber: "bg-amber-50 text-amber-600",
  }[tint];

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tintClasses}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      <p className="tabular text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
