"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Trash2, FileText, Crosshair, History, ArrowLeft,
  Calendar, User, Target, ChevronRight,
} from "lucide-react";
import { getAllInspections, deleteInspection } from "@/lib/db/database";
import { generatePDFReport } from "@/lib/services/pdfService";
import { HealthScore } from "@/components/ui/HealthScore";
import { useToast } from "@/components/ui/ToastProvider";
import type { Inspection } from "@/lib/types";

export default function HistoryPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const all = await getAllInspections();
    setInspections(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = inspections.filter((insp) => {
    const reg = insp.registration;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      reg.gunName.toLowerCase().includes(q) ||
      reg.batchNumber.toLowerCase().includes(q) ||
      reg.barrelSerialNumber.toLowerCase().includes(q) ||
      reg.inspectorName.toLowerCase().includes(q);
    const matchDate =
      !dateFilter ||
      new Date(insp.createdAt).toLocaleDateString().includes(dateFilter);
    return matchSearch && matchDate;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inspection permanently?")) return;
    await deleteInspection(id);
    toast("Inspection deleted", "info");
    load();
  };

  const handleReport = async (insp: Inspection) => {
    try {
      await generatePDFReport(insp);
      toast("Report downloaded", "success");
    } catch {
      toast("Report failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] grid-bg">
      {/* Nav */}
      <div className="bg-[#0a0f14] border-b border-[#1e2d3d] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair className="w-5 h-5 text-[#8fa84d]" />
          <span className="text-sm font-bold text-white tracking-wide">BARREL INSPECT</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-sm text-[#8fa84d] font-semibold">History</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#1a2230] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          New Inspection
        </Link>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#65783c]/10 border border-[#65783c]/20 flex items-center justify-center">
            <History className="w-5 h-5 text-[#8fa84d]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Inspection History</h1>
            <p className="text-xs text-gray-500">{inspections.length} total inspection{inspections.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gun name, batch, serial, inspector..."
              className="w-full bg-[#1a2230] border border-[#2d3d4f] rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#65783c]/50"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-[#1a2230] border border-[#2d3d4f] rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#65783c]/50"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-[#1a2230] rounded-xl border border-[#2d3d4f] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <History className="w-12 h-12 mb-3" />
            <p className="text-sm font-medium">No inspections found</p>
            <p className="text-xs mt-1">Complete an inspection to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((insp, i) => {
              const reg = insp.registration;
              const completed = insp.images.filter((img) => img.status === "completed");
              const defects = completed.reduce((a, img) => a + (img.analysisResult?.issues?.length || 0), 0);

              return (
                <motion.div
                  key={insp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-4 hover:border-[#65783c]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                        <h3 className="text-sm font-bold text-white">{reg.gunName}</h3>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs font-mono text-[#8fa84d]">{reg.batchNumber}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs font-mono text-gray-400">{reg.barrelSerialNumber}</span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {[
                          { icon: Target, text: reg.caliber === "Other" ? reg.customCaliber : reg.caliber },
                          { icon: User, text: reg.inspectorName },
                          { icon: Calendar, text: new Date(insp.createdAt).toLocaleDateString() },
                        ].map(({ icon: Icon, text }) => (
                          <span key={text} className="flex items-center gap-1 text-xs text-gray-500">
                            <Icon className="w-3 h-3" />
                            {text}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-3">
                        <span className="text-xs text-gray-500">
                          <span className="text-white font-semibold">{insp.images.length}</span> images
                        </span>
                        <span className="text-xs text-gray-500">
                          <span className="text-white font-semibold">{completed.length}</span> analyzed
                        </span>
                        <span className="text-xs text-gray-500">
                          <span className={`font-semibold ${defects > 0 ? "text-orange-400" : "text-green-400"}`}>
                            {defects}
                          </span>{" "}
                          defects
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {insp.aggregateHealthScore !== undefined && insp.aggregateHealthScore > 0 && (
                        <HealthScore score={insp.aggregateHealthScore} size="sm" />
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReport(insp)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-[#1a2230] border border-[#2d3d4f] text-gray-400 hover:text-white hover:border-[#65783c]/50 transition-all"
                        >
                          <FileText className="w-3 h-3" />
                          Report
                        </button>
                        <button
                          onClick={() => handleDelete(insp.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-[#1a2230] border border-[#2d3d4f] text-red-500 hover:bg-red-950/30 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
