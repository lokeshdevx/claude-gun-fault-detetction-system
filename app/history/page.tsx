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
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-bold text-gray-800 tracking-wide">BARREL INSPECT</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm text-gray-700 font-semibold">History</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          New Inspection
        </Link>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
            <History className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Inspection History</h1>
            <p className="text-xs text-gray-500">{inspections.length} total inspection{inspections.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gun name, batch, serial, inspector..."
              className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <History className="w-12 h-12 mb-3" />
            <p className="text-sm font-medium text-gray-600">No inspections found</p>
            <p className="text-xs mt-1 text-gray-400">Complete an inspection to see it here</p>
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
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                        <h3 className="text-sm font-bold text-gray-900">{reg.gunName}</h3>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs font-mono text-gray-700 font-semibold">{reg.batchNumber}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs font-mono text-gray-600">{reg.barrelSerialNumber}</span>
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
                          <span className="text-gray-900 font-semibold">{insp.images.length}</span> images
                        </span>
                        <span className="text-xs text-gray-500">
                          <span className="text-gray-900 font-semibold">{completed.length}</span> analyzed
                        </span>
                        <span className="text-xs text-gray-500">
                          <span className={`font-semibold ${defects > 0 ? "text-orange-600" : "text-green-600"}`}>
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
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-white border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-500 hover:bg-gray-50 transition-all"
                        >
                          <FileText className="w-3 h-3" />
                          Report
                        </button>
                        <button
                          onClick={() => handleDelete(insp.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-white border border-gray-300 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all"
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