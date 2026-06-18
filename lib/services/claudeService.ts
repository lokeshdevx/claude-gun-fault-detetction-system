import type { AnalysisResult } from "../types";
import { dataUrlToBase64 } from "../utils/imageUtils";

// ─── Constants ────────────────────────────────────────────────────────────────

// Must be >= the server-side FETCH_TIMEOUT_MS (300_000ms / 5 min).
// Give the client a small extra buffer so the server can respond before
// the browser kills the connection.
const CLIENT_TIMEOUT_MS = 310_000; // 5 min 10 sec

// ─── Core analysis call ───────────────────────────────────────────────────────

export async function analyzeBarrelImage(dataUrl: string): Promise<AnalysisResult> {
  const base64 = dataUrlToBase64(dataUrl);
  const mediaType = dataUrl.startsWith("data:image/png") ? "image/png" : "image/jpeg";

  // AbortController lets us cancel the fetch if it exceeds CLIENT_TIMEOUT_MS.
  // Do NOT set a shorter timeout here — the server-side analysis can take
  // several minutes for a detailed endoscopic image.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch("/api/analyze", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64, mediaType }),
    });
  } catch (err: unknown) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        "Analysis timed out after 5 minutes. Please try again with a smaller image."
      );
    }
    throw new Error(
      `Network error while contacting analysis service: ${err instanceof Error ? err.message : String(err)}`
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    // Server always returns JSON errors — parse them properly.
    let message = `Analysis failed with status ${response.status}`;
    try {
      const errBody = await response.json();
      if (typeof errBody?.error === "string") {
        message = errBody.error;
      }
    } catch {
      // If JSON parsing fails fall back to the status-based message above.
    }
    throw new Error(message);
  }

  const data = await response.json();
  return data as AnalysisResult;
}

// ─── Batch analysis ───────────────────────────────────────────────────────────

export async function analyzeMultipleImages(
  dataUrls: string[],
  onProgress: (completed: number, total: number) => void
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];

  for (let i = 0; i < dataUrls.length; i++) {
    onProgress(i, dataUrls.length);
    try {
      const result = await analyzeBarrelImage(dataUrls[i]);
      results.push(result);
    } catch (err: unknown) {
      // Push a safe sentinel result so one failure doesn't abort the batch.
      results.push({
        barrelHealthScore: 0,
        overallCondition: `Analysis failed: ${err instanceof Error ? err.message : String(err)}`,
        criticalIssues: 0,
        issues: [],
      });
    }
  }

  onProgress(dataUrls.length, dataUrls.length);
  return results;
}

// ─── Aggregation helpers ──────────────────────────────────────────────────────

/**
 * Returns the average barrel health score across all results that have a
 * non-zero score. Returns 0 if every result failed.
 */
export function aggregateHealthScore(results: AnalysisResult[]): number {
  if (!results.length) return 0;
  const scores = results
    .filter((r) => r.barrelHealthScore > 0)
    .map((r) => r.barrelHealthScore);
  if (!scores.length) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Maps an aggregate health score to a human-readable recommendation.
 * Thresholds align with the server-side severity classification rules.
 */
export function getOverallRecommendation(score: number): string {
  if (score >= 90) return "Serviceable — Barrel is in excellent condition";
  if (score >= 80) return "Serviceable — Routine cleaning recommended";
  if (score >= 70) return "Requires Cleaning — Schedule preventive maintenance";
  if (score >= 60) return "Requires Maintenance — Do not deploy without inspection";
  return "Critical Safety Risk — Remove from service immediately";
}