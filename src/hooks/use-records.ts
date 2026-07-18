"use client";

import { createResourceHooks } from "./create-resource-hooks";
import type { MedicalRecord } from "@/lib/types";

const hooks = createResourceHooks<MedicalRecord>("records");

export const useRecords = hooks.useList;
export const useCreateRecord = hooks.useCreate;
export const useDeleteRecord = hooks.useRemove;
