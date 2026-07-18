import type { Medicine } from "@/lib/types";

export type InteractionSeverity = "high" | "moderate";

export interface MedicineWarning {
  severity: InteractionSeverity;
  title: string;
  detail: string;
  members: string[];
}

interface KnownInteraction {
  a: string;
  b: string;
  severity: InteractionSeverity;
  detail: string;
}

// Small curated set of well-documented interactions for demo purposes.
const KNOWN_INTERACTIONS: KnownInteraction[] = [
  {
    a: "warfarin",
    b: "aspirin",
    severity: "high",
    detail: "Combined use markedly increases the risk of serious bleeding.",
  },
  {
    a: "metformin",
    b: "alcohol",
    severity: "moderate",
    detail: "May increase the risk of lactic acidosis and low blood sugar.",
  },
  {
    a: "atorvastatin",
    b: "clarithromycin",
    severity: "high",
    detail: "Raises statin levels, increasing the risk of muscle damage.",
  },
  {
    a: "amlodipine",
    b: "simvastatin",
    severity: "moderate",
    detail: "Amlodipine can raise simvastatin levels; monitor for muscle pain.",
  },
  {
    a: "ibuprofen",
    b: "aspirin",
    severity: "moderate",
    detail: "NSAIDs together raise the risk of stomach bleeding and ulcers.",
  },
  {
    a: "lisinopril",
    b: "spironolactone",
    severity: "high",
    detail: "Combination can cause dangerously high potassium levels.",
  },
];

function baseName(dosageOrName: string): string {
  return dosageOrName
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s?(mg|mcg|ml|g|iu|units?)/g, "")
    .replace(/[^a-z ]/g, " ")
    .trim()
    .split(/\s+/)[0] ?? "";
}

/**
 * Detect duplicate medicines (same drug prescribed more than once for a member)
 * and known drug–drug interactions within each member's active regimen.
 */
export function detectWarnings(
  medicines: Medicine[],
  memberName: (id: string) => string,
): MedicineWarning[] {
  const warnings: MedicineWarning[] = [];
  const byMember = new Map<string, Medicine[]>();
  for (const med of medicines) {
    const list = byMember.get(med.memberId) ?? [];
    list.push(med);
    byMember.set(med.memberId, list);
  }

  for (const [memberId, meds] of byMember) {
    const name = memberName(memberId);
    const names = meds.map((m) => baseName(m.name)).filter(Boolean);

    // Duplicates
    const seen = new Map<string, number>();
    for (const n of names) seen.set(n, (seen.get(n) ?? 0) + 1);
    for (const [n, count] of seen) {
      if (count > 1) {
        warnings.push({
          severity: "moderate",
          title: `Duplicate: ${n}`,
          detail: `${n} appears ${count} times in the active list — confirm this isn't accidental double-dosing.`,
          members: [name],
        });
      }
    }

    // Interactions
    for (const ix of KNOWN_INTERACTIONS) {
      if (names.includes(ix.a) && names.includes(ix.b)) {
        warnings.push({
          severity: ix.severity,
          title: `${cap(ix.a)} + ${cap(ix.b)}`,
          detail: ix.detail,
          members: [name],
        });
      }
    }
  }

  return warnings.sort((x, y) =>
    x.severity === y.severity ? 0 : x.severity === "high" ? -1 : 1,
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
