"use client";
import { useState, useMemo } from "react";
import { BARREL_FAULTS, type GunBarrelFault } from "@/constants/fault";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, X, AlertTriangle, Shield,
  CheckCircle, Clock, ArrowUpDown, ChevronLeft, ChevronRight,
  Eye, FileText, Calendar, User, Target, Crosshair,
  Activity, Globe, TrendingUp, TrendingDown, Zap,
  Grid3x3, List, Info, AlertOctagon, AlertCircle as AlertCircleIcon,
  Wrench, Sparkles, AlertTriangle as AlertTriangleIcon
} from "lucide-react";
import Link from "next/link";

// ─── Constants ─────────────────────────────────────────────────────────────

const SEVERITY_COLORS = {
  Critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500", label: "Critical", icon: AlertTriangleIcon },
  High: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-500", label: "High", icon: AlertOctagon },
  Medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", label: "Medium", icon: AlertCircleIcon },
  Low: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", label: "Low", icon: Info }
};

const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

// ─── Main Component ───────────────────────────────────────────────────────

export default function WeaponFaultsPage() {
  const [faults] = useState<GunBarrelFault[]>(BARREL_FAULTS);
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedGunType, setSelectedGunType] = useState("all");
  const [selectedFault, setSelectedFault] = useState<GunBarrelFault | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "severity" | "affected">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get unique gun types
  const gunTypes = ["All Types", ...new Set(faults.flatMap(f => f.affectedGunTypes))];

  // Filter faults
  const filteredFaults = useMemo(() => {
    let result = faults.filter(f => {
      const matchesSearch = !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase()) ||
        f.causes.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
        f.effects.some(e => e.toLowerCase().includes(search.toLowerCase()));
      
      const matchesSeverity = selectedSeverity === "all" || f.severity === selectedSeverity;
      const matchesGunType = selectedGunType === "all" || f.affectedGunTypes.includes(selectedGunType);

      return matchesSearch && matchesSeverity && matchesGunType;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name": comparison = a.name.localeCompare(b.name); break;
        case "severity": comparison = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]; break;
        case "affected": comparison = a.affectedGunTypes.length - b.affectedGunTypes.length; break;
        default: comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [faults, search, selectedSeverity, selectedGunType, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredFaults.length / itemsPerPage);
  const paginatedFaults = filteredFaults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: faults.length,
    critical: faults.filter(f => f.severity === "Critical").length,
    high: faults.filter(f => f.severity === "High").length,
    medium: faults.filter(f => f.severity === "Medium").length,
    low: faults.filter(f => f.severity === "Low").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 shadow-md">
              <AlertTriangleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Barrel Faults
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {filteredFaults.length}
                </span>
              </h1>
              <p className="text-xs text-gray-500">Comprehensive guide to gun barrel faults</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-gray-200 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-gray-200 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? "bg-gray-200 text-gray-800" : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="max-w-7xl mx-auto mt-3 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Total:</span>
            <span className="font-bold text-gray-900">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-500">Critical:</span>
            <span className="font-bold text-red-700">{stats.critical}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-gray-500">High:</span>
            <span className="font-bold text-orange-700">{stats.high}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-500">Medium:</span>
            <span className="font-bold text-amber-700">{stats.medium}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-500">Low:</span>
            <span className="font-bold text-blue-700">{stats.low}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by fault name, description, causes, or effects..."
                className="w-full bg-white border-2 border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
              >
                <option value="name">Sort by Name</option>
                <option value="severity">Sort by Severity</option>
                <option value="affected">Sort by Affected Types</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className={`w-4 h-4 text-gray-500 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Severity</label>
                      <select
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                        className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                      >
                        <option value="all">All Severity</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Gun Type</label>
                      <select
                        value={selectedGunType}
                        onChange={(e) => setSelectedGunType(e.target.value)}
                        className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                      >
                        {gunTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        setSelectedSeverity("all");
                        setSelectedGunType("all");
                        setSearch("");
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear all filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Faults List */}
        {filteredFaults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <AlertTriangleIcon className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-600">No faults found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
            }>
              <AnimatePresence>
                {paginatedFaults.map((fault, index) => (
                  viewMode === "grid" ? (
                    <FaultCard
                      key={fault.id}
                      fault={fault}
                      index={index}
                      onView={() => setSelectedFault(fault)}
                    />
                  ) : (
                    <FaultListItem
                      key={fault.id}
                      fault={fault}
                      index={index}
                      onView={() => setSelectedFault(fault)}
                    />
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredFaults.length)} of {filteredFaults.length} faults
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-gray-800 text-white"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fault Detail Modal */}
      {selectedFault && (
        <FaultDetailModal
          fault={selectedFault}
          onClose={() => setSelectedFault(null)}
        />
      )}
    </div>
  );
}

// ─── Fault Card Component ──────────────────────────────────────────────

function FaultCard({ fault, index, onView }: { fault: GunBarrelFault; index: number; onView: () => void }) {
  const severityColor = SEVERITY_COLORS[fault.severity];
  const SeverityIcon = severityColor.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-200 cursor-pointer"
      onClick={onView}
    >
      {/* Image */}
     
      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-900 truncate flex-1">{fault.name}</h3>
          <div className={`p-1 rounded-lg ${severityColor.bg} flex-shrink-0`}>
            <SeverityIcon className={`w-3.5 h-3.5 ${severityColor.text}`} />
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{fault.description}</p>

        <div className="flex flex-wrap gap-1 mt-2">
          {fault.affectedGunTypes.slice(0, 3).map((type, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full border border-gray-200">
              {type}
            </span>
          ))}
          {fault.affectedGunTypes.length > 3 && (
            <span className="px-2 py-0.5 text-gray-400 text-[10px]">
              +{fault.affectedGunTypes.length - 3}
            </span>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Wrench className="w-3 h-3" />
            {fault.solutions.length} solutions
          </span>
          <span className="flex items-center gap-1">
            <AlertCircleIcon className="w-3 h-3" />
            {fault.causes.length} causes
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Fault List Item Component ──────────────────────────────────────────

function FaultListItem({ fault, index, onView }: { fault: GunBarrelFault; index: number; onView: () => void }) {
  const severityColor = SEVERITY_COLORS[fault.severity];
  const SeverityIcon = severityColor.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-200 cursor-pointer"
      onClick={onView}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${severityColor.bg} ${severityColor.border} border flex-shrink-0`}>
          <SeverityIcon className={`w-5 h-5 ${severityColor.text}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-gray-900">{fault.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{fault.description}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${severityColor.bg} ${severityColor.border} ${severityColor.text}`}>
              {severityColor.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {fault.affectedGunTypes.length} weapon types
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              {fault.solutions.length} solutions
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <AlertCircleIcon className="w-3 h-3" />
              {fault.causes.length} causes
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {fault.effects.length} effects
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mt-1.5">
            {fault.affectedGunTypes.slice(0, 4).map((type, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full border border-gray-200">
                {type}
              </span>
            ))}
            {fault.affectedGunTypes.length > 4 && (
              <span className="px-2 py-0.5 text-gray-400 text-[10px]">
                +{fault.affectedGunTypes.length - 4}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onView(); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Fault Detail Modal ─────────────────────────────────────────────────

function FaultDetailModal({ fault, onClose }: { fault: GunBarrelFault; onClose: () => void }) {
  const severityColor = SEVERITY_COLORS[fault.severity];
  const SeverityIcon = severityColor.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 border-b border-gray-200 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${severityColor.bg} ${severityColor.border} border`}>
                <SeverityIcon className={`w-6 h-6 ${severityColor.text}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{fault.name}</h2>
                <div className="flex items-center gap-2 my-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${severityColor.bg} ${severityColor.border} ${severityColor.text}`}>
                    {severityColor.label} Severity
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">


            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{fault.description}</p>
            </div>

            {/* Grid Layout for details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Causes */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertCircleIcon className="w-4 h-4" />
                  Causes
                </h3>
                <ul className="space-y-1.5">
                  {fault.causes.map((cause, i) => (
                    <li key={i} className="text-xs text-red-600 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Effects */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Effects
                </h3>
                <ul className="space-y-1.5">
                  {fault.effects.map((effect, i) => (
                    <li key={i} className="text-xs text-orange-600 flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span>
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Solutions & Maintenance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Solutions */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Solutions
                </h3>
                <ul className="space-y-1.5">
                  {fault.solutions.map((solution, i) => (
                    <li key={i} className="text-xs text-green-600 flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Maintenance */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Maintenance
                </h3>
                <ul className="space-y-1.5">
                  {fault.maintenance.map((item, i) => (
                    <li key={i} className="text-xs text-blue-600 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Affected Gun Types */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Affected Gun Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {fault.affectedGunTypes.map((type, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Share2 Icon Component
const Share2 = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);