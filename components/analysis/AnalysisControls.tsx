"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Scan, FileText, Save, Trash2, Activity, Shield, AlertTriangle,
} from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";
import { analyzeMultipleImages, aggregateHealthScore, getOverallRecommendation } from "@/lib/services/claudeService";
import { generatePDFReport } from "@/lib/services/pdfService";
import { saveInspection, updateImage } from "@/lib/db/database";
import { HealthScore } from "@/components/ui/HealthScore";
import { useToast } from "@/components/ui/ToastProvider";
import type { Inspection } from "@/lib/types";

// ─── Elapsed-time hook ────────────────────────────────────────────────────────

/**
 * Returns the number of seconds elapsed since the timer was started.
 * Starts counting when `running` is true, resets to 0 when it becomes false.
 */
function useElapsedSeconds(running: boolean): number {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      setElapsed(0);
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return elapsed;
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnalysisControls() {
  const {
    images, sessionId, registration,
    isAnalyzing, analysisProgress,
    setAnalyzing, setAnalysisProgress, clearSession, updateImage: updateStoreImage,
  } = useSessionStore();
  const { toast } = useToast();

  // Track which image number is currently being analyzed (1-based).
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const elapsed = useElapsedSeconds(isAnalyzing);

  const pendingImages = images.filter((i) => i.status === "pending");
  const completedImages = images.filter((i) => i.status === "completed");
  const hasImages = images.length > 0;

  const aggScore =
    completedImages.length > 0
      ? aggregateHealthScore(completedImages.map((i) => i.analysisResult!).filter(Boolean))
      : null;

  const handleAnalyze = async () => {
    if (!pendingImages.length || !sessionId) return;
    setAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentImageIndex(0);

    const toAnalyze = pendingImages;
    for (const img of toAnalyze) {
      updateStoreImage(img.id, { status: "processing" });
    }

    try {
      for (let i = 0; i < toAnalyze.length; i++) {
        const img = toAnalyze[i];
        setCurrentImageIndex(i + 1);
        // Progress reflects images completed so far (not the current one).
        setAnalysisProgress(Math.round((i / toAnalyze.length) * 100));

        try {
          const result = await (
            await import("@/lib/services/claudeService")
          ).analyzeBarrelImage(img.dataUrl);
          updateStoreImage(img.id, { status: "completed", analysisResult: result });
          await updateImage(img.id, { status: "completed", analysisResult: result });
        } catch (e) {
          updateStoreImage(img.id, { status: "failed" });
          await updateImage(img.id, { status: "failed" });
          toast(`Analysis failed for ${img.position || img.fileName}`, "error");
        }
      }
      setAnalysisProgress(100);
      toast(`${toAnalyze.length} image(s) analyzed`, "success");
    } finally {
      setAnalyzing(false);
      setCurrentImageIndex(0);
    }
  };

  const handleGenerateReport = async () => {
    if (!registration || !sessionId) return;
    try {
      const inspection: Inspection = {
        id: sessionId,
        registration,
        images,
        aggregateHealthScore: aggScore ?? 0,
        overallRecommendation: getOverallRecommendation(aggScore ?? 0),
        completedAt: new Date().toISOString(),
        createdAt: registration.createdAt,
      };
      await generatePDFReport(inspection);
      toast("Report downloaded", "success");
    } catch (e) {
      toast("Report generation failed", "error");
    }
  };

  const handleSave = async () => {
    if (!registration || !sessionId) return;
    try {
      const inspection: Inspection = {
        id: sessionId,
        registration,
        images,
        aggregateHealthScore: aggScore ?? 0,
        overallRecommendation: getOverallRecommendation(aggScore ?? 0),
        completedAt: new Date().toISOString(),
        createdAt: registration.createdAt,
      };
      await saveInspection(inspection);
      toast("Inspection saved to history", "success");
    } catch (e) {
      toast("Save failed", "error");
    }
  };

  const handleClear = () => {
    if (confirm("Clear all images from this session?")) {
      clearSession();
      toast("Session cleared", "info");
    }
  };

  if (!hasImages) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Total", value: images.length, icon: Activity, color: "#65783c" },
            { label: "Pending", value: pendingImages.length, icon: AlertTriangle, color: "#facc15" },
            { label: "Analyzed", value: completedImages.length, icon: Shield, color: "#4ade80" },
            {
              label: "Defects",
              value: completedImages.reduce((a, i) => a + (i.analysisResult?.issues?.length || 0), 0),
              icon: AlertTriangle,
              color: "#f97316",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#1a2230] rounded-xl p-3 border border-[#2d3d4f]">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3 h-3" style={{ color }} />
                <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
              </div>
              <span className="text-2xl font-bold" style={{ color }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Aggregate score */}
        {aggScore !== null && (
          <div className="bg-[#1a2230] rounded-xl p-4 border border-[#2d3d4f] flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Aggregate Health
            </p>
            <HealthScore score={aggScore} size="lg" />
          </div>
        )}

        {/* Analysis progress — shown while isAnalyzing */}
        {isAnalyzing && (
          <div className="bg-[#1a2230] rounded-xl p-3 border border-[#65783c]/30">
            {/* Header row */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#8fa84d] font-semibold">
                Analyzing with Claude AI
              </span>
              <span className="text-xs text-gray-400">{analysisProgress}%</span>
            </div>

            {/* Sub-label: which image + elapsed time */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">
                Image {currentImageIndex} of {pendingImages.length + completedImages.length > 0
                  ? images.filter((i) => i.status !== "pending" || pendingImages.includes(i)).length
                  : currentImageIndex}
                {" "}— deep inspection in progress…
              </span>
              <span className="text-xs text-gray-500 tabular-nums">
                {formatElapsed(elapsed)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#65783c] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Patience note — appears after 15 seconds on a single image */}
            {elapsed >= 15 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-xs text-gray-600 text-center"
              >
                Detailed barrel inspection can take up to 5 minutes — please wait.
              </motion.p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || pendingImages.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#65783c] text-white hover:bg-[#7a8f4a] disabled:opacity-40 transition-all"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Scan className="w-4 h-4" />
            )}
            {isAnalyzing
              ? `Analyzing image ${currentImageIndex}…`
              : `Analyze ${pendingImages.length} Image${pendingImages.length !== 1 ? "s" : ""}`}
          </button>

          <button
            onClick={handleGenerateReport}
            disabled={completedImages.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#1a2230] border border-[#2d3d4f] text-gray-300 hover:border-[#65783c]/50 hover:text-white disabled:opacity-40 transition-all"
          >
            <FileText className="w-4 h-4" />
            Generate PDF Report
          </button>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#1a2230] border border-[#2d3d4f] text-gray-300 hover:border-[#65783c]/50 hover:text-white transition-all"
          >
            <Save className="w-4 h-4" />
            Save to History
          </button>

          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-red-400 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Session
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}