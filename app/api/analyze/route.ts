import { NextRequest, NextResponse } from "next/server";

// ─── Next.js Route Segment Config ─────────────────────────────────────────────
// Prevents the serverless function from being killed before the response arrives.
// Vercel Hobby: max 60s — change both this and FETCH_TIMEOUT_MS to 60 / 60_000.
// Vercel Pro/Enterprise: up to 300s.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

// ─── Constants ────────────────────────────────────────────────────────────────

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4096;
const FETCH_TIMEOUT_MS = 300_000; // 5 minutes — barrel vision analysis can be slow
const MAX_PAYLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

const VALID_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

type ValidMediaType = (typeof VALID_MEDIA_TYPES)[number];

// ─── Prompt ───────────────────────────────────────────────────────────────────

const ANALYSIS_PROMPT = `You are a certified senior firearm barrel inspection specialist with 20+ years of experience in defense armament quality control. Your task is to perform an exhaustive, forensic-level analysis of this endoscopic barrel image.

CRITICAL INSTRUCTION:
You MUST analyze the ENTIRE image systematically and report EVERY visible defect supported by visual evidence.

DO NOT skip any defect type during inspection.

For EACH of the listed defect categories:
- Explicitly check whether it is present or absent.
- Report a defect only when there is visible evidence.
- Multiple defects may exist in the same area and must all be reported.
- A single visual anomaly may belong to multiple defect categories if evidence supports it.
- Missing a visible defect is considered a critical inspection failure.

IMAGE ANALYSIS REQUIREMENTS:
- Inspect the image from top-to-bottom and left-to-right.
- Examine all visible barrel surfaces, rifling, grooves, lands, coating areas, and deposits.
- Evaluate color, texture, shape, geometry, surface condition, and coating integrity.
- Look for both primary defects and secondary defects that may occur together.

EVIDENCE REQUIREMENT:
Every reported defect MUST include:
- Specific visual evidence
- Exact image location
- Observable characteristics
- Severity assessment
- Confidence score

CONFIDENCE GUIDELINES:
- Use high confidence only when clear visual evidence exists.
- Reduce confidence when image quality, lighting, blur, reflections, shadows, fouling, or obstruction limits certainty.
- Never assign confidence above 0.95 unless evidence is exceptionally clear.

IMPORTANT:
- Do not ignore small defects.
- Do not merge different defect types into a single finding.
- Report all observable defects independently.
- If uncertainty exists, report with lower confidence rather than omitting visible evidence.
- Be conservative when classifying structural defects but thorough when documenting surface abnormalities.

════════════════════════════════════════
DEFECT TYPES TO IDENTIFY (CHECK EACH)
════════════════════════════════════════

For EACH of these 15 defect types, determine if present:
1. Pitting - Small dark holes, craters, or indentations
2. Bulge - Outward swelling, deformation, or asymmetric barrel wall
3. Corrosion - Brown, reddish-brown, orange-brown, rust-colored areas (CRITICAL: Any brown/rust color = corrosion)
4. Flecking Off - Peeling, chipping, or detachment of protective coating
5. Surface Spots - Localized abnormal dark, brown, black, orange, gray, or metallic spots
6. Cracks - Linear fractures, splits, or fissures
7. Erosion - Gradual surface wear, roughened texture
8. Carbon Fouling - Black or dark gray residue deposits
9. Rifling Wear - Rounded, smoothed, or diminished rifling lands and grooves
10. Spot - Single well-defined circular/oval mark (1-10mm, clear boundary)
11. Cuts - Sharp, clean-edged incisions penetrating into metal substrate
12. Ringed Barrel - Circular internal swelling around barrel circumference
13. Dent - Localized inward deformation
14. Scratch/Scoring - Linear grooves parallel to bore axis
15. Chrome Lining Damage - Peeling, cracking, flaking, or uneven chrome

════════════════════════════════════════
SEVERITY CLASSIFICATION RULES
════════════════════════════════════════

PITTING:
- Low: 1-5 isolated pits, <1mm diameter, <5% surface affected
- Medium: 6-20 pits or 1-3mm diameter, 5-20% surface affected
- High: 20+ pits, >3mm diameter, >20% surface affected, deep pits

BULGE:
- Low: slight wall irregularity, minor asymmetry, <0.5cm
- Medium: noticeable deformation, 0.5-2cm
- High: severe deformation >2cm, unsafe for operation

CORROSION:
- Low: minor brown/rust discoloration, <10% surface
- Medium: moderate rust formation, 10-40% surface
- High: severe rust, >40% surface, deep material degradation

FLECKING OFF:
- Low: small isolated chips/flakes, <5% area
- Medium: moderate coating loss, 5-25% area
- High: extensive coating failure >25% area

SURFACE SPOTS:
- Low: 1-5 isolated spots, <5% surface
- Medium: multiple spots, 5-15% surface
- High: extensive spotting >15% surface

CRACKS:
- Low: single hairline crack <5mm
- Medium: multiple cracks or 5-20mm length
- High: structural cracks >20mm

EROSION:
- Low: minor surface roughness
- Medium: noticeable wear, 10-30% surface
- High: severe degradation >30%

CARBON FOULING:
- Low: <10% surface affected
- Medium: 10-30% surface affected
- High: >30% surface affected

RIFLING WEAR:
- Low: slight rounding of rifling edges
- Medium: noticeable reduction in definition
- High: severe loss of rifling geometry

SPOT:
- Low: single spot <3mm, superficial
- Medium: spot 3-7mm or multiple spots
- High: spot >7mm or deep structural mark

CUTS:
- Low: single shallow cut <3mm, no metal displacement
- Medium: cut 3-10mm or multiple shallow cuts
- High: deep cut >10mm, multiple deep cuts, structural impact

RINGED BARREL:
- Low: minor ring deformation
- Medium: moderate ring with visible distortion
- High: severe ring compromising integrity

DENT:
- Low: minor inward deformation, <1mm depth
- Medium: noticeable dent affecting profile
- High: severe dent disrupting bore

SCRATCH/SCORING:
- Low: superficial scratches
- Medium: deep visible scoring
- High: extensive scoring affecting functionality

CHROME LINING DAMAGE:
- Low: <5% lining loss
- Medium: 5-25% lining loss
- High: >25% lining loss

════════════════════════════════════════
CONFIDENCE SCORES
════════════════════════════════════════
- 0.90-1.00: Definite, clearly visible, unambiguous evidence
- 0.70-0.89: Likely, good evidence but slight ambiguity
- 0.50-0.69: Possible, some evidence but uncertain
- 0.30-0.49: Unlikely but cannot rule out
- 0.00-0.29: Very unlikely or no evidence

════════════════════════════════════════
BARREL HEALTH SCORE (0-100)
════════════════════════════════════════
Calculate based on defects present:
- No defects: 95-100
- Only Low severity: 70-94 (deduct 1-3 points per low defect)
- Medium severity present: 40-69 (deduct 5-15 points per medium defect)
- High severity present: 0-39 (deduct 20-40 points per high defect)
- Minimum score 0, maximum 100

════════════════════════════════════════
OVERALL CONDITION STATUS
════════════════════════════════════════
- "Safe for Use": No defects found OR only Low severity with <10% affected area
- "Maintenance Required": Any Medium severity, or Low severity covering >10% area
- "Immediate Replacement Required": Any High severity defect

════════════════════════════════════════
CRITICAL ISSUES COUNT
════════════════════════════════════════
Count of issues with severity = "High"

════════════════════════════════════════
FIELD DEFINITIONS FOR EACH ISSUE
════════════════════════════════════════
- issueName: Exactly one of the 15 defect types listed above
- severity: "Low", "Medium", or "High" based on severity rules
- confidence: Number between 0-1 based on confidence score guidelines
- description: 1-2 sentences describing what was observed
- evidence: Specific visual indicators (color, shape, location, size)
- rootCause: Most likely cause (e.g., "moisture exposure", "firing stress", "improper cleaning")
- solution: 1 sentence fix or remediation
- maintenanceAction: "Inspect", "Clean", "Repair", or "Replace"
- riskLevel: "Low", "Medium", or "High" - potential safety/operational risk
- affectedArea: Estimated percentage (e.g., "<5%", "10-20%", ">40%")
- location: "top-left", "top-right", "center", "bottom-left", "bottom-right"

════════════════════════════════════════
ANALYSIS PROCESS (FOLLOW STRICTLY)
════════════════════════════════════════
STEP 1: Scan entire image systematically (top to bottom, left to right)
STEP 2: Check ALL color variations:
   - Brown/rust ANYWHERE -> MUST report Corrosion
   - Black/dark gray -> Carbon Fouling
   - Localized dark spots -> Surface Spots or Spot
STEP 3: Check ALL surface texture anomalies:
   - Holes/craters -> Pitting
   - Linear grooves -> Scratch/Scoring
   - Rough areas -> Erosion
   - Fractures -> Cracks
   - Sharp incisions -> Cuts
STEP 4: Check ALL geometric distortions:
   - Outward swelling -> Bulge
   - Ring-like internal swelling -> Ringed Barrel
   - Inward deformation -> Dent
STEP 5: Check coating integrity:
   - Missing/patching coating -> Flecking Off
   - Chrome peeling -> Chrome Lining Damage
STEP 6: Check rifling definition:
   - Worn/diminished lands/grooves -> Rifling Wear
STEP 7: For EACH defect found, create a complete issue object
STEP 8: If NO defects found, return empty issues array

════════════════════════════════════════
CRITICAL REMINDERS
════════════════════════════════════════
- Brown/rust coloring ALWAYS equals Corrosion - never confuse with lighting
- Missing a defect is more dangerous than over-reporting
- Multiple defect types can exist in one image - report ALL
- Each issue must have ALL fields populated (no nulls or empty strings)
- Confidence must be realistic - do not inflate

════════════════════════════════════════
OUTPUT FORMAT (STRICT JSON - NO MARKDOWN)
════════════════════════════════════════
{
  "barrelHealthScore": 0,
  "overallCondition": "",
  "criticalIssues": 0,
  "issues": [
   {
  "issueName": "",
  "severity": "",
  "confidence": 0,
  "description": "",
  "evidence": "",
  "rootCause": "",
  "solution": "",
  "inspectionSentence": "",
  "maintenanceAction": "",
  "riskLevel": "",
  "affectedArea": "",
  "location": ""
}
  ]
}`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = "Low" | "Medium" | "High";
type MaintenanceAction = "Inspect" | "Clean" | "Repair" | "Replace";

