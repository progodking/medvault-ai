"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Medicine } from "@/lib/types";

export function useMedicines(memberId?: string) {
  return useQuery({
    queryKey: ["medicines", memberId ?? "all"],
    queryFn: () =>
      api.get<Medicine[]>(
        memberId ? `/api/medicines?memberId=${memberId}` : "/api/medicines",
      ),
  });
}

export function useCreateMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Medicine>) =>
      api.post<Medicine>("/api/medicines", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicines"] }),
  });
}

export function useUpdateMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Medicine> }) =>
      api.put<Medicine>(`/api/medicines/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicines"] }),
  });
}

export function useDeleteMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/medicines/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicines"] }),
  });
}
