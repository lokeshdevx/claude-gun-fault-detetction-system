import type { AnalysisResult } from "../types";
import { dataUrlToBase64 } from "../utils/imageUtils";

const SYSTEM_PROMPT = `You are a Senior Firearm Barrel Inspection Engineer with expertise in military weapon systems, barrel manufacturing, corrosion analysis, bore inspection, rifling wear assessment, metallurgy, and firearms maintenance.

Analyze the provided gun barrel image thoroughly and return ONLY valid JSON matching the exact schema provided. Do not include markdown, backticks, or any text outside the JSON object.

Inspect for: Cracks, Hairline Cracks, Fractures, Pitting, Corrosion, Rust, Surface Damage, Scratches, Fouling, Carbon Deposits, Copper Deposits, Lead Deposits, Rifling Wear, Rifling Damage, Bore Erosion, Heat Damage, Barrel Bulging, Barrel Ring Formation, Barrel Obstruction, Crown Damage, Chamber Damage, Manufacturing Defects, Surface Irregularities, Tool Marks, Material Defects.

For every detected issue provide all fields. If evidence is insufficient, set evidence to "Insufficient visual evidence". Never invent defects.

Estimate the approximate location of each issue as one of: "top-left", "top-right", "center", "bottom-left", "bottom-right".

Response schema (return ONLY this JSON, no other text):
{
  "barrelHealthScore": <0-100 integer>,
  "overallCondition": "<brief overall assessment>",
  "criticalIssues": <integer count>,
  "issues": [
    {
      "issueName": "<name>",
      "severity": "<critical|high|medium|low|none>",
      "confidence": <0-100 integer>,
      "description": "<detailed description>",
      "evidence": "<what in the image supports this finding>",
      "rootCause": "<probable cause>",
      "solution": "<recommended fix>",
      "maintenanceAction": "<specific maintenance step>",
      "riskLevel": "<Immediate Safety Risk|High|Moderate|Low>",
      "affectedArea": "<percentage of barrel affected>",
      "location": "<top-left|top-right|center|bottom-left|bottom-right>"
    }
  ]
}`;

export async function analyzeBarrelImage(dataUrl: string): Promise<AnalysisResult> {
  const base64 = dataUrlToBase64(dataUrl);
  const mediaType = dataUrl.startsWith("data:image/png") ? "image/png" : "image/jpeg";

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64, mediaType }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Analysis failed: ${err}`);
  }

  const data = await response.json();
  return data as AnalysisResult;
}

export async function analyzeMultipleImages(
  dataUrls: string[],
  onProgress: (i: number, total: number) => void
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];
  for (let i = 0; i < dataUrls.length; i++) {
    onProgress(i, dataUrls.length);
    try {
      const result = await analyzeBarrelImage(dataUrls[i]);
      results.push(result);
    } catch (e) {
      results.push({
        barrelHealthScore: 0,
        overallCondition: "Analysis failed",
        criticalIssues: 0,
        issues: [],
        rawResponse: String(e),
      });
    }
  }
  onProgress(dataUrls.length, dataUrls.length);
  return results;
}

export function aggregateHealthScore(results: AnalysisResult[]): number {
  if (!results.length) return 0;
  const scores = results
    .filter((r) => r.barrelHealthScore > 0)
    .map((r) => r.barrelHealthScore);
  if (!scores.length) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getOverallRecommendation(score: number): string {
  if (score >= 90) return "Serviceable — Barrel is in excellent condition";
  if (score >= 80) return "Serviceable — Routine cleaning recommended";
  if (score >= 70) return "Requires Cleaning — Schedule preventive maintenance";
  if (score >= 60) return "Requires Maintenance — Do not deploy without inspection";
  return "Critical Safety Risk — Remove from service immediately";
}
