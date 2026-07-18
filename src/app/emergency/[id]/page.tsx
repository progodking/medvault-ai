"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

import {
  EmergencyCardView,
  type EmergencyData,
} from "@/components/emergency/emergency-card-view";
import { api } from "@/lib/api-client";

export default function PublicEmergencyPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["emergency-public", id],
    queryFn: () => api.get<EmergencyData>(`/api/emergency/${id}`),
    enabled: !!id,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {isLoading ? (
        <Loader2 className="size-6 animate-spin text-primary" />
      ) : isError || !data ? (
        <p className="text-sm text-muted-foreground">Emergency card not found.</p>
      ) : (
        <EmergencyCardView data={data} />
      )}
    </div>
  );
}
