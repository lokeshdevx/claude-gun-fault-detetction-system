"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crosshair, History, LogOut, ChevronRight } from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";

export function DashboardNav() {
  const { registration, sessionId } = useSessionStore();
  const router = useRouter();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-gray-700" />
          <span className="text-sm font-bold text-gray-900 tracking-wide">BARREL INSPECT</span>
        </div>
        {registration && (
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">{registration.gunName}</span>
            <span>·</span>
            <span>{registration.batchNumber}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/history"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">History</span>
        </Link>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Inspection</span>
        </button>
      </div>
    </nav>
  );
}