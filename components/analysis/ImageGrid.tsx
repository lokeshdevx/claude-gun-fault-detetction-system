"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, AlertCircle, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";
import { HealthScore } from "@/components/ui/HealthScore";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { ImageDetailModal } from "./ImageDetailModal";
import type { CapturedImage } from "@/lib/types";
import { formatFileSize } from "@/lib/utils/imageUtils";

const STATUS_ICONS = {
  pending: <Clock className="w-3 h-3 text-gray-400" />,
  processing: <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />,
  completed: <CheckCircle className="w-3 h-3 text-green-400" />,
  failed: <XCircle className="w-3 h-3 text-red-400" />,
};

const STATUS_LABELS = {
  pending: "Pending",
  processing: "Analyzing",
  completed: "Complete",
  failed: "Failed",
};

export function ImageGrid() {
  const { images, removeImage, isAnalyzing } = useSessionStore();
  const [selected, setSelected] = useState<CapturedImage | null>(null);
  const [filter, setFilter] = useState("");

  const filtered = images.filter(
    (img) =>
      img.fileName.toLowerCase().includes(filter.toLowerCase()) ||
      img.position?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search */}
      {images.length > 0 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter images..."
            className="w-full bg-[#1a2230] border border-[#2d3d4f] rounded-lg pl-8 pr-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#65783c]/50"
          />
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-600 border-2 border-dashed border-[#1e2d3d] rounded-xl">
          <AlertCircle className="w-10 h-10" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">No images yet</p>
            <p className="text-xs">Capture or upload barrel images</p>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        <AnimatePresence>
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.03 }}
              className="group bg-[#1a2230] border border-[#2d3d4f] rounded-xl overflow-hidden hover:border-[#65783c]/40 transition-all cursor-pointer"
              onClick={() => setSelected(img)}
            >
              <div className="flex gap-3 p-2.5">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[#0d1117]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.dataUrl}
                    alt={img.fileName}
                    className="w-full h-full object-cover"
                  />
                  {img.status === "processing" && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-[#65783c] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className="text-xs font-semibold text-white truncate max-w-[130px]">
                        {img.position || img.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(img.capturedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {STATUS_ICONS[img.status]}
                      <span className="text-xs text-gray-500">{STATUS_LABELS[img.status]}</span>
                    </div>
                  </div>

                  {img.analysisResult ? (
                    <div className="mt-1.5 flex items-center gap-2">
                      <HealthScore score={img.analysisResult.barrelHealthScore} size="sm" />
                      <div className="flex-1">
                        {img.analysisResult.issues.slice(0, 2).map((issue, j) => (
                          <SeverityBadge key={j} severity={issue.severity} className="mr-1 mb-0.5" />
                        ))}
                        {img.analysisResult.issues.length > 2 && (
                          <span className="text-xs text-gray-500">+{img.analysisResult.issues.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  ) : img.status === "failed" ? (
                    <div className="mt-1">
                      <p className="text-xs text-red-400">
                        {img.qualityIssues?.[0] || "Analysis failed"}
                      </p>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-600">{formatFileSize(img.fileSize)}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(img); }}
                        className="p-1 rounded hover:bg-[#22304a] text-gray-400"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                        className="p-1 rounded hover:bg-red-950/50 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar for quality */}
              {img.qualityScore !== undefined && (
                <div className="h-0.5 bg-[#0d1117]">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${img.qualityScore}%`,
                      background: img.qualityScore >= 70 ? "#65783c" : img.qualityScore >= 50 ? "#facc15" : "#ef4444",
                    }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <ImageDetailModal image={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
