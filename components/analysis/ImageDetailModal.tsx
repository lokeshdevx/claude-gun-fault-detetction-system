"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { CapturedImage, BarrelIssue } from "@/lib/types";
import { HealthScore } from "@/components/ui/HealthScore";
import { SeverityBadge } from "@/components/ui/SeverityBadge";

interface Props {
  image: CapturedImage | null;
  onClose: () => void;
}

/**
 * The only 9 defect names that are allowed to be displayed.
 * Any issue returned by the API whose issueName is NOT in this list
 * will be silently dropped before rendering.
 */
const ALLOWED_DEFECTS: string[] = [
  "Bulge",
  "Flecking Off",
  "Ringed Barrel",
  "Pitting",
  "Cuts",
  "Scratch / Scoring",
  "Corrosion",
  "Dent",
  "Carbon Deposit",
];

/**
 * The API returns confidence as a float 0–1 (e.g. 0.85).
 * Multiply by 100 and round to display as a percentage integer.
 */
function formatConfidence(confidence: number | undefined): string {
  if (confidence === undefined || confidence === null) return "0%";
  const pct = confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
  return `${pct}%`;
}

/**
 * Filters the raw issues array from the API, keeping only issues whose
 * issueName exactly matches one of the 9 allowed defect types.
 * Any unknown, misspelled, or unlisted defect name is dropped silently.
 */
function filterAllowedIssues(issues: BarrelIssue[]): BarrelIssue[] {
  return issues.filter((issue) => {
    const name = (issue.issueName ?? "").trim();
    return ALLOWED_DEFECTS.includes(name);
  });
}

export function ImageDetailModal({ image, onClose }: Props) {
  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!image) return null;

  const ar = image.analysisResult;

  // Filter out any issues not in the allowed list before rendering
  const rawIssues = ar?.issues ?? [];
  const issues = filterAllowedIssues(rawIssues);

  // Recompute criticalIssues count from filtered list only
  const criticalIssues = issues.filter((i) => i.severity === "High").length;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0d1117] z-20 flex items-center justify-between p-4 border-b border-[#1e2d3d]">
            <div>
              <h2 className="text-sm font-bold text-white">
                {image.position || image.fileName || "Untitled Image"}
              </h2>
              <p className="text-xs text-gray-400">
                {image.capturedAt
                  ? new Date(image.capturedAt).toLocaleString()
                  : "Unknown date"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {ar && ar.barrelHealthScore !== undefined && (
                <HealthScore score={ar.barrelHealthScore} size="sm" />
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-[#1a2230] hover:bg-[#22304a] text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {/* Left — Image */}
            <div>
              <div className="relative bg-[#0a0f15] rounded-xl overflow-hidden border border-[#1e2d3d]">
                <div className="overflow-auto" style={{ maxHeight: "380px" }}>
                  <div className="relative inline-block w-full min-h-[200px]">
                    {!imageError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.dataUrl}
                        alt="Barrel inspection"
                        className="w-full object-contain"
                        style={{
                          transform: `scale(${zoom})`,
                          transformOrigin: "top left",
                          transition: "transform 0.2s",
                        }}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <p className="text-sm">Failed to load image</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Zoom controls */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 bg-black/60 rounded text-white hover:bg-black/80 transition-colors"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 bg-black/60 rounded text-white hover:bg-black/80 transition-colors"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2 py-1.5 bg-black/60 rounded text-white text-xs hover:bg-black/80 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Quality Issues */}
              {image.qualityIssues && image.qualityIssues.length > 0 && (
                <div className="mt-3 bg-yellow-950/30 border border-yellow-900/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-yellow-400 mb-1">
                    Quality Issues
                  </p>
                  <ul className="list-disc list-inside">
                    {image.qualityIssues.map((q, i) => (
                      <li key={i} className="text-xs text-yellow-300/70">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right — Analysis */}
            <div className="space-y-3">
              {ar ? (
                <>
                  <div className="bg-[#1a2230] rounded-xl p-3 border border-[#2d3d4f]">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                      Overall Condition
                    </p>
                    <p className="text-sm text-white">
                      {ar.overallCondition || "No condition assessment available"}
                    </p>
                    {criticalIssues > 0 && (
                      <p className="text-xs text-red-400 mt-1">
                        {criticalIssues} critical issue{criticalIssues > 1 ? "s" : ""} detected
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {issues.length === 0 ? (
                      <div className="flex items-center gap-2 text-green-400 bg-green-950/30 border border-green-900/30 rounded-lg p-3">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">No defects detected</span>
                      </div>
                    ) : (
                      issues.map((issue, i) => (
                        <div
                          key={i}
                          className="bg-[#1a2230] rounded-lg border border-[#2d3d4f] p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-white">
                              {issue.issueName}
                            </span>
                            <SeverityBadge severity={issue.severity || "low"} />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-2">
                            <span>
                              Confidence:{" "}
                              <span className="text-white">
                                {formatConfidence(issue.confidence)}
                              </span>
                            </span>
                            <span>
                              Area:{" "}
                              <span className="text-white">
                                {issue.affectedArea || "Unknown"}
                              </span>
                            </span>
                            <span>
                              Risk:{" "}
                              <span className="text-orange-300">
                                {issue.riskLevel || "Unknown"}
                              </span>
                            </span>
                            <span>
                              Location:{" "}
                              <span className="text-white capitalize">
                                {issue.location?.replace(/-/g, " ") || "Center"}
                              </span>
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-1">
                            {issue.description || "No description available"}
                          </p>
                          {issue.solution && (
                            <div className="mt-2 pt-2 border-t border-[#2d3d4f]">
                              <p className="text-xs text-[#8fa84d] font-semibold mb-0.5">
                                Solution
                              </p>
                              <p className="text-xs text-gray-300">{issue.solution}</p>
                            </div>
                          )}
                          {issue.maintenanceAction && (
                            <div className="mt-1.5">
                              <p className="text-xs text-blue-400 font-semibold mb-0.5">
                                Maintenance
                              </p>
                              <p className="text-xs text-gray-300">
                                {issue.maintenanceAction}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  <p className="text-sm">Not yet analyzed</p>
                  <p className="text-xs mt-1">
                    Click "Analyze" to process this image
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}