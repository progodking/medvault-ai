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

const DOSE = /(\d+(?:\.\d+)?\s?(?:mg|mcg|ml|g|iu|units?))/i;

function cleanMedName(raw: string): string {
  return raw
    .replace(/^(?:tab\.?|cap\.?|tablet|capsule|syrup|syp\.?|inj\.?|injection|susp\.?)\s+/i, "")
    .replace(/[^A-Za-z0-9 +/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const NON_NAME_WORDS = /\b(Diagnosis|Date|Patient|Medicines?|Hospital|Age|Sex|Gender|Address|Phone|Mobile|Rx|Prescription|Report|Impression|Findings?)\b/i;

function normalizeDoctor(name?: string): string | undefined {
  if (!name) return undefined;
  // Drop any trailing field-label word the greedy match may have grabbed.
  const trimmed = name.replace(NON_NAME_WORDS, "").replace(/\s+/g, " ").trim();
  if (!trimmed) return undefined;
  return trimmed.startsWith("Dr") ? trimmed : `Dr. ${trimmed}`;
}

function extractMedicines(text: string): string[] {
  const meds = new Set<string>();
  const lines = text.split(/\n|;|,/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Prefixed forms: "Tab. Metformin 500mg", "Cap Amoxicillin 250mg", "Inj ..."
    const prefixed = line.match(
      /\b(?:tab\.?|cap\.?|tablet|capsule|syrup|syp\.?|inj\.?|injection|susp\.?)\s+([A-Z][A-Za-z]+)/i,
    );
    if (prefixed?.[1]) {
      const dose = line.match(DOSE);
      meds.add(`${cleanMedName(prefixed[1])}${dose ? " " + dose[1].replace(/\s/g, "") : ""}`.trim());
      continue;
    }

    // Plain forms with a dosage on the line: "Metformin 500mg", "Atorvastatin 10 mg"
    const plain = line.match(/^([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)?)\s+\d+(?:\.\d+)?\s?(?:mg|mcg|ml|g|iu|units?)\b/i);
    if (plain?.[1]) {
      const name = cleanMedName(plain[1]);
      // Skip common non-medicine leaders that can precede a number.
      if (!/^(age|weight|height|bp|patient|date|dose|qty|tablet|capsule)$/i.test(name)) {
        const dose = line.match(DOSE);
        meds.add(`${name}${dose ? " " + dose[1].replace(/\s/g, "") : ""}`.trim());
      }
    }
  }

  return Array.from(meds).slice(0, 8);
}

/** Heuristic extraction of structured fields from raw OCR text. */
export function extractFields(text: string): ExtractedFields {
  return {
    doctorName: normalizeDoctor(
      firstMatch(text, [
        /Dr\.?[ \t]+([A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+){0,2})/,
        /Doctor[ \t]*[:\-][ \t]*(?:Dr\.?[ \t]+)?([A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+){0,2})/i,
      ]),
    ),
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
