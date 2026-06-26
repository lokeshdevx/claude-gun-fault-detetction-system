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

// Flecking Off confidence gate — drop any result below this threshold
const FLECKING_OFF_MIN_CONFIDENCE = 0.92;

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
STEP 0 — UNDERSTAND NORMAL BARREL ANATOMY FIRST
════════════════════════════════════════

BEFORE inspecting for defects, you MUST understand what a NORMAL barrel interior looks like.
Misidentifying normal anatomy as a defect is a critical inspection error.

NORMAL BARREL ANATOMY:

  ► RIFLING LANDS (most commonly misidentified feature):
    - The raised helical ridges that impart spin to the bullet
    - Appear as LARGE, BROAD, SMOOTH curved surfaces sweeping from bore edge toward center
    - Have a rounded, convex profile — CURVED surfaces, not flat patches
    - Cover 30–50% of the visible bore surface each
    - Reflect endoscope light as large smooth highlights or broad grey/silver zones
    - Highlight gradient is smooth and GRADUAL — bright at apex, fading symmetrically
    - Spiral inward concentrically in a regular repeating geometric pattern
    - CRITICAL: A rifling land surface — even if light-coloured, bright, or large — is NEVER a defect

  ► RIFLING GROOVES:
    - Darker recessed channels between the lands
    - Run in a regular helical pattern parallel to the lands
    - Brown/rust colour in grooves = CORROSION only — NOT coating delamination
    - Do NOT misread corroded grooves as Flecking Off

  ► GAS CHAMBER / GAS PORT REGION:
    - May appear as a circular/oval dark hole in the bore wall
    - Surrounding discoloration, carbon fouling, heat staining around port = NORMAL
    - Gas port erosion and carbon fouling are NOT Flecking Off
    - KEY TEST: Irregular patch near a hole in bore wall → gas port anatomy, not Flecking Off

  ► ENDOSCOPE LIGHTING EFFECTS:
    - Bright white/silver curved highlights on land apexes = specular reflection, NOT a defect
    - Overall image may be bright on one side and darker on the other — normal
    - In close-up end-on view: the entire bore face may appear broadly light/white due to
      light bouncing inside the bore — this is LIGHTING, not coating delamination

  ► CONTRAST REFERENCE — COMMIT THIS TO MEMORY:
    NORMAL = large smooth curved grey panel, gradual tonal gradient, follows helical land geometry.
    OR: broad light/white appearance of bore face in close-up view from lighting.
    TRUE Flecking Off = small localised island patch, jagged broken edges, physically raised
    coating lift visible as a 3D lift, two-tone contrast between intact coating and exposed substrate.
    If suspicious area looks like NORMAL → STOP. Do not report as Flecking Off.

════════════════════════════════════════
STEP 1 — IDENTIFY IMAGE VIEW TYPE (MANDATORY)
════════════════════════════════════════

Identify the view type BEFORE inspecting any defects.
Wrong view identification = wrong defect detection.

───────────────────────────────────────
A) STANDARD END-ON / MUZZLE VIEW:
───────────────────────────────────────
  - Camera at muzzle/breech end, some distance from bore
  - Circular bore opening visible, surrounded by barrel face/crown
  - Rifling spirals visible concentrically inside bore circle
  - Bore takes up moderate portion of image — barrel face/crown visible around it

  DEFECTS IN THIS VIEW:
  - Bulge/Ringed Barrel: dark ring or band INSIDE the bore circle (ring-within-a-ring)
  - Pitting: small dark dots on bore face
  - Cuts: sharp notches on muzzle crown or bore edge
  - Flecking Off: irregular patches with visible coating lift on bore face

