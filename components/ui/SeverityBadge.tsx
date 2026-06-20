import { getSeverityColor } from "@/lib/utils/imageUtils";

interface Props {
  severity: string;
  className?: string;
}

const labels: Record<string, string> = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
  none: "NONE",
};

export function SeverityBadge({ severity, className = "" }: Props) {
  const color = getSeverityColor(severity);
  const label = labels[severity?.toLowerCase()] || severity?.toUpperCase() || "—";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold tracking-wider ${className}`}
      style={{ 
        color: color, 
        border: `1px solid ${color}40`, 
        background: `${color}10` 
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}