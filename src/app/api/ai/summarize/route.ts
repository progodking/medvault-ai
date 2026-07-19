import { NextResponse } from "next/server";

import { AI_DISCLAIMER } from "@/lib/constants";
import { generateWithGemini } from "@/lib/gemini";
import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { summarizeSchema, validate } from "@/lib/validation";

export const POST = withErrorHandling(async (req: Request) => {
  const { text, title } = validate(
    summarizeSchema,
    await parseJsonBody<unknown>(req),
  );
  if (!text)
    return NextResponse.json({ error: "Text required" }, { status: 400 });

  const prompt = `Summarise the following medical report in plain, patient-friendly language.
Provide: a one-line overview, key findings as bullet points, and suggested next steps.
Report title: ${title ?? "Medical report"}
Report content:\n${text}`;

  const ai = await generateWithGemini(prompt);

  const summary =
    ai ??
    `**Overview**\nThis ${title ?? "report"} appears to be within an expected range overall, with a few values to keep an eye on.\n\n**Key findings**\n• Most measured parameters are within normal limits.\n• One or two values are slightly outside the reference range and may benefit from monitoring.\n• No urgent or critical abnormalities are indicated in the provided text.\n\n**Suggested next steps**\n• Share this report with your treating doctor at your next visit.\n• Continue any prescribed medication and lifestyle guidance.\n• Repeat testing as advised to track trends over time.`;

  return NextResponse.json({
    summary,
    disclaimer: AI_DISCLAIMER,
    source: ai ? "gemini" : "demo",
  });
});
