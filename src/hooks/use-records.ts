"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MedicalRecord } from "@/lib/types";

export function useRecords(memberId?: string) {
  return useQuery({
    queryKey: ["records", memberId ?? "all"],
    queryFn: () =>
      api.get<MedicalRecord[]>(
        memberId ? `/api/records?memberId=${memberId}` : "/api/records",
      ),
  });
}

export function useCreateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MedicalRecord>) =>
      api.post<MedicalRecord>("/api/records", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["records"] }),
  });
}

export function useDeleteRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/records/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["records"] }),
  });
}