───────────────────────────────────────
B) CLOSE-UP / MACRO END-ON VIEW:
───────────────────────────────────────
  - Camera very close to or inside the bore entrance
  - Bore wall fills the ENTIRE image frame — no external barrel face visible
  - Large circular/oval bore interior fills the frame
  - Rifling lands and grooves visible around full circumference of bore wall
  - Dark central area (bore tunnel) visible at center of image
  - THIS IS STILL AN END-ON VIEW — camera looking INTO the bore, not along it

  ⚠ CRITICAL — HOW TO IDENTIFY THIS VIEW:
  You are in a close-up end-on view if: the bore occupies most/all of the frame,
  you can see the bore wall curving around all sides, and there is a dark tunnel at center.

  ⚠ CRITICAL — DEFECTS IN THIS VIEW:

  BULGE / RINGED BARREL (HIGHEST PRIORITY):
  → Appears as a DARK CIRCUMFERENTIAL BAND OR SHADOW RING at mid-radius within the bore
  → Sits between the outer bore wall and the central dark tunnel
  → The dark ring follows the circular bore geometry — it encircles the bore interior
  → It is NOT a scoring mark (scoring is linear/radial), NOT carbon deposit (deposit is
    surface residue), NOT a groove (grooves run helically, not as a complete ring)
  → The ring is a structural deformation — a permanent dark band at one specific radius
  ⚠ IF ANY dark circular band, shadow ring, or circumferential tonal discontinuity is
    visible anywhere within the bore → MUST report as BOTH Bulge AND Ringed Barrel (High severity)

  FLECKING OFF IN CLOSE-UP VIEW — EXTREMELY STRICT:
  → The bore face appearing broadly light/white = LIGHTING REFLECTION — NOT Flecking Off
  → Light areas following smooth curved land geometry = NORMAL LANDS — NOT Flecking Off
  → ONLY report Flecking Off if you see ALL of these simultaneously in one small patch:
     a) A physically raised, curling, or peeling coating edge (3D lift visible)
     b) A random jagged patch boundary NOT following any geometric bore feature
     c) Two-tone contrast: intact coating colour next to exposed substrate in same patch
     d) Small localised patch — not covering broad area of bore face

  OTHER DEFECTS:
  - Pitting: dark crater spots on bore wall surface
  - Scratch/Scoring: linear radial marks running from center outward
  - Corrosion: brown/rust discoloration on bore wall
  - Carbon Deposit: dark grey/black residue coating the bore face

───────────────────────────────────────
C) SIDE / ENDOSCOPIC VIEW:
───────────────────────────────────────
  - Camera INSIDE barrel looking along bore axis — tunnel perspective
  - Rifling lands/grooves run lengthwise down walls
  - Bright circular light patch at far end of bore
  - Large curved grey/silver panels (lands) sweeping from edges toward center

  DEFECTS IN THIS VIEW:
  - Bulge: outward bump or distorted rifling at one location along bore
  - Ringed Barrel: circumferential ridge running perpendicular to bore axis
  - Flecking Off: irregular island patches NOT following land/groove geometry,
    with physically raised coating edge and two-tone substrate contrast
  - Corrosion: brown/rust discoloration in grooves or on lands
  - Scratch/Scoring: linear marks parallel to bore axis

════════════════════════════════════════
STEP 2 — SCAN THE FULL IMAGE
════════════════════════════════════════

Inspect top-to-bottom and left-to-right.
Examine ALL visible surfaces: rifling, grooves, lands, bore walls, coating, deposits, bore geometry.
Evaluate: color, texture, shape, geometry, surface condition, coating integrity.

════════════════════════════════════════
STEP 3 — CHECK ALL 9 DEFECT TYPES
════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 1: BULGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Outward swelling or deformation of barrel wall causing change in internal bore geometry.

⚠ END-ON / CLOSE-UP END-ON VIEW DETECTION (HIGHEST PRIORITY):
Bulge in end-on view appears as a TONAL DISCONTINUITY — not visible physical swelling:
  → Dark circular band, ring, or shadow zone INSIDE the bore at any radius
  → In close-up view: dark circumferential shadow band between outer bore wall and center tunnel
  → Concentric ring inside bore (ring-within-a-ring)
  → Any circular/arc-shaped tonal discontinuity at one specific radius
  → Asymmetric, non-circular bore outline where one arc is deformed

⚠ CLOSE-UP VIEW SPECIFIC: Bulge = DARK SHADOW RING at mid-radius.
→ ANY dark ring, shadow band, or circumferential tonal discontinuity = REPORT as Bulge

SIDE VIEW:
  → Visible outward bump or widening at a localized point
  → Rifling geometry distorted, compressed, or stretched at one location

SEVERITY:
- Low: Slight wall irregularity or minor bore asymmetry
- Medium: Noticeable deformation, 0.5–2cm
- High: Any visible ring/band in end-on or close-up view — UNSAFE FOR USE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 2: FLECKING OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Peeling, chipping, bubbling, or detachment of protective coating or chrome lining
from metal substrate. Defining characteristic: physical separation of two distinct layers —
coating visibly lifting away from substrate with a raised edge visible in the image.

