"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { FamilyMember } from "@/lib/types";

const KEY = ["members"];

export function useMembers() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api.get<FamilyMember[]>("/api/members"),
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => api.get<FamilyMember>(`/api/members/${id}`),
    enabled: !!id,
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FamilyMember>) =>
      api.post<FamilyMember>("/api/members", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateMember(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FamilyMember>) =>
      api.put<FamilyMember>(`/api/members/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: [...KEY, id] });
    },
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/members/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
