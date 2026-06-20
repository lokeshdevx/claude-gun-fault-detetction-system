"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, CameraOff, ZoomIn, Upload, RefreshCw, Usb, ChevronDown,
} from "lucide-react";
import { useSessionStore } from "@/lib/store/sessionStore";
import { validateImageQuality, compressImage } from "@/lib/utils/imageUtils";
import { saveImage } from "@/lib/db/database";
import type { CapturedImage } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";

export function CameraPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Tracks whether the component is still mounted so async callbacks
  // don't update state or call toast after unmount.
  const mountedRef = useRef(true);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const { sessionId, addImage } = useSessionStore();
  const { toast } = useToast();

  // ─── Camera helpers ──────────────────────────────────────────────────────────

  /** Stop all active tracks and clear the video element. */
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (mountedRef.current) {
      setIsCameraOn(false);
    }
  }, []);

  /** Start the camera, stopping any existing stream first. */
  const startCamera = useCallback(
    async (deviceId?: string) => {
      stopCamera();
      try {
        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? {
                deviceId: { exact: deviceId },
                width: { ideal: 1920 },
                height: { ideal: 1080 },
              }
            : { width: { ideal: 1920 }, height: { ideal: 1080 } },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Bail out if the component unmounted while we awaited getUserMedia.
        if (!mountedRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Catch the play() promise — browsers reject it if the element is
          // detached or the user navigates away before playback begins.
          await videoRef.current.play().catch((err: unknown) => {
            console.warn("[CameraPanel] video.play() rejected:", err);
          });
        }

        if (mountedRef.current) {
          setIsCameraOn(true);
          toast("Camera started", "success");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        if (mountedRef.current) {
          toast(`Camera error: ${message}`, "error");
        }
      }
    },
    [stopCamera, toast]
  );

  // ─── Device enumeration ──────────────────────────────────────────────────────

  const refreshDevices = useCallback(async () => {
    try {
      // Request permissions first so browsers populate device labels.
      // Swallow the error — we still attempt enumeration without labels.
      try {
        const probe = await navigator.mediaDevices.getUserMedia({ video: true });
        probe.getTracks().forEach((t) => t.stop());
      } catch {
        // Permission denied or no camera — enumeration continues without labels.
      }

      const all = await navigator.mediaDevices.enumerateDevices();
      const cams = all.filter((d) => d.kind === "videoinput");

      if (!mountedRef.current) return;

      setDevices(cams);
      // Only set the default device if none is selected yet.
      setSelectedDevice((prev) => (prev === "" && cams.length > 0 ? cams[0].deviceId : prev));
    } catch {
      if (mountedRef.current) {
        toast("Could not enumerate cameras", "warning");
      }
    }
  }, [toast]);
  // Note: `selectedDevice` is intentionally NOT in the dependency array.
  // Including it would recreate `refreshDevices` on every device selection,
  // which would retrigger the devicechange listener registration in the effect
  // below — and re-run the effect body on every camera switch.

  useEffect(() => {
    mountedRef.current = true;
    refreshDevices();
    navigator.mediaDevices.addEventListener("devicechange", refreshDevices);

    return () => {
      mountedRef.current = false;
      navigator.mediaDevices.removeEventListener("devicechange", refreshDevices);
      // Always stop the stream on unmount to release the camera hardware.
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [refreshDevices]);

  // ─── Device selection ────────────────────────────────────────────────────────

  const switchCamera = async (deviceId: string) => {
    setSelectedDevice(deviceId);
    setShowDevices(false);
    // Only restart the stream if the camera is already running.
    if (isCameraOn) {
      await startCamera(deviceId);
    }
  };

  // ─── Image capture ───────────────────────────────────────────────────────────

  const captureImage = async () => {
    if (!videoRef.current) return;

    if (!sessionId) {
      toast("No active session — please start a session first", "warning");
      return;
    }

    if (
      videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      videoRef.current.videoWidth === 0
    ) {
      toast("Video feed not ready yet", "warning");
      return;
    }

    setCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast("Canvas not supported in this browser", "error");
        return;
      }

      ctx.drawImage(videoRef.current, 0, 0);
      const raw = canvas.toDataURL("image/jpeg", 0.92);
      await processImage(raw, `capture_${Date.now()}.jpg`);
    } catch {
      if (mountedRef.current) {
        toast("Capture failed", "error");
      }
    } finally {
      if (mountedRef.current) {
        setCapturing(false);
      }
    }
  };

  // ─── Image processing ────────────────────────────────────────────────────────

  const processImage = async (dataUrl: string, fileName: string) => {
    if (!sessionId) return;

    const compressed = await compressImage(dataUrl);
    const quality = await validateImageQuality(compressed);

    // Approximate binary size: base64 encodes 3 bytes → 4 chars.
    const fileSize = Math.round((compressed.length * 3) / 4);

    const img: CapturedImage = {
      id: crypto.randomUUID(),
      inspectionId: sessionId,
      dataUrl: compressed,
      fileName,
      fileSize,
      capturedAt: new Date().toISOString(),
      status: quality.passed ? "pending" : "failed",
      qualityScore: quality.score,
      qualityIssues: quality.issues,
      position: "",
    };

    addImage(img);
    await saveImage(img);

    if (!mountedRef.current) return;

    if (!quality.passed) {
      toast(`Quality check failed: ${quality.issues[0] ?? "unknown issue"}`, "warning");
    } else {
      toast("Image captured", "success");
    }
  };

  // ─── File upload ─────────────────────────────────────────────────────────────

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        toast(`${file.name} exceeds 20 MB limit`, "error");
        continue;
      }

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          // FIX: was missing — without this, a failed read hangs the loop forever.
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });

        await processImage(dataUrl, file.name);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : `Could not load ${file.name}`;
        if (mountedRef.current) {
          toast(message, "error");
        }
      }
    }

    // Reset the input so the same file can be re-uploaded if needed.
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // ─── Derived UI values ───────────────────────────────────────────────────────

  const selectedLabel =
    devices.find((d) => d.deviceId === selectedDevice)?.label ?? "Default Camera";

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Video feed */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
              <CameraOff className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-xs text-gray-500">Camera inactive</p>
          </div>
        )}

        {isCameraOn && (
          <>
            {/* Corner alignment guides */}
            {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
              (corner) => (
                <div
                  key={corner}
                  className={[
                    "absolute w-5 h-5 border-gray-600 border-2",
                    corner.includes("top") ? "top-2" : "bottom-2",
                    corner.includes("left") ? "left-2" : "right-2",
                    corner === "top-left"
                      ? "border-r-0 border-b-0 rounded-tl"
                      : corner === "top-right"
                      ? "border-l-0 border-b-0 rounded-tr"
                      : corner === "bottom-left"
                      ? "border-r-0 border-t-0 rounded-bl"
                      : "border-l-0 border-t-0 rounded-br",
                  ].join(" ")}
                />
              )
            )}

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
            className="absolute inset-0 bg-white/40"
          />
        )}
      </div>

      {/* Camera device selector */}
      <div className="relative">
        <button
          onClick={() => setShowDevices((prev) => !prev)}
          className="w-full flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 hover:border-gray-500 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Usb className="w-3.5 h-3.5 text-gray-600" />
            <span className="truncate max-w-[160px]">{selectedLabel}</span>
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showDevices ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {showDevices && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg"
            >
              {/* FIX: use enumerated index instead of O(n) indexOf */}
              {devices.map((d, index) => (
                <button
                  key={d.deviceId}
                  onClick={() => switchCamera(d.deviceId)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                    d.deviceId === selectedDevice ? "text-gray-900 font-semibold" : "text-gray-700"
                  }`}
                >
                  {d.label !== "" ? d.label : `Camera ${index + 1}`}
                </button>
              ))}

              <button
                onClick={() => {
                  refreshDevices();
                  setShowDevices(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 border-t border-gray-200 flex items-center gap-2"
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
          onClick={() => (isCameraOn ? stopCamera() : startCamera(selectedDevice || undefined))}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCameraOn
              ? "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {isCameraOn ? (
            <CameraOff className="w-4 h-4" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {isCameraOn ? "Stop" : "Start Camera"}
        </button>

        <button
          onClick={captureImage}
          disabled={!isCameraOn || capturing}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-all shadow-sm"
        >
          {capturing ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
          ) : (
            <ZoomIn className="w-4 h-4" />
          )}
          Capture
        </button>
      </div>

      <label className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-white border border-dashed border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-700 cursor-pointer transition-all shadow-sm">
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

      <p className="text-xs text-gray-400 text-center">JPG · PNG · WEBP · Max 20 MB</p>
    </div>
  );
}