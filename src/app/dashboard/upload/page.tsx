"use client";

import {
  Camera,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Upload as UploadIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { MemberSelect } from "@/components/shared/member-select";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMembers } from "@/hooks/use-members";
import { useCreateRecord } from "@/hooks/use-records";
import { RECORD_CATEGORIES } from "@/lib/constants";
import { extractFields } from "@/lib/extract";
import type { RecordCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type Stage = "idle" | "scanning" | "review";

export default function UploadPage() {
  const router = useRouter();
  const { data: members } = useMembers();
  const create = useCreateRecord();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"pdf" | "image">("image");

  const [memberId, setMemberId] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "Report" as RecordCategory,
    date: "",
    doctorName: "",
    hospital: "",
    diagnosis: "",
    medicines: "",
  });

  const runOcr = useCallback(async (file: File) => {
    const isPdf = file.type === "application/pdf";
    setFileType(isPdf ? "pdf" : "image");
    setFileName(file.name);
    if (!isPdf) setPreview(URL.createObjectURL(file));
    setStage("scanning");
    setProgress(0);

    if (isPdf) {
      // PDF text extraction is out of scope for on-device OCR; go straight to
      // manual review with a sensible default title.
      setForm((f) => ({ ...f, title: file.name.replace(/\.pdf$/i, "") }));
      setTimeout(() => {
        setProgress(100);
        setStage("review");
      }, 600);
      return;
    }

    try {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const fields = extractFields(data.text);
      setForm({
        title: fields.diagnosis || file.name.replace(/\.[^.]+$/, "") || "Scanned report",
        category: fields.category,
        date: fields.date ?? new Date().toISOString().slice(0, 10),
        doctorName: fields.doctorName ?? "",
        hospital: fields.hospital ?? "",
        diagnosis: fields.diagnosis ?? "",
        medicines: fields.medicines.join(", "),
      });
      setProgress(100);
      setStage("review");
      toast.success("Report scanned", {
        description: "Fields extracted — review and save.",
      });
    } catch {
      toast.error("OCR failed", { description: "You can enter details manually." });
      setForm((f) => ({ ...f, title: file.name.replace(/\.[^.]+$/, "") }));
      setStage("review");
    }
  }, []);

  const onFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!memberId && members?.length) setMemberId(members[0].id);
    runOcr(file);
  };

  const reset = () => {
    setStage("idle");
    setPreview(null);
    setProgress(0);
    setForm({
      title: "",
      category: "Report",
      date: "",
      doctorName: "",
      hospital: "",
      diagnosis: "",
      medicines: "",
    });
  };

  const save = async () => {
    if (!memberId) {
      toast.error("Select a family member first");
      return;
    }
    try {
      await create.mutateAsync({
        memberId,
        title: form.title || "Untitled record",
        category: form.category,
        date: form.date || new Date().toISOString().slice(0, 10),
        doctorName: form.doctorName || undefined,
        hospital: form.hospital || undefined,
        diagnosis: form.diagnosis || undefined,
        medicines: form.medicines
          ? form.medicines.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        fileType,
        tags: [form.category.toLowerCase(), (form.date || "").slice(0, 4)].filter(Boolean),
      });
      toast.success("Report saved to vault");
      router.push("/dashboard/timeline");
    } catch (err) {
      toast.error("Couldn't save report", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Reports"
        description="Drop a report and let AI-powered OCR extract everything automatically."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: dropzone / preview */}
        <Card className="gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
          <div className="mb-4 max-w-xs">
            <Label className="mb-1.5 block">Family member</Label>
            <MemberSelect
              value={memberId}
              onValueChange={setMemberId}
              members={members}
            />
          </div>

          {stage === "idle" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                onFiles(e.dataTransfer.files);
              }}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
                dragOver ? "border-primary bg-accent" : "border-border bg-card/50",
              )}
            >
              <div className="flex size-16 items-center justify-center rounded-2xl brand-gradient text-white shadow-glow">
                <UploadIcon className="size-7" />
              </div>
              <p className="mt-4 font-heading font-semibold">Drag &amp; drop your report</p>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF, JPG or PNG — OCR extracts the details
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button className="gap-2" onClick={() => inputRef.current?.click()}>
                  <UploadIcon className="size-4" /> Browse files
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => cameraRef.current?.click()}>
                  <Camera className="size-4" /> Use camera
                </Button>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
            </div>
          )}

          {stage !== "idle" && (
            <div>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Report preview" className="max-h-80 w-full object-contain" />
                ) : (
                  <div className="flex h-56 flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="size-10" />
                    <span className="text-sm">{fileName}</span>
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="absolute right-2 top-2"
                  onClick={reset}
                  aria-label="Remove"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {stage === "scanning" && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin text-primary" /> Scanning with OCR…
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {stage === "review" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm text-success">
                  <CheckCircle2 className="size-4" /> Scan complete — review the extracted details.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Right: extracted fields */}
        <Card className="gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold">Extracted details</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Auto-filled from OCR. Edit anything before saving.
          </p>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. HbA1c Blood Test" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as RecordCategory })}>
                  <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RECORD_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="doctor">Doctor</Label>
                <Input id="doctor" value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} placeholder="Dr. Neha Kapoor" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hospital">Hospital</Label>
                <Input id="hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} placeholder="Apollo Hospital" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input id="diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} placeholder="Diagnosis / impression" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="medicines">Medicines (comma separated)</Label>
              <Textarea id="medicines" rows={2} value={form.medicines} onChange={(e) => setForm({ ...form, medicines: e.target.value })} placeholder="Metformin 500mg, Amlodipine 5mg" />
            </div>

            <Button
              onClick={save}
              disabled={stage !== "review" || create.isPending}
              className="h-11 w-full brand-gradient text-white shadow-glow"
            >
              {create.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save to vault"}
            </Button>
            {stage !== "review" && (
              <p className="text-center text-xs text-muted-foreground">
                Upload a report to enable saving.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
