"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  EmergencyCardView,
  type EmergencyData,
} from "@/components/emergency/emergency-card-view";
import { MemberSelect } from "@/components/shared/member-select";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { useMembers } from "@/hooks/use-members";

export default function EmergencyPage() {
  const { data: members } = useMembers();
  const [selectedId, setSelectedId] = useState("");
  const memberId = selectedId || members?.[0]?.id || "";

  const { data, isLoading } = useQuery({
    queryKey: ["emergency", memberId],
    queryFn: () => api.get<EmergencyData>(`/api/emergency/${memberId}`),
    enabled: !!memberId,
  });

  const shareUrl =
    typeof window !== "undefined" && memberId
      ? `${window.location.origin}/emergency/${memberId}`
      : "";

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Emergency card — ${data?.name ?? ""}`,
          url: shareUrl,
        });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Secure link copied", {
      description: "Single-use link expires in 24 hours.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Card"
        description="One-click access to critical health info — shareable via secure link or QR."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
          <Label className="mb-1.5 block">Member</Label>
          <MemberSelect
            value={memberId}
            onValueChange={setSelectedId}
            members={members}
          />

          <div className="mt-5 space-y-2">
            <Button onClick={share} variant="outline" className="w-full gap-2" disabled={!data}>
              <Share2 className="size-4" /> Share secure link
            </Button>
            <Button onClick={() => window.print()} className="w-full gap-2 brand-gradient text-white" disabled={!data}>
              <Download className="size-4" /> Download PDF
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Secure share links are single-use and expire after 24 hours.
          </p>
        </Card>

        <div>
          {isLoading || !data ? (
            <Skeleton className="mx-auto h-[520px] w-full max-w-md rounded-3xl" />
          ) : (
            <EmergencyCardView data={data} qrValue={shareUrl} />
          )}
        </div>
      </div>
    </div>
  );
}
