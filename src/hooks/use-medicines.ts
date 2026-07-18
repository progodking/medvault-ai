"use client";

import { createResourceHooks } from "./create-resource-hooks";
import type { Medicine } from "@/lib/types";

const hooks = createResourceHooks<Medicine>("medicines");

export const useMedicines = hooks.useList;
export const useCreateMedicine = hooks.useCreate;
export const useUpdateMedicine = hooks.useUpdate;
export const useDeleteMedicine = hooks.useRemove;
