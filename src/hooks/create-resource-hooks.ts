"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api-client";

/**
 * Builds the standard list / create / update / delete React Query hooks for a
 * member-scoped resource. Every resource exposes the same CRUD surface against
 * `/api/<resource>`, so the hooks only differ by name and payload type.
 */
export function createResourceHooks<T>(resource: string) {
  const key = [resource];
  const path = `/api/${resource}`;

  function useList(memberId?: string) {
    return useQuery({
      queryKey: [resource, memberId ?? "all"],
      queryFn: () =>
        api.get<T[]>(memberId ? `${path}?memberId=${memberId}` : path),
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: Partial<T>) => api.post<T>(path, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
        api.put<T>(`${path}/${id}`, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
  }

  function useRemove() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => api.del(`${path}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
  }

  return { useList, useCreate, useUpdate, useRemove };
}
