"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Reminder } from "@/lib/types";

export function useReminders(memberId?: string) {
  return useQuery({
    queryKey: ["reminders", memberId ?? "all"],
    queryFn: () =>
      api.get<Reminder[]>(
        memberId ? `/api/reminders?memberId=${memberId}` : "/api/reminders",
      ),
  });
}

export function useCreateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Reminder>) =>
      api.post<Reminder>("/api/reminders", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useUpdateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reminder> }) =>
      api.put<Reminder>(`/api/reminders/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useDeleteReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/reminders/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}
