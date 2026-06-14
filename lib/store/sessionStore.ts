import { create } from "zustand";
import type { InspectionRegistration, CapturedImage, AnalysisResult } from "../types";

interface SessionState {
  registration: InspectionRegistration | null;
  sessionId: string | null;
  images: CapturedImage[];
  isAnalyzing: boolean;
  analysisProgress: number;
  currentTab: "camera" | "history";

  setRegistration: (reg: InspectionRegistration, sessionId: string) => void;
  addImage: (image: CapturedImage) => void;
  updateImage: (id: string, updates: Partial<CapturedImage>) => void;
  removeImage: (id: string) => void;
  setAnalyzing: (v: boolean) => void;
  setAnalysisProgress: (v: number) => void;
  clearSession: () => void;
  setCurrentTab: (tab: "camera" | "history") => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  registration: null,
  sessionId: null,
  images: [],
  isAnalyzing: false,
  analysisProgress: 0,
  currentTab: "camera",

  setRegistration: (reg, sessionId) => set({ registration: reg, sessionId }),
  addImage: (image) => set((s) => ({ images: [...s.images, image] })),
  updateImage: (id, updates) =>
    set((s) => ({
      images: s.images.map((img) => (img.id === id ? { ...img, ...updates } : img)),
    })),
  removeImage: (id) => set((s) => ({ images: s.images.filter((img) => img.id !== id) })),
  setAnalyzing: (v) => set({ isAnalyzing: v }),
  setAnalysisProgress: (v) => set({ analysisProgress: v }),
  clearSession: () => set({ images: [], isAnalyzing: false, analysisProgress: 0 }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
}));
