import { NextResponse } from "next/server";

import { AI_DISCLAIMER } from "@/lib/constants";
import { generateWithGemini } from "@/lib/gemini";
import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { explainMedicineSchema, validate } from "@/lib/validation";

export const POST = withErrorHandling(async (req: Request) => {
  const { name } = validate(
    explainMedicineSchema,
    await parseJsonBody<unknown>(req),
  );
  if (!name)
    return NextResponse.json(
      { error: "Medicine name required" },
      { status: 400 },
    );

  const prompt = `You are a helpful medical assistant. Explain the medicine "${name}" for a layperson in simple language.
Return concise plain text with these clearly labelled sections:
- What it is used for
- How it is usually taken
- Common side effects
- General precautions
Keep it under 180 words. Do not give personalised dosing advice.`;

  const ai = await generateWithGemini(prompt);

  const explanation =
    ai ??
    `**What it is used for**\n${name} is commonly prescribed to help manage a specific health condition. It works by targeting the underlying cause or symptoms as directed by your doctor.\n\n**How it is usually taken**\nTypically taken orally with water, with or after food, at the same time each day. Always follow the exact dosage on your prescription.\n\n**Common side effects**\nMild effects such as nausea, dizziness, headache or stomach upset may occur and often ease with time. Contact a doctor if they persist or worsen.\n\n**General precautions**\nInform your doctor about allergies, other medicines and existing conditions. Do not stop suddenly without medical advice. Store away from children.`;

  return NextResponse.json({
    name,
    explanation,
    disclaimer: AI_DISCLAIMER,
    source: ai ? "gemini" : "demo",
  });
});
