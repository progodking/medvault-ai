import { deleteItem, updateItem } from "@/lib/api-crud";
import { withErrorHandling } from "@/lib/http";
import { db, logAudit } from "@/lib/store";
import type { Reminder } from "@/lib/types";
import { reminderInputSchema, validate } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  return updateItem(
    db().reminders,
    id,
    req,
    (d) => validate(reminderInputSchema, d) as Partial<Reminder>,
  );
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  return deleteItem(db().reminders, id, (reminder) =>
    logAudit("Reminder deleted", reminder.title),
  );
});
