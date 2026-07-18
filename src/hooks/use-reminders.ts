"use client";

import { createResourceHooks } from "./create-resource-hooks";
import type { Reminder } from "@/lib/types";

const hooks = createResourceHooks<Reminder>("reminders");

export const useReminders = hooks.useList;
export const useCreateReminder = hooks.useCreate;
export const useUpdateReminder = hooks.useUpdate;
export const useDeleteReminder = hooks.useRemove;
