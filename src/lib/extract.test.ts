import { describe, expect, it } from "vitest";

import { extractFields } from "./extract";

describe("extractFields — category detection", () => {
  it("detects a Prescription from Rx / dosage cues", () => {
    expect(extractFields("Rx\nTab. Metformin 500mg twice daily").category).toBe(
      "Prescription",
    );
  });

  it("detects a Bill from invoice / amount cues", () => {
    expect(extractFields("Invoice\nTotal amount paid: Rs. 1200").category).toBe(
      "Bill",
    );
  });

  it("detects a Scan from radiology cues", () => {
    expect(extractFields("MRI Brain\nImpression: normal study").category).toBe(
      "Scan",
    );
  });

  it("detects a Vaccination", () => {
    expect(extractFields("Vaccination record: 2nd dose").category).toBe(
      "Vaccination",
    );
  });

  it("detects a Visit / consultation", () => {
    expect(extractFields("OPD consultation follow-up").category).toBe("Visit");
  });

  it("falls back to Report when nothing matches", () => {
    expect(extractFields("Complete blood count results").category).toBe(
      "Report",
    );
  });
});

describe("extractFields — date parsing", () => {
  it("parses dd/mm/yyyy", () => {
    expect(extractFields("Date: 09/06/2025").date).toBe("2025-06-09");
  });

  it("parses dd-mm-yy and expands the two-digit year", () => {
    expect(extractFields("Visit on 5-3-24").date).toBe("2024-03-05");
  });

  it("parses a worded date like '10 Jun 2025'", () => {
    expect(extractFields("Reported 10 Jun 2025").date).toBe("2025-06-10");
  });

  it("parses a worded date with a full month name", () => {
    expect(extractFields("Dated 3 January 2023").date).toBe("2023-01-03");
  });

  it("returns undefined when no date is present", () => {
    expect(extractFields("No date here").date).toBeUndefined();
  });
});

describe("extractFields — doctor name", () => {
  it("extracts and prefixes a bare name with Dr.", () => {
    expect(extractFields("Doctor: Rahul Verma").doctorName).toBe(
      "Dr. Rahul Verma",
    );
  });

  it("keeps an existing Dr. prefix without duplicating it", () => {
    expect(extractFields("Dr. Anita Desai\nCardiology").doctorName).toBe(
      "Dr. Anita Desai",
    );
  });

  it("returns undefined when no doctor is present", () => {
    expect(extractFields("Lab report only").doctorName).toBeUndefined();
  });
});

describe("extractFields — hospital", () => {
  it("extracts a hospital name by keyword", () => {
    expect(extractFields("Apollo Hospital, Delhi").hospital).toContain(
      "Apollo Hospital",
    );
  });

  it("extracts a clinic name", () => {
    expect(extractFields("Sunrise Clinic").hospital).toContain("Sunrise Clinic");
  });

  it("returns undefined when no facility is present", () => {
    expect(extractFields("Patient notes").hospital).toBeUndefined();
  });
});

describe("extractFields — diagnosis", () => {
  it("captures text after a Diagnosis label", () => {
    expect(extractFields("Diagnosis: Type 2 Diabetes").diagnosis).toContain(
      "Type 2 Diabetes",
    );
  });

  it("captures an Impression label", () => {
    expect(extractFields("Impression: mild cardiomegaly").diagnosis).toContain(
      "mild cardiomegaly",
    );
  });
});

describe("extractFields — medicines", () => {
  it("extracts a prefixed medicine with its dose", () => {
    expect(extractFields("Tab. Metformin 500mg").medicines).toContain(
      "Metformin 500mg",
    );
  });

  it("extracts a plain medicine line with a dose", () => {
    expect(extractFields("Atorvastatin 10 mg at night").medicines).toContain(
      "Atorvastatin 10mg",
    );
  });

  it("de-duplicates repeated medicines", () => {
    const meds = extractFields(
      "Tab. Metformin 500mg\nTab. Metformin 500mg",
    ).medicines;
    expect(meds.filter((m) => m === "Metformin 500mg")).toHaveLength(1);
  });

  it("skips non-medicine leaders like Age/Weight", () => {
    const meds = extractFields("Age 45 years\nWeight 70 kg").medicines;
    expect(meds).toEqual([]);
  });

  it("caps the result at 8 medicines", () => {
    const text = Array.from(
      { length: 12 },
      (_, i) => `Tab. Medicine${String.fromCharCode(65 + i)} ${100 + i}mg`,
    ).join("\n");
    expect(extractFields(text).medicines.length).toBeLessThanOrEqual(8);
  });

  it("returns an empty array when no medicines are present", () => {
    expect(extractFields("General health checkup").medicines).toEqual([]);
  });
});
