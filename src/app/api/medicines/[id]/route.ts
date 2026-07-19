import { deleteItem, updateItem } from "@/lib/api-crud";
import { withErrorHandling } from "@/lib/http";
import { db, logAudit } from "@/lib/store";
import type { Medicine } from "@/lib/types";
import { medicineInputSchema, validate } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  return updateItem(
    db().medicines,
    id,
    req,
    (d) => validate(medicineInputSchema, d) as Partial<Medicine>,
    (medicine) => logAudit("Medicine updated", medicine.name),
  );
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  return deleteItem(db().medicines, id, (medicine) =>
    logAudit("Medicine deleted", medicine.name),
  );
});