interface AnalysisIssue {
  issueName: string;
  severity: Severity;
  confidence: number;
  description: string;
  evidence: string;
  rootCause: string;
  solution: string;
  maintenanceAction: MaintenanceAction;
  riskLevel: Severity;
  affectedArea: string;
  location: string;
}

interface AnalysisResult {
  barrelHealthScore: number;
  overallCondition: string;
  criticalIssues: number;
  issues: AnalysisIssue[];
}

// ─── Validation helpers ───────────────────────────────────────────────────────

const VALID_SEVERITIES: Severity[] = ["Low", "Medium", "High"];
const VALID_MAINTENANCE_ACTIONS: MaintenanceAction[] = [
  "Inspect",
  "Clean",
  "Repair",
  "Replace",
];
const VALID_LOCATIONS = [
  "top-left",
  "top-right",
  "center",
  "bottom-left",
  "bottom-right",
];
const VALID_ISSUE_NAMES = [
  "Pitting",
  "Bulge",
  "Corrosion",
  "Flecking Off",
  "Surface Spots",
  "Cracks",
  "Erosion",
  "Carbon Fouling",
  "Rifling Wear",
  "Spot",
  "Cuts",
  "Ringed Barrel",
  "Dent",
  "Scratch/Scoring",
  "Chrome Lining Damage",
];

