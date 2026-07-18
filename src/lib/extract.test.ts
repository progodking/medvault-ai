import assert from "node:assert/strict";
import { test } from "node:test";

import { extractFields } from "./extract";

test("doctor name: extracts uppercase OCR names", () => {
  assert.equal(extractFields("Dr. MEHTA\nDiagnosis: Fever").doctorName, "Dr. MEHTA");
  assert.equal(extractFields("DR. PRIYA SINGH").doctorName, "Dr. PRIYA SINGH");
});

test("doctor name: extracts mixed-case names and single-letter initials", () => {
  assert.equal(extractFields("Dr. Rajesh Kumar").doctorName, "Dr. Rajesh Kumar");
  assert.equal(extractFields("Dr. R K Sharma").doctorName, "Dr. R K Sharma");
});

test("doctor name: strips trailing field label grabbed by the run", () => {
  assert.equal(extractFields("Dr. Mehta Diagnosis: Viral fever").doctorName, "Dr. Mehta");
});

test("doctor name: 'Doctor:' label form", () => {
  assert.equal(extractFields("Doctor: Anil Kumar").doctorName, "Dr. Anil Kumar");
});

test("doctor name: does not match 'dr' inside another word", () => {
  assert.equal(extractFields("Consulted Andrew earlier today").doctorName, undefined);
});

test("medicines: captures prefixed and plain dosage forms", () => {
  const meds = extractFields("Tab. Metformin 500mg\nAtorvastatin 10 mg").medicines;
  assert.deepEqual(meds, ["Metformin 500mg", "Atorvastatin 10mg"]);
});

test("medicines: ignores lab-report concentrations (mg/dL)", () => {
  const meds = extractFields(
    "Serum Creatinine 1.2 mg/dL\nCholesterol 190 mg/dL\nHaemoglobin 13 g/dL",
  ).medicines;
  assert.deepEqual(meds, []);
});

test("medicines: ignores common bare lab analytes", () => {
  const meds = extractFields("Cholesterol 190 mg\nUrea 30 mg").medicines;
  assert.deepEqual(meds, []);
});
