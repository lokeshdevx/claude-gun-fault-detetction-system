"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, CameraOff, ZoomIn, Upload, RefreshCw, Usb, ChevronDown,
} from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";
import { validateImageQuality, compressImage, formatFileSize } from "@/lib/utils/imageUtils";
import { saveImage } from "@/lib/db/database";
import type { CapturedImage } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";

export function CameraPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const { sessionId, addImage } = useSessionStore();
  const { toast } = useToast();

  const refreshDevices = useCallback(async () => {
    try {
      // Request permissions first to get labels
      await navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
        s.getTracks().forEach((t) => t.stop());
      }).catch(() => {});
      const all = await navigator.mediaDevices.enumerateDevices();
      const cams = all.filter((d) => d.kind === "videoinput");
      setDevices(cams);
      if (cams.length && !selectedDevice) {
        setSelectedDevice(cams[0].deviceId);
      }
    } catch (e) {
      toast("Could not enumerate cameras", "warning");
    }
  }, [selectedDevice, toast]);

  useEffect(() => {
    refreshDevices();
    navigator.mediaDevices.addEventListener("devicechange", refreshDevices);
    return () => navigator.mediaDevices.removeEventListener("devicechange", refreshDevices);
  }, [refreshDevices]);

  const startCamera = async (deviceId?: string) => {
    stopCamera();
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { width: { ideal: 1920 }, height: { ideal: 1080 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraOn(true);
      toast("Camera started", "success");
    } catch (e: any) {
      toast(`Camera error: ${e.message}`, "error");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraOn(false);
  };

  const switchCamera = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    setShowDevices(false);
    if (isCameraOn) await startCamera(deviceId);
  };

  const captureImage = async () => {
    if (!videoRef.current || !sessionId) return;
    setCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
      const raw = canvas.toDataURL("image/jpeg", 0.92);
      await processImage(raw, `capture_${Date.now()}.jpg`);
    } catch (e) {
      toast("Capture failed", "error");
    } finally {
      setCapturing(false);
    }
  };

  const processImage = async (dataUrl: string, fileName: string) => {
    if (!sessionId) return;
    const compressed = await compressImage(dataUrl);
    const quality = await validateImageQuality(compressed);

    const img: CapturedImage = {
      id: crypto.randomUUID(),
      inspectionId: sessionId,
      dataUrl: compressed,
      fileName,
      fileSize: Math.round(compressed.length * 0.75),
      capturedAt: new Date().toISOString(),
      status: quality.passed ? "pending" : "failed",
      qualityScore: quality.score,
      qualityIssues: quality.issues,
      position: "", // Position removed
    };
    addImage(img);
    await saveImage(img);

    if (!quality.passed) {
      toast(`Quality check failed: ${quality.issues[0]}`, "warning");
    } else {
      toast(`Image captured`, "success");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        toast(`${file.name} exceeds 20MB limit`, "error");
        continue;
      }
      const dataUrl = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(file);
      });
      await processImage(dataUrl, file.name);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const selectedLabel =
    devices.find((d) => d.deviceId === selectedDevice)?.label || "Default Camera";

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Video feed */}
      <div className="relative bg-[#0d1117] rounded-xl overflow-hidden border border-[#1e2d3d] aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1a2230] border border-[#2d3d4f] flex items-center justify-center">
              <CameraOff className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-xs text-gray-500">Camera inactive</p>
          </div>
        )}
        {isCameraOn && (
          <>
            {/* Corner guides */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
              <div
                key={corner}
                className={`absolute w-5 h-5 border-[#65783c] border-2 ${
                  corner.includes("top") ? "top-2" : "bottom-2"
                } ${corner.includes("left") ? "left-2" : "right-2"} ${
                  corner === "top-left"
                    ? "border-r-0 border-b-0 rounded-tl"
                    : corner === "top-right"
                    ? "border-l-0 border-b-0 rounded-tr"
                    : corner === "bottom-left"
                    ? "border-r-0 border-t-0 rounded-bl"
                    : "border-l-0 border-t-0 rounded-br"
                }`}
              />
            ))}
            <div className="absolute top-2 right-2">
              <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-red-400">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          </>
        )}
        {capturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/20"
          />
        )}
      </div>

      {/* Camera device selector */}
      <div className="relative">
        <button
          onClick={() => setShowDevices(!showDevices)}
          className="w-full flex items-center justify-between gap-2 bg-[#1a2230] border border-[#2d3d4f] rounded-lg px-3 py-2 text-xs text-gray-300 hover:border-[#65783c]/50 transition-all"
        >
          <span className="flex items-center gap-2">
            <Usb className="w-3.5 h-3.5 text-[#8fa84d]" />
            <span className="truncate max-w-[160px]">{selectedLabel}</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDevices ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {showDevices && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute z-20 w-full mt-1 bg-[#1a2230] border border-[#2d3d4f] rounded-lg overflow-hidden shadow-xl"
            >
              {devices.map((d) => (
                <button
                  key={d.deviceId}
                  onClick={() => switchCamera(d.deviceId)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-[#22304a] transition-colors ${
                    d.deviceId === selectedDevice ? "text-[#8fa84d]" : "text-gray-300"
                  }`}
                >
                  {d.label || `Camera ${devices.indexOf(d) + 1}`}
                </button>
              ))}
              <button
                onClick={() => { refreshDevices(); setShowDevices(false); }}
                className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-[#22304a] border-t border-[#2d3d4f] flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> Refresh camera list
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => isCameraOn ? stopCamera() : startCamera(selectedDevice)}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCameraOn
              ? "bg-red-900/40 text-red-400 border border-red-900/50 hover:bg-red-900/60"
              : "bg-[#65783c] text-white hover:bg-[#7a8f4a]"
          }`}
        >
          {isCameraOn ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          {isCameraOn ? "Stop" : "Start Camera"}
        </button>
        <button
          onClick={captureImage}
          disabled={!isCameraOn || capturing}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[#1a2230] border border-[#2d3d4f] text-gray-300 hover:border-[#65783c]/50 hover:text-white disabled:opacity-40 transition-all"
        >
          {capturing ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
          ) : (
            <ZoomIn className="w-4 h-4" />
          )}
          Capture
        </button>
      </div>

      <label className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[#1a2230] border border-dashed border-[#2d3d4f] text-gray-400 hover:border-[#65783c]/60 hover:text-white cursor-pointer transition-all">
        <Upload className="w-4 h-4" />
        Upload Images
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      <p className="text-xs text-gray-600 text-center">JPG · PNG · WEBP · Max 20MB</p>
    </div>
  );
}