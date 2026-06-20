"use client";
import { getHealthCategory, getHealthColor } from "@/lib/utils/imageUtils";

interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function HealthScore({ score, size = "md" }: Props) {
  const color = getHealthColor(score);
  const label = getHealthCategory(score);

  const sizes = {
    sm: { num: "text-lg", label: "text-xs", ring: 36, stroke: 3 },
    md: { num: "text-2xl", label: "text-xs", ring: 56, stroke: 4 },
    lg: { num: "text-4xl", label: "text-sm", ring: 80, stroke: 5 },
  };

  const s = sizes[size];
  const r = (s.ring - s.stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: s.ring, height: s.ring }}>
        <svg width={s.ring} height={s.ring} className="-rotate-90">
          <circle
            cx={s.ring / 2}
            cy={s.ring / 2}
            r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={s.stroke}
          />
          <circle
            cx={s.ring / 2}
            cy={s.ring / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={s.stroke}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${s.num} font-bold`} style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <span className={`${s.label} font-semibold uppercase tracking-wider`} style={{ color }}>
        {label}
      </span>
    </div>
  );
}