⚠ PRIORITY RULE: Flecking Off takes classification priority — BUT ONLY when coating
delamination is UNAMBIGUOUSLY confirmed by ALL criteria below.

⚠ STEP A — MANDATORY ANATOMY EXCLUSION (check FIRST, eliminate before proceeding):

  ✗ RIFLING LAND SURFACE — Large, broad, smooth curved area with gradual tonal gradient.
    KEY TEST: Does area have smooth gradual gradient matching a curved surface?
    If YES → NORMAL LAND. Stop. Do not report as Flecking Off.

  ✗ GENERAL BORE FACE BRIGHTNESS — Broad light/white appearance of bore face or bore
    walls in close-up end-on view caused by light bouncing inside the bore tunnel.
    KEY TEST: Is the light area covering a broad area of bore face without clear jagged
    patch boundaries, without visible raised 3D edges, and without small isolated patches?
    If YES → LIGHTING REFLECTION. Stop. Do not report as Flecking Off.

  ✗ SPECULAR REFLECTION ON LAND — Bright white/silver curved highlight on land apex.
    KEY TEST: Smooth curved highlight on land apex with gradual edges?
    If YES → LIGHTING REFLECTION. Stop. Do not report as Flecking Off.

  ✗ CORRODED GROOVE — Brown, orange, rust, dark areas in recessed groove channels.
    KEY TEST: Discoloured area in recessed groove between lands?
    If YES → CORROSION (report separately). Stop. Do not report as Flecking Off.

  ✗ GAS PORT REGION — Dark irregular patches near a hole in bore wall.
    KEY TEST: Irregular patch near a visible hole in bore wall?
    If YES → Gas port anatomy. Stop. Do not report as Flecking Off.

  ✗ SCRATCH LINE — Linear mark parallel to bore axis.
    KEY TEST: Linear mark parallel to bore axis?
    If YES → SCRATCH / SCORING. Stop. Do not report as Flecking Off.

  ✗ CARBON DEPOSIT — Dark flat residue with no layer lifting.
    KEY TEST: Flat dark residue with no layer separation?
    If YES → CARBON DEPOSIT. Stop. Do not report as Flecking Off.

  ✗ CUT — Sharp clean linear incision across or diagonal to bore axis.
    KEY TEST: Clean-edged cut across or diagonal to bore axis?
    If YES → CUTS. Stop. Do not report as Flecking Off.

⚠ STEP B — ALL 4 CRITERIA MUST BE SIMULTANEOUSLY VISIBLE:

  ① PHYSICAL LAYER SEPARATION (MANDATORY):
     A raised, curling, or peeling coating edge VISIBLE as a 3D lift in the image.
     NOT a colour difference — a physical lift creating a shadow or depth cue.
     → Cannot see physically raised/peeling edge → STOP. Do not report.

  ② IRREGULAR NON-GEOMETRIC PATCH SHAPE:
     Random, jagged, island-like boundary. Does NOT follow land, groove, or port geometry.
     NOT a smooth curved gradient. NOT stripe-shaped. NOT broad lighting effect.
     → Shape follows any geometric barrel feature or covers broad area → STOP. Do not report.

  ③ TWO-TONE SUBSTRATE CONTRAST:
     Intact coating colour AND exposed substrate colour visible simultaneously in one patch.
     → No clear two-tone contrast in one localised spot → STOP. Do not report.

  ④ LOCALISED ISOLATION:
     Small localised isolated patch. NOT covering majority of bore (not >40%).
     → Suspicious area covers majority of visible bore → STOP. Do not report.

⚠ STEP C — CONFIDENCE GATE:
  Flecking Off confidence MUST be ≥ 0.92 to report. When in doubt → omit.
  A missed Flecking Off is far less dangerous than a false positive.

  CONTRAST EXAMPLE:
  TRUE Flecking Off = fragmented broken jagged-edged patches, physically raised coating
  lift visible as 3D edge, two-tone contrast, localised to specific small zone.
  FALSE POSITIVE = broad light/white bore face from lighting in close-up view.
  FALSE POSITIVE = large smooth curved grey panel following land geometry.
  FALSE POSITIVE = dark area near gas port.
  If suspicious area matches any FALSE POSITIVE → STOP. Do not report.

SEVERITY:
- Low: Small isolated chips or flakes, <5% area affected
- Medium: Moderate coating loss or delamination, 5–25% area
- High: Extensive detachment/peeling/delamination >25% area, large sections lifting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 3: RINGED BARREL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Circumferential internal swelling forming a complete or partial ring around bore.

