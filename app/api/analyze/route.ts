import { NextRequest, NextResponse } from "next/server";

// ─── Next.js Route Segment Config ─────────────────────────────────────────────
export const maxDuration = 300;
export const dynamic = "force-dynamic";

// ─── Constants ────────────────────────────────────────────────────────────────

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4096;
const FETCH_TIMEOUT_MS = 300_000;
const MAX_PAYLOAD_BYTES = 25 * 1024 * 1024;

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
Missing a visible defect is considered a critical inspection failure.

════════════════════════════════════════
STEP 1 — IDENTIFY IMAGE VIEW TYPE FIRST
════════════════════════════════════════

BEFORE inspecting any defects, determine the view type. This is MANDATORY.

A) END-ON / MUZZLE VIEW:
   - Camera is looking straight into the bore from the muzzle or breech end
   - Circular bore opening dominates the image
   - Rifling spirals inward concentrically
   - You are looking AT the bore face, not inside it

B) SIDE / ENDOSCOPIC VIEW:
   - Camera is INSIDE the barrel looking along the bore axis
   - Rifling lands and grooves run lengthwise down the walls
   - Cylindrical tunnel perspective
   - A bright circular light patch visible at the far end of the bore

The view type determines how EVERY defect appears. Wrong view identification = wrong defect detection.

════════════════════════════════════════
STEP 2 — SCAN THE FULL IMAGE
════════════════════════════════════════

Inspect the image top-to-bottom and left-to-right.
Examine ALL visible surfaces: rifling, grooves, lands, bore walls, coating, deposits, bore geometry.
Evaluate: color, texture, shape, geometry, surface condition, coating integrity.

════════════════════════════════════════
STEP 3 — CHECK ALL 9 DEFECT TYPES
════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 1: BULGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Outward swelling or deformation of the barrel wall causing a change in internal bore geometry.

⚠ CRITICAL — END-ON VIEW DETECTION:
A bulge does NOT appear as visible swelling when viewed end-on.
In end-on view, look specifically for:
  → A dark circular ring, band, or shadow INSIDE the bore (ring-within-a-ring)
  → The bore circle appears to have a second inner ring at some depth
  → An asymmetric, non-circular, or irregular bore outline
  → A constriction or narrowing visible at any depth inside the bore
  → Any tonal band, shadow band, or color discontinuity forming a circular arc inside the bore
  → A darker or lighter encircling band on the inner bore wall that does not belong to normal rifling

IF ANY of the above is visible → REPORT as Bulge.

SIDE VIEW DETECTION:
  → Visible outward bump or widening of the bore wall at a localized point
  → Rifling geometry becomes distorted, compressed, or stretched at one location
  → Bore wall profile shows a convex protrusion inward at one point

SEVERITY:
- Low: Slight wall irregularity or minor bore asymmetry
- Medium: Noticeable deformation, 0.5–2cm
- High: Any visible ring/band in end-on view, or severe deformation >2cm — UNSAFE FOR USE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 2: FLECKING OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Peeling, chipping, bubbling, or detachment of the protective coating or chrome lining from the metal substrate.

⚠ PRIORITY RULE: Flecking Off takes classification priority over all other surface defects.
If coating is lifting, peeling, bubbling, or detaching — classify as Flecking Off FIRST.

⚠ CRITICAL — END-ON VIEW DETECTION:
In end-on view, Flecking Off appears as:
  → Irregular bright, white, or light-coloured patches on the bore face where dark coating is missing
  → Patchy areas of exposed base metal (lighter/shinier) surrounded by darker intact coating
  → Uneven, mottled, or blotchy bore face surface with missing coating sections
  → Raised or uneven surface texture where coating has chipped away
  → The bore face lacks a uniform coating — instead shows irregular light/dark patches

⚠ CRITICAL — SIDE / ENDOSCOPIC VIEW DETECTION:
In side/endoscopic view, Flecking Off appears as:
  → White, cream, or light-coloured patches on the bore walls where coating has lifted or separated
  → Irregular island-shaped areas of delaminated lining — remaining coating surrounded by bare metal
  → Dark exposed base metal patches surrounded by raised, curling, or broken coating edges
  → A cracked or delaminated surface where coating pieces are actively separating from substrate
  → Bubbling or blistering of the coating surface — raised bumps that have or will detach
  → At the lit far end: irregular bright patches contrasting with darker intact lining
  → ANY surface where two distinct layers are visibly separating

