import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Crosshair, Shield, Zap, Activity, Camera, Cpu, Package, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 shadow-md">
            <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-gray-800 tracking-widest uppercase leading-tight">
              Barrel Fault Detection
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide hidden xs:block">
              Advanced Inspection System
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Navigation Links */}
          <Link
            href="/weapons"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all"
          >
            <Package className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Weapons</span>
          </Link>
          <Link
            href="/weapon-faults"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Faults</span>
          </Link>
          <div className="w-px h-6 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-green-50 border border-green-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-semibold text-green-700">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between p-8 w-80 bg-white border-r border-gray-200/80 shadow-sm">
          <div className="space-y-8">
            {/* System Capabilities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-gray-600 to-gray-400 rounded-full" />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  System Capabilities
                </p>
              </div>
              {[
                { icon: Shield, text: "Military-grade barrel inspection", color: "text-blue-600" },
                { icon: Zap, text: "Claude Vision AI analysis", color: "text-amber-600" },
                { icon: Camera, text: "Multi-camera support (USB, OTG)", color: "text-purple-600" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">{text}</p>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-gray-600 to-gray-400 rounded-full" />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  Quick Access
                </p>
              </div>
              <Link
                href="/weapons"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 font-semibold">View Weapons</p>
              </Link>
              <Link
                href="/weapon-faults"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-xs text-gray-600 font-semibold">Weapon Faults</p>
              </Link>
            </div>

            {/* Detectable Faults */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-gray-600 to-gray-400 rounded-full" />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  Detectable Faults
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {[
                  "Cracks & Fractures",
                  "Corrosion & Rust",
                  "Rifling Wear",
                  "Carbon Fouling",
                  "Crown Damage",
                  "Chamber Defects",
                  "Bore Erosion",
                  "Heat Damage",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full" />
                    <span className="text-xs text-gray-600 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Powered by</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-700">Claude Sonnet Vision</span> — 
              Results should be reviewed by a qualified firearm inspection specialist.
            </p>
          </div>
        </div>

        {/* Center - form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-4">
          <div className="w-full max-w-9xl bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
            <RegistrationForm />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-[10px] text-gray-500">
        <div className="flex items-center gap-2">
          <Link href="/weapons" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
            <Package className="w-3 h-3" />
            Weapons
          </Link>
          <span className="w-px h-3 bg-gray-300" />
          <Link href="/weapon-faults" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
            <AlertTriangle className="w-3 h-3" />
            Faults
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span>v2.0</span>
          <span className="w-px h-3 bg-gray-300" />
          <span className="text-green-600 font-semibold">● Online</span>
        </div>
      </div>
    </main>
  );
}