⚠ END-ON / CLOSE-UP END-ON VIEW DETECTION (MOST VISIBLE HERE):
  → Complete or partial dark ring or band encircling INSIDE of bore
  → Close-up view: dark circumferential shadow band at mid-radius between outer bore
    wall and central bore tunnel — forming a ring at one specific radius
  → Concentric ring inside main bore circle (ring-within-a-ring)
  → Shadow band forming circular arc at any depth or radius inside bore
  → Any tonal or geometric discontinuity forming circular or arc pattern

⚠ ANY circular ring or band visible inside bore in ANY end-on view →
  MUST REPORT as Ringed Barrel
⚠ When Ringed Barrel detected in any end-on view → ALSO report as Bulge (co-occurring)

SIDE VIEW:
  → Circumferential ridge running around inner bore wall perpendicular to bore axis
  → Visible raised band encircling bore at one location

SEVERITY:
- Low: Faint ring, minor tonal discontinuity
- Medium: Clear ring or band with noticeable bore distortion
- High: Prominent ring clearly visible — structural failure, UNSAFE FOR USE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 4: PITTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Small dark holes, craters, or indentations caused by corrosion or mechanical damage.

END-ON / CLOSE-UP VIEW: Small dark dots or irregular dark craters on bore face or bore wall.
SIDE VIEW: Small dark crater-like holes pitting bore walls, lands, or grooves.

SEVERITY:
- Low: 1–5 isolated pits, <1mm diameter, <5% surface affected
- Medium: 6–20 pits or 1–3mm diameter, 5–20% surface affected
- High: 20+ pits, >3mm diameter, >20% surface affected or deep pits

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 5: CUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Sharp, clean-edged incisions penetrating metal substrate. No layer separation.

END-ON / CLOSE-UP VIEW: Sharp straight lines or clean notches on muzzle crown, bore edge,
or bore wall face — perpendicular or diagonal to bore axis.
SIDE VIEW: Clean incisions cutting across bore surface perpendicular/diagonal to axis.

NOTE: Cuts run ACROSS bore axis. Scratches run ALONG bore axis. Neither shows layer separation.

SEVERITY:
- Low: Single shallow cut <3mm, no metal displacement
- Medium: Cut 3–10mm or multiple shallow cuts
- High: Deep cut >10mm, multiple deep cuts, structural impact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 6: SCRATCH / SCORING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Linear grooves parallel to bore axis. No layer separation.

END-ON / CLOSE-UP VIEW: Fine radial or linear marks on bore face/wall — appear as radial
lines running from center outward when viewed end-on.
SIDE VIEW: Parallel grooves running lengthwise along bore walls in direction of bullet travel.

NOTE: Distinct from Cuts — scratches parallel to bore axis; cuts perpendicular/diagonal.
NOTE: Distinct from Flecking Off — scratches are linear grooves with no coating lift.

SEVERITY:
- Low: Superficial scratches, <5% surface
- Medium: Deep visible scoring, 5–20% surface
- High: Extensive scoring >20% surface, affecting projectile stability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 7: CORROSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Rust or oxidation of metal surface.

⚠ ABSOLUTE RULE: ANY brown, reddish-brown, orange-brown, or rust-coloured area = Corrosion.
Do NOT attribute brown/rust tones to lighting or coating delamination.
If it is brown or rust-coloured → Corrosion. Report as Corrosion only.

END-ON / CLOSE-UP VIEW: Brown/rust patches on bore face, bore wall, or bore edge.
SIDE VIEW: Brown/rust discoloration on lands, grooves, or bore walls.

SEVERITY:
- Low: Minor discoloration, <10% surface affected
- Medium: Moderate rust formation, 10–40% surface affected
- High: Severe rust, >40% surface, or deep material degradation visible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 8: DENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Localized inward deformation of barrel wall causing depression or concavity.

END-ON / CLOSE-UP VIEW: Bore outline appears non-circular — one section flattened, concave,
or pushed inward. Shadow visible asymmetrically on one side.
SIDE VIEW: Visible inward depression on barrel wall — concave indentation.

NOTE: Dent = inward deformation. Bulge = outward deformation.

