export type CaliperType = "5.56mm" | "7.62mm" | "9mm" | "12 Gauge" | "Other";

export interface InspectionRegistration {
  id?: string;
  gunName: string;
  batchNumber: string;
  barrelSerialNumber: string;
  caliber: CaliperType;
  customCaliber?: string;
  inspectorName: string;
  unitDepartment?: string;
  inspectionNotes?: string;
  inspectionDate: string;
  createdAt: string;
}

export type ImageStatus = "pending" | "processing" | "completed" | "failed";
export type SeverityLevel = "critical" | "high" | "medium" | "low" | "none";

export interface BarrelIssue {
  issueName: string;
  severity: SeverityLevel;
  confidence: number;
  description: string;
  evidence: string;
  rootCause: string;
  solution: string;
  maintenanceAction: string;
  riskLevel: string;
  affectedArea: string;
  location?: "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";
}

export interface AnalysisResult {
  barrelHealthScore: number;
  overallCondition: string;
  criticalIssues: number;
  issues: BarrelIssue[];
  rawResponse?: string;
}

export interface CapturedImage {
  id: string;
  inspectionId: string;
  dataUrl: string;
  fileName: string;
  fileSize: number;
  capturedAt: string;
  status: ImageStatus;
  analysisResult?: AnalysisResult;
  qualityScore?: number;
  qualityIssues?: string[];
  position?: string;
}

export interface Inspection {
  id: string;
  registration: InspectionRegistration;
  images: CapturedImage[];
  aggregateHealthScore?: number;
  overallRecommendation?: string;
  completedAt?: string;
  createdAt: string;
}

export type HealthCategory = "Excellent" | "Good" | "Fair" | "Poor" | "Critical";

export interface QualityCheck {
  passed: boolean;
  score: number;
  issues: string[];
}
