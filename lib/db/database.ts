import Dexie, { Table } from "dexie";
import type { InspectionRegistration, CapturedImage, Inspection } from "../types";

export class BarrelInspectDB extends Dexie {
  registrations!: Table<InspectionRegistration>;
  images!: Table<CapturedImage>;
  inspections!: Table<Inspection>;

  constructor() {
    super("BarrelInspectDB");
    this.version(1).stores({
      registrations: "id, batchNumber, barrelSerialNumber, createdAt",
      images: "id, inspectionId, status, capturedAt",
      inspections: "id, createdAt",
    });
  }
}

export const db = new BarrelInspectDB();

export async function saveRegistration(reg: InspectionRegistration): Promise<string> {
  const id = crypto.randomUUID();
  await db.registrations.put({ ...reg, id, createdAt: new Date().toISOString() });
  return id;
}

export async function saveImage(image: CapturedImage): Promise<void> {
  await db.images.put(image);
}

export async function updateImage(id: string, updates: Partial<CapturedImage>): Promise<void> {
  await db.images.update(id, updates);
}

export async function getImagesByInspection(inspectionId: string): Promise<CapturedImage[]> {
  return db.images.where("inspectionId").equals(inspectionId).toArray();
}

export async function saveInspection(inspection: Inspection): Promise<void> {
  await db.inspections.put(inspection);
}

export async function getAllInspections(): Promise<Inspection[]> {
  return db.inspections.orderBy("createdAt").reverse().toArray();
}

export async function getInspection(id: string): Promise<Inspection | undefined> {
  return db.inspections.get(id);
}

export async function deleteInspection(id: string): Promise<void> {
  const inspection = await db.inspections.get(id);
  if (inspection) {
    for (const img of inspection.images) {
      await db.images.delete(img.id);
    }
  }
  await db.inspections.delete(id);
}
