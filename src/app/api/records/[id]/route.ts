import { deleteItem, updateItem } from "@/lib/api-crud";
import { withErrorHandling } from "@/lib/http";
import { db, logAudit } from "@/lib/store";
import { recordUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  return updateItem(
    db().records,
    id,
    req,
    (record) => logAudit("Report updated", record.title),
    recordUpdateSchema,
  );
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  return deleteItem(db().records, id, (record) =>
    logAudit("Report deleted", record.title),
  );
});