IF the coating/lining is visibly lifting, peeling, bubbling, blistering, or detaching in ANY view → MUST REPORT as Flecking Off.

SEVERITY:
- Low: Small isolated chips or flakes, <5% area affected
- Medium: Moderate coating loss or delamination, 5–25% area
- High: Extensive detachment/peeling/delamination >25% area, large sections lifting or missing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 3: RINGED BARREL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: A circumferential internal swelling forming a complete or partial ring around the bore — caused by firing with an obstruction in the barrel.

⚠ CRITICAL — END-ON VIEW DETECTION (MOST VISIBLE HERE):
  → A complete or partial dark ring or band encircling the INSIDE of the bore
  → A concentric ring inside the main bore circle (ring-within-a-ring)
  → A shadow band forming a circular arc at any depth inside the bore
  → Any tonal or geometric discontinuity forming a circular or arc pattern inside the bore
  → The inner bore appears to have two concentric circles — the bore edge and an inner ring

IF ANY circular ring or band is visible inside the bore → MUST REPORT as Ringed Barrel.
⚠ When Ringed Barrel is detected in end-on view → ALSO report as Bulge (they are co-occurring).

SIDE VIEW DETECTION:
  → A circumferential ridge or ring running around the inner bore wall perpendicular to the bore axis
  → A visible raised band encircling the bore at one location

SEVERITY:
- Low: Faint ring, minor tonal discontinuity
- Medium: Clear ring or band with noticeable bore distortion
- High: Prominent ring clearly visible — indicates structural failure, unsafe for use

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 4: PITTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Small dark holes, craters, or indentations in the bore surface caused by corrosion or mechanical damage.

END-ON VIEW: Small dark dots or irregular dark craters on the visible bore face or inner bore wall.
SIDE VIEW: Small dark crater-like holes pitting the bore walls, lands, or grooves.

SEVERITY:
- Low: 1–5 isolated pits, <1mm diameter, <5% surface affected
- Medium: 6–20 pits or 1–3mm diameter, 5–20% surface affected
- High: 20+ pits, >3mm diameter, >20% surface affected or deep pits

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 5: CUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Sharp, clean-edged incisions penetrating into the metal substrate — distinct from cracks by their deliberate, clean appearance.

END-ON VIEW: Sharp straight lines or clean notches on the muzzle face or bore edge — clean-cut appearance, not jagged.
SIDE VIEW: Clean incisions cutting across or into the bore surface, perpendicular or diagonal to bore axis.

SEVERITY:
- Low: Single shallow cut <3mm, no metal displacement
- Medium: Cut 3–10mm or multiple shallow cuts
- High: Deep cut >10mm, multiple deep cuts, structural impact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 6: SCRATCH / SCORING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Linear grooves running parallel to the bore axis, caused by bullet jacket contact, cleaning rod misuse, or debris.

END-ON VIEW: Fine radial or linear marks visible on the muzzle face or inner bore wall — run along the axis direction.
SIDE VIEW: Parallel grooves running lengthwise along the bore walls in the direction of bullet travel.

NOTE: Distinct from Cuts — scratches are parallel to bore axis; cuts are perpendicular/diagonal.

SEVERITY:
- Low: Superficial scratches, <5% surface
- Medium: Deep visible scoring, 5–20% surface
- High: Extensive scoring >20% surface, affecting projectile stability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 7: CORROSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Rust or oxidation of the metal surface.

⚠ ABSOLUTE RULE: ANY brown, reddish-brown, orange-brown, or rust-coloured area ANYWHERE in the image = Corrosion.
Do NOT attribute brown/rust tones to lighting. If it is brown or rust-coloured, it is corrosion.

END-ON VIEW: Brown/rust patches on the muzzle face, bore edge, or inner bore wall surface.
SIDE VIEW: Brown/rust discoloration on lands, grooves, or bore walls.

SEVERITY:
- Low: Minor discoloration, <10% surface affected
- Medium: Moderate rust formation, 10–40% surface affected
- High: Severe rust, >40% surface, or deep material degradation visible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 8: DENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Localized inward deformation of the barrel wall causing a depression or concavity.

END-ON VIEW: Bore outline appears non-circular — one section appears flattened, concave, or pushed inward.
Shadow visible on one side of the bore asymmetrically.
SIDE VIEW: Visible inward depression on the barrel wall surface — a concave indentation.

