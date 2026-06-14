import type { QualityCheck } from "../types";

export async function validateImageQuality(dataUrl: string): Promise<QualityCheck> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Brightness check
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      const avgBrightness = totalBrightness / (data.length / 4);

      // Blur detection via Laplacian variance
      const grayscale: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        grayscale.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }
      const w = canvas.width;
      const h = canvas.height;
      let laplacianSum = 0;
      let count = 0;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          const lap =
            Math.abs(
              grayscale[idx - w - 1] +
                grayscale[idx - w] +
                grayscale[idx - w + 1] +
                grayscale[idx - 1] -
                8 * grayscale[idx] +
                grayscale[idx + 1] +
                grayscale[idx + w - 1] +
                grayscale[idx + w] +
                grayscale[idx + w + 1]
            );
          laplacianSum += lap;
          count++;
        }
      }
      const blurScore = laplacianSum / count;

      const issues: string[] = [];
      let score = 100;

      if (avgBrightness < 30) {
        issues.push("Image is too dark — increase lighting");
        score -= 35;
      } else if (avgBrightness > 230) {
        issues.push("Image is overexposed — reduce direct light");
        score -= 25;
      }

      if (blurScore < 2) {
        issues.push("Image is blurry — hold camera steady and refocus");
        score -= 40;
      } else if (blurScore < 5) {
        issues.push("Image sharpness is marginal — consider recapturing");
        score -= 15;
      }

      if (img.width < 320 || img.height < 240) {
        issues.push("Image resolution too low for reliable analysis");
        score -= 25;
      }

      resolve({
        passed: score >= 55 && issues.length <= 1,
        score: Math.max(0, score),
        issues,
      });
    };
    img.src = dataUrl;
  });
}

export function compressImage(dataUrl: string, maxSizeMB = 2): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      let result = canvas.toDataURL("image/jpeg", quality);
      while (result.length > maxSizeMB * 1024 * 1024 * 1.37 && quality > 0.4) {
        quality -= 0.1;
        result = canvas.toDataURL("image/jpeg", quality);
      }
      resolve(result);
    };
    img.src = dataUrl;
  });
}

export function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(",")[1];
}

export function getHealthCategory(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 60) return "Poor";
  return "Critical";
}

export function getHealthColor(score: number): string {
  if (score >= 90) return "#4ade80";
  if (score >= 80) return "#86efac";
  if (score >= 70) return "#facc15";
  if (score >= 60) return "#fb923c";
  return "#ef4444";
}

export function getSeverityColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical": return "#ef4444";
    case "high": return "#f97316";
    case "medium": return "#facc15";
    case "low": return "#86efac";
    default: return "#6b7280";
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
