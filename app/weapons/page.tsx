"use client";
import { useState, useMemo } from "react";
import { weapons } from "@/constants/weapon";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Filter, X, Grid3x3, List,
  Eye, Calendar, Target, Crosshair,
  Activity, Globe, TrendingUp, TrendingDown,
  ArrowUpDown, AlertCircle, Ruler, Weight, Gauge,
  ChevronLeft, ChevronRight, Building2, Shield, Zap,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Weapon {
  id: string;
  name: string;
  type: string;
  caliber: string;
  manufacturer: string;
  model: string;
  countryOfOrigin: string;
  images: string[];
  description: string;
  specifications: {
    weight: string;
    length: string;
    barrelLength: string;
    magazineCapacity: number;
    rateOfFire: string;
    effectiveRange: string;
  };
}

// ─── Constants ─────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  active: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500", label: "Active" },
  inactive: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", dot: "bg-gray-400", label: "Inactive" },
  maintenance: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", label: "Maintenance" },
  retired: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500", label: "Retired" }
};

// ─── Main Component ───────────────────────────────────────────────────────

export default function WeaponsPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "type" | "country" | "caliber">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const weaponTypes = ["All Types", ...new Set(weapons.map(w => w.type))];

  const filteredWeapons = useMemo(() => {
    let result = weapons.filter(w => {
      const matchesSearch = !search || 
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
        w.model.toLowerCase().includes(search.toLowerCase()) ||
        w.type.toLowerCase().includes(search.toLowerCase()) ||
        w.caliber.toLowerCase().includes(search.toLowerCase()) ||
        w.countryOfOrigin.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = selectedType === "All Types" || w.type === selectedType;
      return matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name": comparison = a.name.localeCompare(b.name); break;
        case "type": comparison = a.type.localeCompare(b.type); break;
        case "country": comparison = a.countryOfOrigin.localeCompare(b.countryOfOrigin); break;
        case "caliber": comparison = a.caliber.localeCompare(b.caliber); break;
        default: comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [search, selectedType, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredWeapons.length / itemsPerPage);
  const paginatedWeapons = filteredWeapons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: weapons.length,
    types: new Set(weapons.map(w => w.type)).size,
    countries: new Set(weapons.map(w => w.countryOfOrigin.split('/')[0].trim())).size,
    calibers: new Set(weapons.map(w => w.caliber)).size,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-md">
              <Crosshair className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Weapons Arsenal
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {filteredWeapons.length}
                </span>
              </h1>
              <p className="text-xs text-gray-500">Complete inventory of all weapons</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        <div className="max-w-7xl mx-auto mt-3 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Total:</span>
            <span className="font-bold text-gray-900">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Types:</span>
            <span className="font-bold text-gray-700">{stats.types}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Countries:</span>
            <span className="font-bold text-gray-700">{stats.countries}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Calibers:</span>
            <span className="font-bold text-gray-700">{stats.calibers}</span>
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
                placeholder="Search by name, manufacturer, model, type, caliber, or country..."
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
                <option value="type">Sort by Type</option>
                <option value="country">Sort by Country</option>
                <option value="caliber">Sort by Caliber</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className={`w-4 h-4 text-gray-500 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

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
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                      >
                        {weaponTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</label>
                      <select
                        className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                      >
                        <option value="all">All Countries</option>
                        {[...new Set(weapons.map(w => w.countryOfOrigin.split('/')[0].trim()))].map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Caliber</label>
                      <select
                        className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                      >
                        <option value="all">All Calibers</option>
                        {[...new Set(weapons.map(w => w.caliber))].map(caliber => (
                          <option key={caliber} value={caliber}>{caliber}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        setSelectedType("All Types");
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

        {/* Weapons Grid/List */}
        {filteredWeapons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Crosshair className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-600">No weapons found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
            }>
              <AnimatePresence>
                {paginatedWeapons.map((weapon, index) => (
                  viewMode === "grid" ? (
                    <WeaponCard
                      key={weapon.id}
                      weapon={weapon}
                      index={index}
                      onView={() => setSelectedWeapon(weapon)}
                    />
                  ) : (
                    <WeaponListItem
                      key={weapon.id}
                      weapon={weapon}
                      index={index}
                      onView={() => setSelectedWeapon(weapon)}
                    />
                  )
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredWeapons.length)} of {filteredWeapons.length} weapons
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

      {/* Weapon Detail Modal */}
      {selectedWeapon && (
        <WeaponDetailModal
          weapon={selectedWeapon}
          onClose={() => setSelectedWeapon(null)}
        />
      )}
    </div>
  );
}

// ─── Weapon Card Component with Fixed Image ─────────────────────────────

function WeaponCard({ weapon, index, onView }: { weapon: Weapon; index: number; onView: () => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-200 cursor-pointer"
      onClick={onView}
    >
      {/* Image Container - Fixed Height with object-contain */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {weapon.images && weapon.images.length > 0 && !imageError ? (
          <div className="relative w-full h-full">
            <img
              src={weapon.images[0]}
              alt={weapon.name}
              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Crosshair className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">{weapon.type}</span>
              <span className="w-px h-3 bg-white/30" />
              <span className="text-xs">{weapon.caliber}</span>
            </div>
            <span className="text-xs font-mono opacity-80">{weapon.model}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 truncate">{weapon.name}</h3>
        <p className="text-xs text-gray-500 truncate">{weapon.manufacturer}</p>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {weapon.countryOfOrigin.split('/')[0].trim()}
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            {weapon.caliber}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full border border-gray-200">
            {weapon.specifications.magazineCapacity} rounds
          </span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full border border-gray-200">
            {weapon.specifications.weight}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Weapon List Item Component ──────────────────────────────────────────

function WeaponListItem({ weapon, index, onView }: { weapon: Weapon; index: number; onView: () => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-200 cursor-pointer"
      onClick={onView}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Thumbnail - Fixed Size */}
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
          {weapon.images && weapon.images.length > 0 && !imageError ? (
            <img
              src={weapon.images[0]}
              alt={weapon.name}
              className="w-full h-full object-contain p-1"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Crosshair className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-gray-900">{weapon.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs">
                <span className="text-gray-500">{weapon.model}</span>
                <span className="w-px h-3 bg-gray-200" />
                <span className="text-gray-500">{weapon.manufacturer}</span>
                <span className="w-px h-3 bg-gray-200" />
                <span className="text-gray-500">{weapon.type}</span>
                <span className="w-px h-3 bg-gray-200" />
                <span className="text-gray-500">{weapon.caliber}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {weapon.countryOfOrigin}
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Weight className="w-3 h-3" />
              {weapon.specifications.weight}
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {weapon.specifications.length.split(',')[0].trim()}
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {weapon.specifications.rateOfFire}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Weapon Detail Modal ─────────────────────────────────────────────────

function WeaponDetailModal({ weapon, onClose }: { weapon: Weapon; onClose: () => void }) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

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
            <div>
              <h2 className="text-xl font-bold text-gray-900">{weapon.name}</h2>
              <p className="text-sm text-gray-500">{weapon.model} · {weapon.manufacturer}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Images Gallery - Fixed with consistent sizing */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {weapon.images && weapon.images.length > 0 ? (
                weapon.images.map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg bg-gray-100 overflow-hidden">
                    {!imageErrors[i] ? (
                      <img
                        src={img}
                        alt={`${weapon.name} ${i + 1}`}
                        className="w-full h-full object-contain p-2"
                        onError={() => handleImageError(i)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Crosshair className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <Crosshair className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weapon Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Weapon Details
                </h3>
                <div className="space-y-2">
                  <DetailRow label="Type" value={weapon.type} />
                  <DetailRow label="Caliber" value={weapon.caliber} />
                  <DetailRow label="Manufacturer" value={weapon.manufacturer} />
                  <DetailRow label="Model" value={weapon.model} />
                  <DetailRow label="Country of Origin" value={weapon.countryOfOrigin} />
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Specifications
                </h3>
                <div className="space-y-2">
                  <DetailRow label="Weight" value={weapon.specifications.weight} />
                  <DetailRow label="Length" value={weapon.specifications.length} />
                  <DetailRow label="Barrel Length" value={weapon.specifications.barrelLength} />
                  <DetailRow label="Magazine Capacity" value={`${weapon.specifications.magazineCapacity} rounds`} />
                  <DetailRow label="Rate of Fire" value={weapon.specifications.rateOfFire} />
                  <DetailRow label="Effective Range" value={weapon.specifications.effectiveRange} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{weapon.description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Helper Components ───────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
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