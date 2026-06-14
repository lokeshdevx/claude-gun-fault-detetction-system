import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { Crosshair, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen grid-bg flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0a0f14] border-b border-[#1e2d3d] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-[#8fa84d]" />
          <span className="text-sm font-bold text-white tracking-widest uppercase">
            Barrel Fault Detection System
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#65783c] rounded-full animate-pulse" />
          <span className="text-xs text-[#8fa84d] font-mono">SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left panel - decorative */}
        <div className="hidden lg:flex flex-col justify-between p-8 w-80 border-r border-[#1e2d3d] bg-[#0a0f14]">
          <div className="space-y-6">
            <div>
              <p className="text-xs text-[#65783c] uppercase tracking-widest font-semibold mb-3">
                System Capabilities
              </p>
              {[
                { icon: Shield, text: "Military-grade barrel inspection" },
                { icon: Zap, text: "Claude Vision AI analysis" },
                { icon: Crosshair, text: "Multi-camera support (USB, OTG)" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#65783c]/10 border border-[#65783c]/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#8fa84d]" />
                  </div>
                  <p className="text-xs text-gray-400">{text}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1e2d3d] pt-6">
              <p className="text-xs text-[#65783c] uppercase tracking-widest font-semibold mb-3">
                Detectable Faults
              </p>
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
                <div key={f} className="flex items-center gap-2 mb-1.5">
                  <div className="w-1 h-1 bg-[#65783c] rounded-full" />
                  <span className="text-xs text-gray-500">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1117] rounded-xl border border-[#1e2d3d] p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              Powered by Claude Sonnet Vision. Results should be reviewed by a qualified
              firearm inspection specialist.
            </p>
          </div>
        </div>

        {/* Center - form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-2xl bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-6 lg:p-8">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </main>
  );
}
