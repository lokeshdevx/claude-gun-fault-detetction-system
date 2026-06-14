"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Target, AlertCircle, ArrowRight, User, FileText,
  Crosshair, CalendarClock, Sliders, CheckCircle2,
} from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";
import { saveRegistration } from "@/lib/db/database";
import type { InspectionRegistration } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";

const schema = z.object({
  gunName: z.string().min(1, "Gun name is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  barrelSerialNumber: z.string().min(1, "Barrel serial number is required"),
  caliber: z.enum(["5.56mm", "7.62mm", "9mm", "12 Gauge", "Other"]),
  customCaliber: z.string().optional(),
  inspectorName: z.string().min(1, "Inspector name is required"),
  unitDepartment: z.string().optional(),
  inspectionNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CALIBERS = ["5.56mm", "7.62mm", "9mm", "12 Gauge", "Other"] as const;
const CALIBER_LABELS: Record<string, string> = {
  "5.56mm": "5.56 mm",
  "7.62mm": "7.62 mm",
  "9mm": "9 mm",
  "12 Gauge": "12 GA",
  Other: "Other",
};

const QUALITY_HINTS = [
  "Blur detection",
  "Brightness check",
  "Sharpness validation",
  "Exposure analysis",
];

function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-3.5 h-3.5 text-[#65783c] flex-shrink-0" />
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.1em]">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#1e2d3d]" />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <div className="min-h-[18px] mt-1">
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-[11px] text-red-400"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RegistrationForm() {
  const router = useRouter();
  const { setRegistration } = useSessionStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { caliber: "5.56mm" },
  });

  const caliber = watch("caliber");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const reg: InspectionRegistration = {
        ...data,
        inspectionDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const id = await saveRegistration(reg);
      setRegistration(reg, id);
      toast("Inspection session started", "success");
      router.push("/dashboard");
    } catch {
      toast("Failed to start inspection. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#131b26] border border-[#1e2d3d] rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#65783c]/60 focus:ring-1 focus:ring-[#65783c]/20 transition-all duration-150";
  const labelClass =
    "block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#1e2d3d]">
        <div className="w-11 h-11 rounded-xl bg-[#65783c]/10 border border-[#65783c]/20 flex items-center justify-center flex-shrink-0">
          <Target className="w-5 h-5 text-[#8fa84d]" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-white leading-snug">
            Inspection manifest
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete all required fields to begin barrel fault detection
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Weapon Identification ─────────────────── */}
        <section>
          <SectionHeader icon={Crosshair} label="Weapon identification" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Gun name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("gunName")}
                className={inputClass}
                placeholder="e.g. M4A1 Carbine"
              />
              <FieldError message={errors.gunName?.message} />
            </div>
            <div>
              <label className={labelClass}>
                Batch number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("batchNumber")}
                className={inputClass}
                placeholder="e.g. BTH-2024-001"
              />
              <FieldError message={errors.batchNumber?.message} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Barrel serial number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("barrelSerialNumber")}
                className={inputClass}
                placeholder="e.g. BSN-789456"
              />
              <FieldError message={errors.barrelSerialNumber?.message} />
            </div>
          </div>
        </section>

        {/* ── Caliber Toggle ────────────────────────── */}
        <section>
          <SectionHeader icon={Sliders} label="Caliber" />
          <div className="grid grid-cols-5 gap-1.5">
            {CALIBERS.map((cal) => (
              <button
                key={cal}
                type="button"
                onClick={() => setValue("caliber", cal, { shouldValidate: true })}
                className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                  caliber === cal
                    ? "bg-[#65783c]/15 border-[#65783c]/50 text-[#8fa84d]"
                    : "bg-[#131b26] border-[#1e2d3d] text-gray-500 hover:border-[#2d3d4f] hover:text-gray-300"
                }`}
              >
                {CALIBER_LABELS[cal]}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {caliber === "Other" && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: "hidden" }}
              >
                <label className={labelClass}>
                  Specify caliber <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customCaliber")}
                  className={inputClass}
                  placeholder="e.g. .308 Winchester"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Inspector Details ─────────────────────── */}
        <section>
          <SectionHeader icon={User} label="Inspector details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Inspector name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("inspectorName")}
                className={inputClass}
                placeholder="Full name"
              />
              <FieldError message={errors.inspectorName?.message} />
            </div>
            <div>
              <label className={labelClass}>Unit / Department</label>
              <input
                {...register("unitDepartment")}
                className={inputClass}
                placeholder="e.g. Armory Division"
              />
              <div className="min-h-[18px]" />
            </div>
          </div>
        </section>

        {/* ── Notes ────────────────────────────────── */}
        <section>
          <SectionHeader icon={FileText} label="Pre-inspection notes" />
          <textarea
            {...register("inspectionNotes")}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Any pre-inspection observations, known issues, or context…"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUALITY_HINTS.map((hint) => (
              <span
                key={hint}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#131b26] border border-[#1e2d3d] text-[10px] text-gray-500"
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-[#65783c]" />
                {hint}
              </span>
            ))}
          </div>
        </section>

        {/* ── Date bar ─────────────────────────────── */}
        <div className="bg-[#131b26] border border-[#1e2d3d] rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase tracking-[0.08em]">
            <CalendarClock className="w-3.5 h-3.5" />
            Inspection date
          </span>
          <span className="text-xs font-medium text-[#8fa84d] font-mono">
            {new Date().toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* ── Submit ───────────────────────────────── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#65783c]/15 border border-[#65783c]/40 text-[#8fa84d] text-sm font-semibold hover:bg-[#65783c]/25 hover:border-[#65783c]/60 disabled:opacity-40 transition-all duration-200"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#8fa84d]/30 border-t-[#8fa84d] rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          {loading ? "Starting session…" : "Continue to inspection"}
        </button>
      </form>
    </motion.div>
  );
}