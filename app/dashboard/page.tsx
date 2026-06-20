"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/store/sessionStore";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { CameraPanel } from "@/components/camera/CameraPanel";
import { AnalysisControls } from "@/components/analysis/AnalysisControls";
import { ImageGrid } from "@/components/analysis/ImageGrid";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { registration, sessionId } = useSessionStore();
  const router = useRouter();

  // Prevent a flash of dashboard content for unauthenticated users while the
  // redirect effect is pending.
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!registration || !sessionId) {
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, [registration, sessionId, router]);

  if (checking || !registration) return null;

  // Derive caliber display value once — avoids repeating the ternary in JSX.
  const caliberDisplay =
    registration.caliber === "Other"
      ? registration.customCaliber
      : registration.caliber;

  const sessionFields = [
    { label: "Gun",      value: registration.gunName },
    { label: "Batch",    value: registration.batchNumber },
    { label: "Serial",   value: registration.barrelSerialNumber },
    { label: "Caliber",  value: caliberDisplay },
    { label: "Inspector",value: registration.inspectorName },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav />

      {/* Session info bar */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 sm:gap-4">
        {sessionFields.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
              {label}:
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 truncate max-w-[100px] sm:max-w-none">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/*
        ─── LAYOUT STRATEGY ──────────────────────────────────────────────────────
        The original code rendered CameraPanel, AnalysisControls, and ImageGrid
        THREE times — once per breakpoint block. This caused:
          • Three simultaneous camera streams fighting over the same hardware.
          • ImageGrid mounted three times, creating triple store subscriptions
            and conflicting state updates — the primary reason images didn't load.

        FIX: each component is rendered exactly ONCE. Layout is handled entirely
        with responsive CSS classes on the shared wrapper elements so the DOM
        tree adapts without duplicating any component instances.

        Breakpoint map:
          Mobile  (<md)  → single column, stacked vertically
          Tablet  (md)   → 2-column grid: [Camera + Controls] | [ImageGrid]
          Desktop (lg+)  → 3-column flex: 50% Camera | 20% Controls | 30% ImageGrid
      ─────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 p-3 sm:p-4 min-h-0">

        {/*
          Outer container switches layout mode per breakpoint.
          flex-col  → mobile stack
          md:grid   → 2-column tablet grid
          lg:flex lg:flex-row → 3-column desktop flex
        */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:flex lg:flex-row lg:gap-4 min-h-0">

          {/* ── Camera panel ──────────────────────────────────────────────────
              Mobile/tablet: full width (col-span-1).
              Desktop: 50% of the row.
          ──────────────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm
                       md:col-span-1 lg:w-[50%] lg:overflow-y-auto"
          >
            <SectionHeader color="bg-gray-700" title="Camera" />
            <CameraPanel />
          </motion.div>

          {/* ── Controls panel ────────────────────────────────────────────────
              Mobile: sits between Camera and ImageGrid (natural stack order).
              Tablet: shares left column with Camera — achieved by wrapping
                      Camera + Controls in a sub-grid column on md.
              Desktop: 20% centre column.

              We handle the tablet "left column" stacking by placing Controls
              right after Camera in source order and using md:col-start-1 so
              it flows into the first column on a 2-col grid automatically.
              ImageGrid uses md:col-start-2 md:row-span-2 to fill the right.
          ──────────────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm
                       md:col-start-1 lg:w-[20%] lg:overflow-y-auto"
          >
            <SectionHeader color="bg-blue-500" title="Controls" />
            <AnalysisControls />
          </motion.div>

          {/* ── ImageGrid panel ───────────────────────────────────────────────
              Mobile: full width, below Controls.
              Tablet: right column, spans both rows so it fills the full height
                      alongside Camera (row 1) and Controls (row 2).
              Desktop: 30% right column with overflow scrolling inside.
          ──────────────────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm
                       flex flex-col min-h-[400px]
                       md:col-start-2 md:row-start-1 md:row-span-2
                       lg:w-[30%] lg:overflow-hidden"
          >
            <SectionHeader color="bg-orange-500" title="Images & Results" />
            <div className="flex-1 overflow-hidden">
              <ImageGrid />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// ─── Small presentational helper ─────────────────────────────────────────────
// Extracted to avoid repeating the same markup three times.
function SectionHeader({ color, title }: { color: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-1.5 h-4 ${color} rounded-full`} />
      <h2 className="text-xs font-bold text-gray-600 uppercase tracking-widest">
        {title}
      </h2>
    </div>
  );
}