SEVERITY:
- Low: Minor inward deformation, <1mm depth
- Medium: Noticeable dent clearly affecting bore profile
- High: Severe dent significantly disrupting bore geometry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEFECT 9: CARBON DEPOSIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definition: Black or dark gray residue from propellant combustion deposited on bore surfaces.

END-ON / CLOSE-UP VIEW: Dark gray or black deposit layer on bore face, bore wall, or bore opening.
Heavy deposits may partially obscure rifling or surface features.
SIDE VIEW: Dark deposits coating bore walls — heaviest near chamber end.

NOTE: Carbon Deposit is a deposit ON the surface, not damage TO the surface.
NOTE: Distinct from Flecking Off — no layer separation or coating lift.
NOTE: Carbon fouling around gas port = normal gas port anatomy.

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

⚠ FLECKING OFF SPECIAL RULE: Confidence MUST be ≥ 0.92 to include in output.
If confidence is below 0.92 → omit Flecking Off from issues array entirely.

════════════════════════════════════════
STEP 5 — STRICT OUTPUT RULES
════════════════════════════════════════

ABSOLUTE FIELD VALUE CONSTRAINTS — CANNOT BE OVERRIDDEN:

① issueName MUST be EXACTLY one of these 9 values:
   "Bulge" | "Flecking Off" | "Ringed Barrel" | "Pitting" | "Cuts" |
   "Scratch / Scoring" | "Corrosion" | "Dent" | "Carbon Deposit"

② severity: "Low" | "Medium" | "High"
③ maintenanceAction: "Inspect" | "Clean" | "Repair" | "Replace"
④ riskLevel: "Low" | "Medium" | "High"
⑤ location: "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right" | "full bore"
⑥ overallCondition: "Safe for Use" | "Maintenance Required" | "Immediate Replacement Required"

SELF-CHECK BEFORE OUTPUTTING:
□ Every issueName exactly one of the 9 allowed names? If not → remove.
□ Every field populated — no nulls, no empty strings, no "N/A".
□ Brown/rust colour anywhere → "Corrosion" in issues list.
□ Dark ring, shadow band, or circumferential tonal discontinuity visible anywhere inside
  the bore (in ANY end-on view — standard or close-up) →
  BOTH "Ringed Barrel" AND "Bulge" must be in the issues list at High severity.
□ For any Flecking Off entry:
   - Can I physically SEE a raised/peeling coating edge as a 3D lift? If not → REMOVE.
   - Is broad bore face brightness present? If yes → REMOVE (it is lighting, not Flecking Off).
   - Is the patch truly random, non-geometric, and small? If broad or follows geometry → REMOVE.
   - Is it near a gas port region? If yes → REMOVE.
   - Is confidence ≥ 0.92? If not → REMOVE.
□ criticalIssues = exact count of High severity issues.
□ barrelHealthScore between 0 and 100.
□ overallCondition matches scoring rules exactly.

OUTPUT FORMAT:
Return STRICT JSON ONLY. No markdown. No code fences. No explanation. Start with { end with }

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

interface AnthropicErrorBody {
  type?: string;
  error?: { type?: string; message?: string };
}

