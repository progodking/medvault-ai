import type { RecordCategory } from "./types";

export interface ExtractedFields {
  doctorName?: string;
  hospital?: string;
  diagnosis?: string;
  date?: string;
  medicines: string[];
  category: RecordCategory;
}

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

function parseDate(text: string): string | undefined {
  // dd/mm/yyyy or dd-mm-yyyy
  const numeric = text.match(/\b(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})\b/);
  if (numeric) {
    const [, d, m, y] = numeric;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // 10 Jun 2025
  const worded = text.match(/\b(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(\d{4})\b/i);
  if (worded) {
    const [, d, mon, y] = worded;
    return `${y}-${MONTHS[mon.toLowerCase()]}-${d.padStart(2, "0")}`;
  }
  return undefined;
}

function firstMatch(text: string, patterns: RegExp[]): string | undefined {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1].trim().replace(/\s+/g, " ").slice(0, 80);
  }
  return undefined;
}

function detectCategory(text: string): RecordCategory {
  const t = text.toLowerCase();
  if (/(rx|prescription|tab\.|cap\.|mg\b|twice daily|once daily)/.test(t)) return "Prescription";
  if (/(invoice|bill|amount|total|paid|₹|rs\.)/.test(t)) return "Bill";
  if (/(mri|ct scan|x-?ray|ultrasound|scan|radiology)/.test(t)) return "Scan";
  if (/(vaccine|vaccination|immunization|dose)/.test(t)) return "Vaccination";
  if (/(consultation|visit|follow-?up|opd)/.test(t)) return "Visit";
  return "Report";
}

function extractMedicines(text: string): string[] {
  const meds = new Set<string>();
  const lines = text.split(/\n|;/);
  for (const line of lines) {
    const m = line.match(/\b(?:tab\.?|cap\.?|tablet|syrup|inj\.?)\s+([A-Z][A-Za-z]+)\b.*?(\d+\s?mg|\d+\s?mcg)?/i);
    if (m?.[1]) meds.add(`${m[1]}${m[2] ? " " + m[2].replace(/\s/g, "") : ""}`.trim());
  }
  return Array.from(meds).slice(0, 6);
}

/** Heuristic extraction of structured fields from raw OCR text. */
export function extractFields(text: string): ExtractedFields {
  return {
    doctorName: firstMatch(text, [
      /Dr\.?\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})/,
      /Doctor[:\s]+([A-Za-z .]+)/i,
    ]),
    hospital: firstMatch(text, [
      /([A-Z][A-Za-z&' ]+(?:Hospital|Clinic|Healthcare|Medical Center|Diagnostics|Labs?))/,
      /Hospital[:\s]+([A-Za-z .]+)/i,
    ]),
    diagnosis: firstMatch(text, [
      /(?:Diagnosis|Impression|Finding)s?[:\s]+([A-Za-z0-9 ,.\-]+)/i,
    ]),
    date: parseDate(text),
    medicines: extractMedicines(text),
    category: detectCategory(text),
  };
}
