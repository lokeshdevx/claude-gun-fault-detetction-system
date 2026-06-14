"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crosshair, History, LogOut, ChevronRight } from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";

export function DashboardNav() {
  const { registration, sessionId } = useSessionStore();
  const router = useRouter();

  return (
    <nav className="bg-[#0d1117] border-b border-[#1e2d3d] px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-[#8fa84d]" />
          <span className="text-sm font-bold text-white tracking-wide">BARREL INSPECT</span>
        </div>
        {registration && (
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#8fa84d]">{registration.gunName}</span>
            <span>·</span>
            <span>{registration.batchNumber}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/history"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#1a2230] transition-all"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">History</span>
        </Link>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Inspection</span>
        </button>
      </div>
    </nav>
  );
}
