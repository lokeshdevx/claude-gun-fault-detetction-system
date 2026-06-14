"use client";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!registration || !sessionId) {
      router.replace("/");
    }
  }, [registration, sessionId, router]);

  if (!registration) return null;

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <DashboardNav />

      {/* Session info bar - responsive */}
      <div className="bg-[#0a0f14] border-b border-[#1e2d3d] px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 sm:gap-4">
        {[
          { label: "Gun", value: registration.gunName },
          { label: "Batch", value: registration.batchNumber },
          { label: "Serial", value: registration.barrelSerialNumber },
          { label: "Caliber", value: registration.caliber === "Other" ? registration.customCaliber : registration.caliber },
          { label: "Inspector", value: registration.inspectorName },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-wider">{label}:</span>
            <span className="text-[10px] sm:text-xs font-semibold text-[#8fa84d] truncate max-w-[100px] sm:max-w-none">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Main responsive layout */}
      <div className="flex-1 p-3 sm:p-4 min-h-0">
        {/* Mobile: Stack vertically, Tablet/Desktop: Grid layout */}
        <div className="block lg:hidden space-y-4">
          {/* Camera Section - Full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-[#65783c] rounded-full" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Camera</h2>
            </div>
            <CameraPanel />
          </motion.div>

          {/* Controls Section - Full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Controls</h2>
            </div>
            <AnalysisControls />
          </motion.div>

          {/* Images Section - Full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4 flex flex-col min-h-[400px]"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Images & Results</h2>
            </div>
            <div className="flex-1">
              <ImageGrid />
            </div>
          </motion.div>
        </div>

        {/* Tablet Layout (md: 2 columns) */}
        <div className="hidden lg:hidden md:block">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-[#65783c] rounded-full" />
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Camera</h2>
                </div>
                <CameraPanel />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Controls</h2>
                </div>
                <AnalysisControls />
              </motion.div>
            </div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4 flex flex-col h-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Images & Results</h2>
              </div>
              <div className="flex-1 min-h-[500px]">
                <ImageGrid />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Desktop Layout (lg: 3 columns with percentages) */}
        <div className="hidden lg:flex gap-4 min-h-0">
          {/* Left — Camera (50%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-[50%] bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4 overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-[#65783c] rounded-full" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Camera</h2>
            </div>
            <CameraPanel />
          </motion.div>

          {/* Center — Controls (20%) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-[20%] bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4 overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Controls</h2>
            </div>
            <AnalysisControls />
          </motion.div>

          {/* Right — Images & Results (30%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-[30%] bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4 flex flex-col min-h-[400px] overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Images & Results</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <ImageGrid />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}