function isSeverity(value: unknown): value is Severity {
  return typeof value === "string" && VALID_SEVERITIES.includes(value as Severity);
}

function isMaintenanceAction(value: unknown): value is MaintenanceAction {
  return (
    typeof value === "string" &&
    VALID_MAINTENANCE_ACTIONS.includes(value as MaintenanceAction)
  );
}

/**
 * Sanitise and coerce a raw issue object into a typed AnalysisIssue.
 * Falls back to safe defaults for any field that is missing, null, or invalid.
 */
function sanitiseIssue(raw: Record<string, unknown>): AnalysisIssue {
  return {
    issueName:
      typeof raw.issueName === "string" && VALID_ISSUE_NAMES.includes(raw.issueName)
        ? raw.issueName
        : "Unknown",
    severity: isSeverity(raw.severity) ? raw.severity : "Low",
    confidence:
      typeof raw.confidence === "number" &&
      raw.confidence >= 0 &&
      raw.confidence <= 1
        ? raw.confidence
        : 0,
    description:
      typeof raw.description === "string" && raw.description.trim() !== ""
        ? raw.description.trim()
        : "No description provided.",
    evidence:
      typeof raw.evidence === "string" && raw.evidence.trim() !== ""
        ? raw.evidence.trim()
        : "No evidence provided.",
    rootCause:
      typeof raw.rootCause === "string" && raw.rootCause.trim() !== ""
        ? raw.rootCause.trim()
        : "Unknown root cause.",
    solution:
      typeof raw.solution === "string" && raw.solution.trim() !== ""
        ? raw.solution.trim()
        : "Consult a qualified armourer.",
    maintenanceAction: isMaintenanceAction(raw.maintenanceAction)
      ? raw.maintenanceAction
      : "Inspect",
    riskLevel: isSeverity(raw.riskLevel) ? raw.riskLevel : "Low",
    affectedArea:
      typeof raw.affectedArea === "string" && raw.affectedArea.trim() !== ""
        ? raw.affectedArea.trim()
        : "Unknown",
    location:
      typeof raw.location === "string" &&
      VALID_LOCATIONS.includes(raw.location)
        ? raw.location
        : "center",
  };
}

