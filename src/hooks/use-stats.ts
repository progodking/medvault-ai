"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { StorageStat } from "@/lib/types";

export interface DashboardStats {
  members: number;
  records: number;
  medicines: number;
  upcomingReminders: number;
  expiredMedicines: number;
  storage: StorageStat;
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get<DashboardStats>("/api/stats"),
  });
}
