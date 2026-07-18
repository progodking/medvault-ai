import { deleteItem, updateItem } from "@/lib/api-crud";
import { db, logAudit } from "@/lib/store";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  return updateItem(db().records, id, req, (record) =>
    logAudit("Report updated", record.title),
  );
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  return deleteItem(db().records, id, (record) =>
    logAudit("Report deleted", record.title),
  );
}
