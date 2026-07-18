"use client";

import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api-client";
import { AI_DISCLAIMER } from "@/lib/constants";

interface Props {
  medicine: string;
  trigger: ReactNode;
}

export function MedicineExplainDialog({ medicine, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [source, setSource] = useState<string>("");

  const explain = async () => {
    setLoading(true);
    setExplanation("");
    try {
      const res = await api.post<{ explanation: string; source: string }>(
        "/api/ai/explain-medicine",
        { name: medicine },
      );
      setExplanation(res.explanation);
      setSource(res.source);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o && !explanation) explain();
      }}
    >
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" /> {medicine}
          </DialogTitle>
          <DialogDescription>
            AI explanation in simple language
            {source === "demo" && " (demo response — add a Gemini key for live AI)"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" /> Generating explanation…
          </div>
        ) : (
          <div className="space-y-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {explanation.replace(/\*\*/g, "")}
            </div>
            <div className="flex gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{AI_DISCLAIMER}</span>
            </div>
            <Button variant="outline" onClick={explain} className="w-full">
              Regenerate
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
