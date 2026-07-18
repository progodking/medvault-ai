import { deleteItem, updateItem } from "@/lib/api-crud";
import { db, logAudit } from "@/lib/store";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  return updateItem(db().medicines, id, req, (medicine) =>
    logAudit("Medicine updated", medicine.name),
  );
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  return deleteItem(db().medicines, id, (medicine) =>
    logAudit("Medicine deleted", medicine.name),
  );
}