// ─── String helpers ───────────────────────────────────────────────────────────

/** Strip data-URL prefix browsers attach to base64 strings. */
function stripBase64Prefix(base64: string): string {
  return base64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "").trim();
}

/**
 * Remove markdown code fences Claude occasionally wraps around JSON.
 * Also trims leading/trailing whitespace and BOM characters.
 */
function cleanJsonText(text: string): string {
  return text
    .replace(/^\uFEFF/, "")          // BOM
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

// ─── Domain helpers ───────────────────────────────────────────────────────────

/** Always recompute criticalIssues from the issues array — never trust the model. */
function recomputeCriticalIssues(issues: AnalysisIssue[]): number {
  return issues.filter((i) => i.severity === "High").length;
}

/**
 * Derive the overall condition from the actual issues array so the result
 * is always internally consistent, regardless of what the model returned.
 */
function deriveOverallCondition(issues: AnalysisIssue[]): string {
  if (issues.some((i) => i.severity === "High")) {
    return "Immediate Replacement Required";
  }
  if (
    issues.some((i) => i.severity === "Medium") ||
    issues.some((i) => i.severity === "Low")
  ) {
    return "Maintenance Required";
  }
  return "Safe for Use";
}

/** Clamp a number to [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Apply safe defaults to every field, sanitise all issues, and recompute
 * derived fields (criticalIssues, overallCondition) from the real data.
 */
function applyDefaults(parsed: Record<string, unknown>): AnalysisResult {
  const rawIssues = Array.isArray(parsed.issues) ? parsed.issues : [];

  // Filter out non-object entries and sanitise each one.
  const issues: AnalysisIssue[] = rawIssues
    .filter((item): item is Record<string, unknown> =>
      item !== null && typeof item === "object" && !Array.isArray(item)
    )
    .map((item) => sanitiseIssue(item));

  const barrelHealthScore =
    typeof parsed.barrelHealthScore === "number"
      ? clamp(Math.round(parsed.barrelHealthScore), 0, 100)
      : 100;

  return {
    barrelHealthScore,
    overallCondition: deriveOverallCondition(issues),
    issues,
    criticalIssues: recomputeCriticalIssues(issues),
  };
}

// ─── Route handlers ───────────────────────────────────────────────────────────

/** All methods other than POST return 405 with an Allow header. */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export async function POST(req: NextRequest) {
  // 1. Ensure the API key is configured server-side.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[barrel-analysis] ANTHROPIC_API_KEY is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // 2. Enforce payload size limit before buffering the body.
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Maximum size is 25 MB." },
      { status: 413 }
    );
  }

  // 3. Parse and validate the request body.
  let base64Raw: unknown;
  let mediaTypeRaw: unknown;

  try {
    const body: unknown = await req.json();
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object" },
        { status: 400 }
      );
    }
    const typedBody = body as Record<string, unknown>;
    base64Raw = typedBody.base64;
    mediaTypeRaw = typedBody.mediaType;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof base64Raw !== "string" || base64Raw.trim() === "") {
    return NextResponse.json(
      { error: "Missing or empty 'base64' field" },
      { status: 400 }
    );
  }

  // 4. Resolve media type against the whitelist; default to image/jpeg.
  const resolvedMediaType: ValidMediaType =
    typeof mediaTypeRaw === "string" &&
    VALID_MEDIA_TYPES.includes(mediaTypeRaw as ValidMediaType)
      ? (mediaTypeRaw as ValidMediaType)
      : "image/jpeg";

  // 5. Strip the data-URL prefix if the client included it.
  const base64Clean = stripBase64Prefix(base64Raw);

  // Sanity-check: base64 strings contain only [A-Za-z0-9+/=].
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(base64Clean)) {
    return NextResponse.json(
      { error: "Invalid base64 image data" },
      { status: 400 }
    );
  }

  // 6. Call the Anthropic API.
  // AbortController timeout is set to FETCH_TIMEOUT_MS (5 minutes).
  // The Next.js maxDuration export above must be >= this value so the
  // serverless function is not killed before the fetch completes.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let anthropicResponse: Response;
  try {
    anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.1,
        system: ANALYSIS_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: resolvedMediaType,
                  data: base64Clean,
                },
              },
              {
                type: "text",
                text: "Perform a comprehensive barrel fault inspection on this image. Return ONLY the complete JSON analysis. No markdown, no extra text, no explanations.",
              },
            ],
          },
        ],
      }),
    });
  } catch (err: unknown) {
    clearTimeout(timeout);
    const isAbort = err instanceof Error && err.name === "AbortError";
    if (isAbort) {
      return NextResponse.json(
        { error: "Analysis request timed out after 5 minutes. Please try again." },
        { status: 504 }
      );
    }
    console.error("[barrel-analysis] Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to reach analysis service" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }

  // 7. Handle non-OK responses from Anthropic — log details server-side only.
  if (!anthropicResponse.ok) {
    const errText = await anthropicResponse.text().catch(() => "(unreadable)");
    console.error(
      `[barrel-analysis] Anthropic API error [${anthropicResponse.status}]:`,
      errText
    );

    // Surface rate-limit errors explicitly so callers can back off.
    if (anthropicResponse.status === 429) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait before retrying." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Analysis service error. Please try again." },
      { status: anthropicResponse.status }
    );
  }

  // 8. Parse the Anthropic API response envelope.
  let apiData: unknown;
  try {
    apiData = await anthropicResponse.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid response from analysis service" },
      { status: 500 }
    );
  }

  // 9. Extract the first text block — fail explicitly if absent.
  if (
    apiData === null ||
    typeof apiData !== "object" ||
    Array.isArray(apiData)
  ) {
    console.error("[barrel-analysis] Unexpected API data shape:", apiData);
    return NextResponse.json(
      { error: "Unexpected response format from analysis service" },
      { status: 500 }
    );
  }

  const apiObj = apiData as Record<string, unknown>;
  const contentArray = apiObj.content;

  if (!Array.isArray(contentArray)) {
    console.error("[barrel-analysis] Missing content array:", apiObj);
    return NextResponse.json(
      { error: "Unexpected response format from analysis service" },
      { status: 500 }
    );
  }

  const textBlock = contentArray.find(
    (b): b is { type: "text"; text: string } =>
      b !== null &&
      typeof b === "object" &&
      !Array.isArray(b) &&
      (b as Record<string, unknown>).type === "text" &&
      typeof (b as Record<string, unknown>).text === "string"
  );

  if (!textBlock) {
    console.error(
      "[barrel-analysis] No text block in Anthropic response:",
      JSON.stringify(apiObj)
    );
    return NextResponse.json(
      { error: "Unexpected response format from analysis service" },
      { status: 500 }
    );
  }

  // 10. Clean and parse the JSON payload.
  const cleaned = cleanJsonText(textBlock.text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error(
      "[barrel-analysis] JSON parse error. Raw text:",
      textBlock.text
    );
    return NextResponse.json(
      { error: "Failed to parse analysis response" },
      { status: 500 }
    );
  }

  // Guard: parsed must be a plain object.
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return NextResponse.json(
      { error: "Analysis response has unexpected shape" },
      { status: 500 }
    );
  }

  // 11. Sanitise, apply defaults, and recompute derived fields.
  const result = applyDefaults(parsed as Record<string, unknown>);

  return NextResponse.json(result, { status: 200 });
}