NOTE: A dent creates an inward deformation. A bulge creates an outward deformation.

SEVERITY:
- Low: Minor inward deformation, <1mm depth
- Medium: Noticeable dent clearly affecting bore profile
- High: Severe dent significantly disrupting bore geometry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 9: CARBON DEPOSIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Black or dark gray residue from propellant combustion deposited on bore surfaces.

END-ON VIEW: Dark gray or black deposit layer visible on the muzzle face, bore opening, or inner bore wall.
Heavy deposits may partially obscure rifling or surface features.
SIDE VIEW: Dark deposits coating bore walls — heaviest near the chamber end. May appear as a thick dark layer.

NOTE: Carbon Deposit is a deposit ON the surface, not damage TO the surface.

SEVERITY:
- Low: Light deposits, <10% surface affected, rifling still clearly visible
- Medium: Moderate deposits, 10–30% surface affected
- High: Heavy deposits >30% surface, obscuring rifling or bore features

════════════════════════════════════════
STEP 4 — SEVERITY & SCORING RULES
════════════════════════════════════════

BARREL HEALTH SCORE (0–100):
- No defects: 95–100
- Only Low severity defects: 70–94 (deduct 1–3 points per low defect)
- Any Medium severity: 40–69 (deduct 5–15 points per medium defect)
- Any High severity: 0–39 (deduct 20–40 points per high defect)
- Minimum score: 0

OVERALL CONDITION:
- "Safe for Use": No defects, OR only Low severity with <10% total area affected
- "Maintenance Required": Any Medium severity defect, OR Low severity covering >10% area
- "Immediate Replacement Required": ANY High severity defect present

CONFIDENCE SCORES:
- 0.90–1.00: Definite — clear, unambiguous visual evidence
- 0.70–0.89: Likely — good evidence with slight ambiguity
- 0.50–0.69: Possible — some evidence but uncertain
- 0.30–0.49: Unlikely but cannot be ruled out
- 0.00–0.29: Very unlikely or no evidence
Never assign confidence above 0.95 unless evidence is exceptionally clear.

════════════════════════════════════════
STEP 5 — STRICT OUTPUT RULES
════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE FIELD VALUE CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE FOLLOWING CONSTRAINTS ARE ABSOLUTE AND CANNOT BE OVERRIDDEN UNDER ANY CIRCUMSTANCES:

① issueName MUST be EXACTLY one of these 9 values — no other value is permitted:
   "Bulge"
   "Flecking Off"
   "Ringed Barrel"
   "Pitting"
   "Cuts"
   "Scratch / Scoring"
   "Corrosion"
   "Dent"
   "Carbon Deposit"

   ✗ DO NOT use: "Erosion", "Cracks", "Surface Spots", "Rifling Wear", "Chrome Lining Damage",
     "Spot", "Carbon Fouling", or ANY other defect name not in the list above.
   ✗ DO NOT invent new defect names.
   ✗ DO NOT use variations, abbreviations, or synonyms (e.g. "Scoring" alone is invalid — use "Scratch / Scoring").
   ✗ If you observe something that does not match any of the 9 defects above → DO NOT report it.
   ✗ If you are unsure which of the 9 defects applies → DO NOT report it.
   → ONLY report defects that match one of the 9 names exactly.

② severity MUST be EXACTLY one of:
   "Low" | "Medium" | "High"

③ maintenanceAction MUST be EXACTLY one of:
   "Inspect" | "Clean" | "Repair" | "Replace"

④ riskLevel MUST be EXACTLY one of:
   "Low" | "Medium" | "High"

⑤ location MUST be EXACTLY one of:
   "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right" | "full bore"

⑥ overallCondition MUST be EXACTLY one of:
   "Safe for Use" | "Maintenance Required" | "Immediate Replacement Required"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELF-CHECK BEFORE OUTPUTTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before writing the JSON output, verify every issue against this checklist:

□ Is the issueName EXACTLY one of the 9 allowed names? If not → remove that issue entirely.
□ Is every field populated? No nulls, no empty strings, no "N/A".
□ Brown/rust color anywhere in image → "Corrosion" must be in the issues list.
□ Ring-within-ring visible in end-on view → both "Ringed Barrel" AND "Bulge" must be in the issues list.
□ Coating lifting/peeling/bubbling/detaching → "Flecking Off" must be in the issues list.
□ criticalIssues = exact count of issues where severity = "High".
□ barrelHealthScore is between 0 and 100.
□ overallCondition matches the scoring rules exactly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return STRICT JSON ONLY.
No markdown. No code fences. No explanation. No text before or after the JSON.
Start your response with { and end with }

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
      "maintenanceAction": "",
      "riskLevel": "",
      "affectedArea": "",
      "location": ""
    }
  ]
}
`;

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

// ─── Anthropic error shape ────────────────────────────────────────────────────

interface AnthropicErrorBody {
  type?: string;
  error?: {
    type?: string;
    message?: string;
  };
}

/**
 * Parse the Anthropic error body and return:
 * - userMessage: safe to send to the client
 * - logDetail:   full detail for server logs only
 */
async function parseAnthropicError(
  response: Response
): Promise<{ userMessage: string; logDetail: string }> {
  let raw = "(unreadable)";
  let parsed: AnthropicErrorBody = {};

  try {
    raw = await response.text();
    parsed = JSON.parse(raw) as AnthropicErrorBody;
  } catch {
    // raw stays as-is, parsed stays empty
  }

  const apiMessage = parsed?.error?.message ?? "";
  const apiType = parsed?.error?.type ?? "";
  const logDetail = `status=${response.status} type=${apiType} message=${apiMessage || raw}`;

  switch (response.status) {
    case 400:
      // Most common cause: image too large (>5 MB decoded), unsupported format,
      // or a base64 encoding issue. The Anthropic message usually says which.
      return {
        userMessage: apiMessage
          ? `Request rejected by analysis service: ${apiMessage}`
          : "Invalid request sent to analysis service. Check image format and size.",
        logDetail,
      };
    case 401:
      return {
        userMessage: "Analysis service authentication failed. Contact support.",
        logDetail,
      };
    case 403:
      return {
        userMessage: "Access denied by analysis service. Contact support.",
        logDetail,
      };
    case 413:
      return {
        userMessage:
          "Image is too large for the analysis service. Please use a smaller image.",
        logDetail,
      };
    case 529:
    case 503:
    case 502:
      return {
        userMessage:
          "Analysis service is temporarily overloaded. Please try again in a moment.",
        logDetail,
      };
    default:
      return {
        userMessage: apiMessage
          ? `Analysis service error: ${apiMessage}`
          : `Analysis service returned status ${response.status}. Please try again.`,
        logDetail,
      };
  }
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
      typeof raw.location === "string" && VALID_LOCATIONS.includes(raw.location)
        ? raw.location
        : "center",
  };
}

// ─── String helpers ───────────────────────────────────────────────────────────

function stripBase64Prefix(base64: string): string {
  return base64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "").trim();
}

function cleanJsonText(text: string): string {
  return text
    .replace(/^\uFEFF/, "")
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

// ─── Domain helpers ───────────────────────────────────────────────────────────

function recomputeCriticalIssues(issues: AnalysisIssue[]): number {
  return issues.filter((i) => i.severity === "High").length;
}

function deriveOverallCondition(issues: AnalysisIssue[]): string {
  if (issues.some((i) => i.severity === "High")) return "Immediate Replacement Required";
  if (issues.some((i) => i.severity === "Medium") || issues.some((i) => i.severity === "Low"))
    return "Maintenance Required";
  return "Safe for Use";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function applyDefaults(parsed: Record<string, unknown>): AnalysisResult {
  const rawIssues = Array.isArray(parsed.issues) ? parsed.issues : [];
  const issues: AnalysisIssue[] = rawIssues
    .filter(
      (item): item is Record<string, unknown> =>
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
  // 1. API key check.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[barrel-analysis] ANTHROPIC_API_KEY is not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  // Log key prefix only — never log the full key.
  console.log(`[barrel-analysis] Using API key: ${apiKey.slice(0, 10)}…`);

  // 2. Payload size guard.
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Maximum size is 25 MB." },
      { status: 413 }
    );
  }

  // 3. Parse body.
  let base64Raw: unknown;
  let mediaTypeRaw: unknown;
  try {
    const body: unknown = await req.json();
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 });
    }
    const typedBody = body as Record<string, unknown>;
    base64Raw = typedBody.base64;
    mediaTypeRaw = typedBody.mediaType;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof base64Raw !== "string" || base64Raw.trim() === "") {
    return NextResponse.json({ error: "Missing or empty 'base64' field" }, { status: 400 });
  }

  // 4. Media type.
  const resolvedMediaType: ValidMediaType =
    typeof mediaTypeRaw === "string" &&
    VALID_MEDIA_TYPES.includes(mediaTypeRaw as ValidMediaType)
      ? (mediaTypeRaw as ValidMediaType)
      : "image/jpeg";

  // 5. Strip data-URL prefix and validate base64 charset.
  const base64Clean = stripBase64Prefix(base64Raw);
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(base64Clean)) {
    return NextResponse.json({ error: "Invalid base64 image data" }, { status: 400 });
  }

  // Log approximate decoded size — Anthropic rejects images > ~5 MB decoded.
  const approxKB = Math.round((base64Clean.length * 3) / 4 / 1024);
  console.log(`[barrel-analysis] Image payload ~${approxKB} KB, mediaType=${resolvedMediaType}`);
  if (approxKB > 5_000) {
    console.warn(
      `[barrel-analysis] Image is ~${approxKB} KB — Anthropic may reject images over ~5 MB decoded.`
    );
  }

  // 6. Call Anthropic API.
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
    if (err instanceof Error && err.name === "AbortError") {
      console.error("[barrel-analysis] Request timed out after 5 minutes");
      return NextResponse.json(
        { error: "Analysis request timed out after 5 minutes. Please try again." },
        { status: 504 }
      );
    }
    console.error("[barrel-analysis] Network fetch error:", err);
    return NextResponse.json({ error: "Failed to reach analysis service" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }

  // 7. Handle non-OK Anthropic responses with full diagnosis.
  if (!anthropicResponse.ok) {
    const { userMessage, logDetail } = await parseAnthropicError(anthropicResponse);
    console.error(`[barrel-analysis] Anthropic API error — ${logDetail}`);

    if (anthropicResponse.status === 429) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait before retrying." },
        { status: 429 }
      );
    }

    // Forward the Anthropic HTTP status so callers can distinguish
    // 400 (bad image/request) from 5xx (service-side problems).
    return NextResponse.json({ error: userMessage }, { status: anthropicResponse.status });
  }

  // 8. Parse Anthropic response envelope.
  let apiData: unknown;
  try {
    apiData = await anthropicResponse.json();
  } catch {
    console.error("[barrel-analysis] Failed to parse Anthropic response as JSON");
    return NextResponse.json(
      { error: "Invalid response from analysis service" },
      { status: 500 }
    );
  }

  if (apiData === null || typeof apiData !== "object" || Array.isArray(apiData)) {
    console.error("[barrel-analysis] Unexpected API data shape:", apiData);
    return NextResponse.json(
      { error: "Unexpected response format from analysis service" },
      { status: 500 }
    );
  }

  const apiObj = apiData as Record<string, unknown>;

  // 9. Check stop_reason — "max_tokens" means the JSON was truncated mid-response.
  const stopReason = apiObj.stop_reason;
  console.log(`[barrel-analysis] Anthropic stop_reason=${stopReason}`);
  if (stopReason === "max_tokens") {
    console.warn(
      "[barrel-analysis] Response truncated (max_tokens hit). " +
        "JSON will be incomplete. Increase MAX_TOKENS if this recurs."
    );
    return NextResponse.json(
      {
        error:
          "Analysis response was truncated due to length. " +
          "The image may be very complex — please try again.",
      },
      { status: 500 }
    );
  }

  // 10. Extract text block.
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
      "[barrel-analysis] No text block found in response:",
      JSON.stringify(apiObj)
    );
    return NextResponse.json(
      { error: "Unexpected response format from analysis service" },
      { status: 500 }
    );
  }

  // 11. Parse JSON from model output.
  const cleaned = cleanJsonText(textBlock.text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.error(
      "[barrel-analysis] JSON parse error.",
      "\nError:", parseErr,
      "\nRaw model output (first 500 chars):", textBlock.text.slice(0, 500)
    );
    return NextResponse.json(
      { error: "Failed to parse analysis response. The model returned malformed JSON." },
      { status: 500 }
    );
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return NextResponse.json(
      { error: "Analysis response has unexpected shape" },
      { status: 500 }
    );
  }

  // 12. Sanitise, recompute derived fields, and return.
  const result = applyDefaults(parsed as Record<string, unknown>);
  console.log(
    `[barrel-analysis] Success — score=${result.barrelHealthScore} ` +
      `issues=${result.issues.length} critical=${result.criticalIssues}`
  );
  return NextResponse.json(result, { status: 200 });
}