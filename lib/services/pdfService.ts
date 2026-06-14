import { jsPDF } from "jspdf";
import type { Inspection, CapturedImage } from "../types";
import { getHealthCategory, getHealthColor, getSeverityColor } from "../utils/imageUtils";

const DARK_BG = [18, 22, 28];
const OLIVE = [101, 120, 60];
const STEEL = [55, 65, 81];
const WHITE = [245, 245, 245];
const LIGHT_GRAY = [156, 163, 175];

function addHeader(doc: jsPDF, title: string, pageNum: number, totalPages: number) {
  doc.setFillColor(...(DARK_BG as [number, number, number]));
  doc.rect(0, 0, 210, 20, "F");
  doc.setFillColor(...(OLIVE as [number, number, number]));
  doc.rect(0, 20, 210, 2, "F");

  doc.setTextColor(101, 120, 60);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("BARREL INSPECTION SYSTEM", 10, 10);

  doc.setTextColor(...(WHITE as [number, number, number]));
  doc.setFontSize(9);
  doc.text(title.toUpperCase(), 105, 13, { align: "center" });

  doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
  doc.setFontSize(7);
  doc.text(`Page ${pageNum} of ${totalPages}`, 200, 10, { align: "right" });
}

function addFooter(doc: jsPDF) {
  const y = 285;
  doc.setFillColor(...(DARK_BG as [number, number, number]));
  doc.rect(0, y, 210, 15, "F");
  doc.setFillColor(...(OLIVE as [number, number, number]));
  doc.rect(0, y, 210, 0.5, "F");

  doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
  doc.setFontSize(6.5);
  doc.text(
    "AI-assisted inspection results should be reviewed by a qualified firearm inspection specialist before operational decisions are made.",
    105,
    y + 7,
    { align: "center", maxWidth: 180 }
  );
}

function scoreBar(doc: jsPDF, x: number, y: number, score: number, label: string) {
  doc.setFillColor(...(STEEL as [number, number, number]));
  doc.roundedRect(x, y, 80, 4, 1, 1, "F");
  const color = getHealthColor(score);
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  doc.setFillColor(r, g, b);
  doc.roundedRect(x, y, (80 * score) / 100, 4, 1, 1, "F");
  doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
  doc.setFontSize(7);
  doc.text(`${label}: ${score}%`, x, y - 1.5);
}

