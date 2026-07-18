import { deleteItem, updateItem } from "@/lib/api-crud";
import { db, logAudit } from "@/lib/store";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  return updateItem(db().reminders, id, req);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  return deleteItem(db().reminders, id, (reminder) =>
    logAudit("Reminder deleted", reminder.title),
  );
}
