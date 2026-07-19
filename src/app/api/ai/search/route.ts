import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db } from "@/lib/store";
import type { MedicalRecord, RecordCategory } from "@/lib/types";
import { RECORD_CATEGORIES } from "@/lib/constants";
import { aiSearchSchema, validate } from "@/lib/validation";

const SCAN_KEYWORDS: Record<string, string[]> = {
  mri: ["mri"],
  xray: ["x-ray", "xray", "chest"],
  scan: ["scan", "ct", "ultrasound", "angiography"],
};

/**
 * Natural-language timeline search. Parses intent (year, category, condition,
 * hospital, keyword) locally so it works without any external AI service.
 * Examples: "Show all diabetes reports", "Show reports from 2024", "Show MRI".
 */
export const POST = withErrorHandling(async (req: Request) => {
  const { query, memberId } = validate(
    aiSearchSchema,
    await parseJsonBody<unknown>(req),
  );
  if (!query)
    return NextResponse.json({ error: "Query required" }, { status: 400 });

  const q = query.toLowerCase();
  let records = db().records;
  if (memberId) records = records.filter((r) => r.memberId === memberId);

  // Year
  const yearMatch = q.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : null;

  // Category
  const category = RECORD_CATEGORIES.find((c) =>
    q.includes(c.toLowerCase()),
  ) as RecordCategory | undefined;

  const matchesScan = (r: MedicalRecord) =>
    Object.entries(SCAN_KEYWORDS).some(
      ([key, words]) =>
        q.includes(key) &&
        words.some(
          (w) =>
            r.title.toLowerCase().includes(w) ||
            r.tags.some((t) => t.includes(w)),
        ),
    );

  const terms = q
    .replace(/show|all|reports?|from|the|me|find/g, "")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !/^\d{4}$/.test(t));

  const results = records.filter((r) => {
    if (year && !r.date.startsWith(year)) return false;
    if (category && r.category !== category) return false;

    const haystack = [
      r.title,
      r.diagnosis ?? "",
      r.hospital ?? "",
      r.doctorName ?? "",
      r.category,
      ...r.tags,
      ...(r.medicines ?? []),
    ]
      .join(" ")
      .toLowerCase();

    const scanHit = matchesScan(r);
    const termHit =
      terms.length === 0 || terms.some((t) => haystack.includes(t));

    return scanHit || termHit || (!!year && !terms.length) || (!!category && !terms.length);
  });

  const filters = [
    year && `year: ${year}`,
    category && `type: ${category}`,
    terms.length && `keywords: ${terms.join(", ")}`,
  ].filter(Boolean);

  return NextResponse.json({
    query,
    results: [...results].sort((a, b) => b.date.localeCompare(a.date)),
    interpreted: filters.length
      ? `Showing records matching ${filters.join(" · ")}`
      : "Showing all matching records",
  });
});