export async function generatePDFReport(inspection: Inspection): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const reg = inspection.registration;
  const images = inspection.images.filter((i) => i.status === "completed");
  const totalPages = 2 + images.length + 1;

  // PAGE 1 — Inspection Summary
  doc.setFillColor(...(DARK_BG as [number, number, number]));
  doc.rect(0, 0, 210, 297, "F");
  addHeader(doc, "Inspection Summary", 1, totalPages);
  addFooter(doc);

  // Hero section
  doc.setFillColor(25, 32, 40);
  doc.roundedRect(10, 28, 190, 60, 3, 3, "F");
  doc.setFillColor(...(OLIVE as [number, number, number]));
  doc.rect(10, 28, 4, 60, "F");

  doc.setTextColor(...(OLIVE as [number, number, number]));
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("GUN BARREL", 22, 45);
  doc.text("FAULT DETECTION REPORT", 22, 57);

  doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Classification: INSPECTION REPORT`, 22, 67);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 22, 74);
  doc.text(`Report ID: ${inspection.id.substring(0, 8).toUpperCase()}`, 22, 80);

  // Inspection details table
  const tableY = 100;
  const fields = [
    ["Gun Name", reg.gunName],
    ["Batch Number", reg.batchNumber],
    ["Barrel Serial Number", reg.barrelSerialNumber],
    ["Caliber", reg.caliber === "Other" ? reg.customCaliber || "Other" : reg.caliber],
    ["Inspector", reg.inspectorName],
    ["Unit / Department", reg.unitDepartment || "—"],
    ["Inspection Date", new Date(reg.inspectionDate).toLocaleDateString()],
  ];

  doc.setFontSize(8);
  fields.forEach(([label, value], i) => {
    const y = tableY + i * 13;
    doc.setFillColor(i % 2 === 0 ? 25 : 30, i % 2 === 0 ? 32 : 38, i % 2 === 0 ? 40 : 48);
    doc.rect(10, y, 190, 12, "F");
    doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
    doc.setFont("helvetica", "normal");
    doc.text(label, 15, y + 7.5);
    doc.setTextColor(...(WHITE as [number, number, number]));
    doc.setFont("helvetica", "bold");
    doc.text(value, 90, y + 7.5);
  });

  if (reg.inspectionNotes) {
    const notesY = tableY + fields.length * 13 + 5;
    doc.setFillColor(25, 32, 40);
    doc.roundedRect(10, notesY, 190, 25, 2, 2, "F");
    doc.setTextColor(...(OLIVE as [number, number, number]));
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("INSPECTION NOTES", 15, notesY + 7);
    doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
    doc.setFont("helvetica", "normal");
    doc.text(reg.inspectionNotes, 15, notesY + 14, { maxWidth: 180 });
  }

  // PAGE 2 — Executive Summary
  doc.addPage();
  doc.setFillColor(...(DARK_BG as [number, number, number]));
  doc.rect(0, 0, 210, 297, "F");
  addHeader(doc, "Executive Summary", 2, totalPages);
  addFooter(doc);

  const completedImages = inspection.images.filter((i) => i.analysisResult);
  const totalDefects = completedImages.reduce(
    (a, i) => a + (i.analysisResult?.issues?.length || 0),
    0
  );
  const criticalDefects = completedImages.reduce(
    (a, i) => a + (i.analysisResult?.criticalIssues || 0),
    0
  );
  const aggScore = inspection.aggregateHealthScore || 0;

  // Stats cards
  const stats = [
    { label: "TOTAL IMAGES", value: inspection.images.length.toString(), color: OLIVE },
    { label: "IMAGES ANALYZED", value: completedImages.length.toString(), color: [59, 130, 246] },
    { label: "TOTAL DEFECTS", value: totalDefects.toString(), color: [251, 146, 60] },
    { label: "CRITICAL DEFECTS", value: criticalDefects.toString(), color: [239, 68, 68] },
  ];

  stats.forEach(({ label, value, color }, i) => {
    const x = 10 + (i % 2) * 98;
    const y = 30 + Math.floor(i / 2) * 35;
    doc.setFillColor(25, 32, 40);
    doc.roundedRect(x, y, 93, 30, 3, 3, "F");
    doc.setFillColor(...(color as [number, number, number]));
    doc.rect(x, y, 93, 2.5, "F");
    doc.setTextColor(...(color as [number, number, number]));
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(value, x + 46.5, y + 18, { align: "center" });
    doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(label, x + 46.5, y + 25, { align: "center" });
  });

  // Health score section
  const healthY = 108;
  doc.setFillColor(25, 32, 40);
  doc.roundedRect(10, healthY, 190, 50, 3, 3, "F");
  doc.setTextColor(...(OLIVE as [number, number, number]));
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("AGGREGATE BARREL HEALTH SCORE", 105, healthY + 9, { align: "center" });

  const scoreColor = getHealthColor(aggScore);
  const sHex = scoreColor.replace("#", "");
  const sR = parseInt(sHex.substring(0, 2), 16);
  const sG = parseInt(sHex.substring(2, 4), 16);
  const sB = parseInt(sHex.substring(4, 6), 16);
  doc.setTextColor(sR, sG, sB);
  doc.setFontSize(36);
  doc.text(`${aggScore}`, 105, healthY + 30, { align: "center" });
  doc.setFontSize(10);
  doc.text(getHealthCategory(aggScore).toUpperCase(), 105, healthY + 40, { align: "center" });

  // Overall recommendation
  const recY = healthY + 60;
  doc.setFillColor(25, 32, 40);
  doc.roundedRect(10, recY, 190, 28, 3, 3, "F");
  doc.setFillColor(...(OLIVE as [number, number, number]));
  doc.rect(10, recY, 4, 28, "F");
  doc.setTextColor(...(OLIVE as [number, number, number]));
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("OVERALL RECOMMENDATION", 18, recY + 9);
  doc.setTextColor(...(WHITE as [number, number, number]));
  doc.setFontSize(11);
  doc.text(inspection.overallRecommendation || "Pending analysis", 18, recY + 20);

  // Per-image pages
  for (let idx = 0; idx < images.length; idx++) {
    doc.addPage();
    doc.setFillColor(...(DARK_BG as [number, number, number]));
    doc.rect(0, 0, 210, 297, "F");
    addHeader(doc, `Image Analysis — ${idx + 1} of ${images.length}`, idx + 3, totalPages);
    addFooter(doc);

    const img = images[idx];
    const ar = img.analysisResult;

    // Image
    try {
      doc.addImage(img.dataUrl, "JPEG", 10, 28, 90, 65);
    } catch {}

    // Score beside image
    if (ar) {
      const sc = ar.barrelHealthScore;
      const scHex = getHealthColor(sc).replace("#", "");
      doc.setTextColor(
        parseInt(scHex.substring(0, 2), 16),
        parseInt(scHex.substring(2, 4), 16),
        parseInt(scHex.substring(4, 6), 16)
      );
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(`${sc}`, 155, 48, { align: "center" });
      doc.setFontSize(8);
      doc.text(getHealthCategory(sc).toUpperCase(), 155, 57, { align: "center" });

      doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(`Condition: ${ar.overallCondition}`, 108, 70, { maxWidth: 90 });
      doc.text(`Critical Issues: ${ar.criticalIssues}`, 108, 78);
      doc.text(`Captured: ${new Date(img.capturedAt).toLocaleString()}`, 108, 85);
    }

    // Issues list
    if (ar && ar.issues.length > 0) {
      let issueY = 100;
      doc.setTextColor(...(OLIVE as [number, number, number]));
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("DETECTED ISSUES", 10, issueY);
      issueY += 5;

      for (const issue of ar.issues.slice(0, 8)) {
        if (issueY > 255) break;
        const sevColor = getSeverityColor(issue.severity).replace("#", "");
        const sR2 = parseInt(sevColor.substring(0, 2), 16);
        const sG2 = parseInt(sevColor.substring(2, 4), 16);
        const sB2 = parseInt(sevColor.substring(4, 6), 16);

        doc.setFillColor(25, 32, 40);
        doc.roundedRect(10, issueY, 190, 24, 2, 2, "F");
        doc.setFillColor(sR2, sG2, sB2);
        doc.rect(10, issueY, 3, 24, "F");

        doc.setTextColor(sR2, sG2, sB2);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(issue.issueName, 17, issueY + 7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(sR2, sG2, sB2);
        doc.text(`${issue.severity?.toUpperCase()} | ${issue.confidence}% confidence`, 160, issueY + 7, { align: "right" });

        doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
        doc.setFontSize(7);
        doc.text(`Solution: ${issue.solution}`, 17, issueY + 13, { maxWidth: 180 });
        doc.text(`Maintenance: ${issue.maintenanceAction}`, 17, issueY + 19, { maxWidth: 180 });

        issueY += 28;
      }
    } else if (ar) {
      doc.setFillColor(25, 32, 40);
      doc.roundedRect(10, 100, 190, 20, 2, 2, "F");
      doc.setTextColor(74, 222, 128);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("✓ No defects detected — Barrel appears serviceable", 105, 113, { align: "center" });
    }
  }

  // Final recommendation page
  doc.addPage();
  doc.setFillColor(...(DARK_BG as [number, number, number]));
  doc.rect(0, 0, 210, 297, "F");
  addHeader(doc, "Final Recommendation", totalPages, totalPages);
  addFooter(doc);

  doc.setFillColor(25, 32, 40);
  doc.roundedRect(10, 28, 190, 80, 3, 3, "F");
  doc.setFillColor(...(OLIVE as [number, number, number]));
  doc.rect(10, 28, 4, 80, "F");

  doc.setTextColor(...(OLIVE as [number, number, number]));
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("FINAL OPERATIONAL ASSESSMENT", 18, 45);

  doc.setTextColor(...(WHITE as [number, number, number]));
  doc.setFontSize(14);
  doc.text(inspection.overallRecommendation || "Pending", 18, 62, { maxWidth: 180 });

  doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `This assessment is based on AI-assisted analysis of ${images.length} barrel image(s) with an aggregate health score of ${aggScore}/100 (${getHealthCategory(aggScore)}).`,
    18,
    75,
    { maxWidth: 180 }
  );

  // Disclaimer box
  doc.setFillColor(40, 20, 20);
  doc.roundedRect(10, 120, 190, 30, 2, 2, "F");
  doc.setFillColor(239, 68, 68);
  doc.rect(10, 120, 3, 30, "F");
  doc.setTextColor(239, 68, 68);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("DISCLAIMER", 18, 130);
  doc.setTextColor(...(LIGHT_GRAY as [number, number, number]));
  doc.setFont("helvetica", "normal");
  doc.text(
    "AI-assisted inspection results should be reviewed by a qualified firearm inspection specialist before operational decisions are made. This system is a decision-support tool, not a replacement for professional inspection.",
    18,
    138,
    { maxWidth: 180 }
  );

  const fileName = `BarrelInspection_${reg.batchNumber}.pdf`;
  doc.save(fileName);
}