// ─── Anthropic error parser ───────────────────────────────────────────────────
async function parseAnthropicError(
  response: Response
): Promise<{ userMessage: string; logDetail: string }> {
  let raw = "(unreadable)";
  let parsed: AnthropicErrorBody = {};
  try {
    raw = await response.text();
    parsed = JSON.parse(raw) as AnthropicErrorBody;
  } catch {}
  const apiMessage = parsed?.error?.message ?? "";
  const apiType = parsed?.error?.type ?? "";
  const logDetail = `status=${response.status} type=${apiType} message=${apiMessage || raw}`;
  switch (response.status) {
    case 400:
      return {
        userMessage: apiMessage
          ? `Request rejected by analysis service: ${apiMessage}`
          : "Invalid request sent to analysis service. Check image format and size.",
        logDetail,
      };
    case 401:
      return { userMessage: "Analysis service authentication failed. Contact support.", logDetail };
    case 403:
      return { userMessage: "Access denied by analysis service. Contact support.", logDetail };
    case 413:
      return { userMessage: "Image is too large for the analysis service. Please use a smaller image.", logDetail };
    case 529:
    case 503:
    case 502:
      return { userMessage: "Analysis service is temporarily overloaded. Please try again in a moment.", logDetail };
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
const VALID_MAINTENANCE_ACTIONS: MaintenanceAction[] = ["Inspect", "Clean", "Repair", "Replace"];
const VALID_LOCATIONS = ["top-left", "top-right", "center", "bottom-left", "bottom-right", "full bore"];
const VALID_ISSUE_NAMES = [
  "Bulge", "Flecking Off", "Ringed Barrel", "Pitting",
  "Cuts", "Scratch / Scoring", "Corrosion", "Dent", "Carbon Deposit",
];

function isSeverity(v: unknown): v is Severity {
  return typeof v === "string" && VALID_SEVERITIES.includes(v as Severity);
}
function isMaintenanceAction(v: unknown): v is MaintenanceAction {
  return typeof v === "string" && VALID_MAINTENANCE_ACTIONS.includes(v as MaintenanceAction);
}

function sanitiseIssue(raw: Record<string, unknown>): AnalysisIssue {
  return {
    issueName:
      typeof raw.issueName === "string" && VALID_ISSUE_NAMES.includes(raw.issueName)
        ? raw.issueName
        : "Unknown",
    severity: isSeverity(raw.severity) ? raw.severity : "Low",
    confidence:
      typeof raw.confidence === "number" && raw.confidence >= 0 && raw.confidence <= 1
        ? raw.confidence
        : 0,
    description:
      typeof raw.description === "string" && raw.description.trim()
        ? raw.description.trim()
        : "No description provided.",
    evidence:
      typeof raw.evidence === "string" && raw.evidence.trim()
        ? raw.evidence.trim()
        : "No evidence provided.",
    rootCause:
      typeof raw.rootCause === "string" && raw.rootCause.trim()
        ? raw.rootCause.trim()
        : "Unknown root cause.",
    solution:
      typeof raw.solution === "string" && raw.solution.trim()
        ? raw.solution.trim()
        : "Consult a qualified armourer.",
    maintenanceAction: isMaintenanceAction(raw.maintenanceAction)
      ? raw.maintenanceAction
      : "Inspect",
    riskLevel: isSeverity(raw.riskLevel) ? raw.riskLevel : "Low",
    affectedArea:
      typeof raw.affectedArea === "string" && raw.affectedArea.trim()
        ? raw.affectedArea.trim()
        : "Unknown",
    location:
      typeof raw.location === "string" && VALID_LOCATIONS.includes(raw.location)
        ? raw.location
        : "center",
  };
}

// ─── String helpers ───────────────────────────────────────────────────────────
function stripBase64Prefix(b: string): string {
  return b.replace(/^data:image\/[a-zA-Z+]+;base64,/, "").trim();
}
function cleanJsonText(t: string): string {
  return t
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
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ─── Flecking Off confidence gate ─────────────────────────────────────────────
function filterFleckingOff(issues: AnalysisIssue[]): {
  filtered: AnalysisIssue[];
  dropped: number;
} {
  const filtered: AnalysisIssue[] = [];
  let dropped = 0;
  for (const issue of issues) {
    if (
      issue.issueName === "Flecking Off" &&
      issue.confidence < FLECKING_OFF_MIN_CONFIDENCE
    ) {
      dropped++;
      console.warn(
        `[barrel-analysis] Dropped Flecking Off — confidence ${issue.confidence} ` +
          `below threshold ${FLECKING_OFF_MIN_CONFIDENCE}`
      );
    } else {
      filtered.push(issue);
    }
  }
  return { filtered, dropped };
}

function applyDefaults(parsed: Record<string, unknown>): AnalysisResult {
  const rawIssues = Array.isArray(parsed.issues) ? parsed.issues : [];
  const sanitised: AnalysisIssue[] = rawIssues
    .filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object" && !Array.isArray(item)
    )
    .map((item) => sanitiseIssue(item));

  const { filtered: issues, dropped } = filterFleckingOff(sanitised);
  if (dropped > 0)
    console.log(`[barrel-analysis] ${dropped} Flecking Off issue(s) removed by confidence gate.`);

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
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}
export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
}

export async function POST(req: NextRequest) {
  // 1. API key check
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[barrel-analysis] ANTHROPIC_API_KEY is not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
  console.log(`[barrel-analysis] Using API key: ${apiKey.slice(0, 10)}…`);

  // 2. Payload size guard
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Maximum size is 25 MB." },
      { status: 413 }
    );
  }

  // 3. Parse body
  let base64Raw: unknown;
  let mediaTypeRaw: unknown;
  try {
    const body: unknown = await req.json();
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 });
    }
    const tb = body as Record<string, unknown>;
    base64Raw = tb.base64;
    mediaTypeRaw = tb.mediaType;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof base64Raw !== "string" || base64Raw.trim() === "") {
    return NextResponse.json({ error: "Missing or empty 'base64' field" }, { status: 400 });
  }

  // 4. Media type
  const resolvedMediaType: ValidMediaType =
    typeof mediaTypeRaw === "string" &&
    VALID_MEDIA_TYPES.includes(mediaTypeRaw as ValidMediaType)
      ? (mediaTypeRaw as ValidMediaType)
      : "image/jpeg";

  // 5. Strip data-URL prefix and validate base64
  const base64Clean = stripBase64Prefix(base64Raw);
  if (!/^[A-Za-z0-9+/=\r\n]+$/.test(base64Clean)) {
    return NextResponse.json({ error: "Invalid base64 image data" }, { status: 400 });
  }

  const approxKB = Math.round((base64Clean.length * 3) / 4 / 1024);
  console.log(`[barrel-analysis] Image payload ~${approxKB} KB, mediaType=${resolvedMediaType}`);
  if (approxKB > 5_000) {
    console.warn(
      `[barrel-analysis] Image is ~${approxKB} KB — Anthropic may reject images over ~5 MB decoded.`
    );
  }

  // 6. Call Anthropic API
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
                text: `Perform a comprehensive barrel fault inspection on this image.

MANDATORY FIRST STEP — DETERMINE VIEW TYPE:

Look at the image and answer these questions before doing anything else:

Q1: Does the bore wall fill most or all of the image frame, with a dark tunnel at the center?
Q2: Is there a dark circular ring or shadow band visible at mid-radius inside the bore?
Q3: Are light/white areas covering a broad area of the bore face (not small isolated patches)?
Q4: Are you looking along a bore tunnel with lands/grooves running lengthwise and a bright spot at the far end?

APPLY THESE RULES:

IF Q4=YES → SIDE/ENDOSCOPIC VIEW (Type C). Apply side view detection rules.

IF Q1=YES AND Q4=NO → CLOSE-UP END-ON VIEW (Type B). Apply these rules:
  - IF Q2=YES: the dark ring is a BULGE and RINGED BARREL (both, High severity). Report both.
  - IF Q3=YES: the broad light/white bore face is from LIGHTING — NOT Flecking Off. Do not report.
  - Flecking Off ONLY if a small isolated patch has a physically raised peeling edge,
    jagged non-geometric boundary, and two-tone substrate contrast simultaneously.

IF NEITHER Q1 NOR Q4 → STANDARD END-ON VIEW (Type A). Apply standard end-on rules.

Return ONLY the complete JSON analysis. No markdown, no extra text, no explanations.`,
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

  // 7. Handle non-OK responses
  if (!anthropicResponse.ok) {
    const { userMessage, logDetail } = await parseAnthropicError(anthropicResponse);
    console.error(`[barrel-analysis] Anthropic API error — ${logDetail}`);
    if (anthropicResponse.status === 429) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait before retrying." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: userMessage }, { status: anthropicResponse.status });
  }

  // 8. Parse Anthropic response envelope
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

  // 9. Check stop_reason
  const stopReason = apiObj.stop_reason;
  console.log(`[barrel-analysis] Anthropic stop_reason=${stopReason}`);
  if (stopReason === "max_tokens") {
    console.warn("[barrel-analysis] Response truncated (max_tokens hit).");
    return NextResponse.json(
      { error: "Analysis response was truncated due to length. Please try again." },
      { status: 500 }
    );
  }

  // 10. Extract text block
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
    console.error("[barrel-analysis] No text block found:", JSON.stringify(apiObj));
    return NextResponse.json(
      { error: "Unexpected response format from analysis service" },
      { status: 500 }
    );
  }

  // 11. Parse JSON from model output
  const cleaned = cleanJsonText(textBlock.text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error(
      "[barrel-analysis] JSON parse error.",
      e,
      "\nRaw output (first 500):",
      cleaned.slice(0, 500)
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

  // 12. Sanitise, apply confidence gate, recompute derived fields, return
  const result = applyDefaults(parsed as Record<string, unknown>);
  console.log(
    `[barrel-analysis] Success — score=${result.barrelHealthScore} ` +
      `issues=${result.issues.length} critical=${result.criticalIssues}`
  );
  return NextResponse.json(result, { status: 200 });
}