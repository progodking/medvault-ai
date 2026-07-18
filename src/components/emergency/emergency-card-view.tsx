"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  Activity,
  Droplet,
  Phone,
  Pill,
  ShieldAlert,
  TriangleAlert,
  User,
} from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { calcAge } from "@/lib/format";

export interface EmergencyData {
  memberId: string;
  name: string;
  age: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  currentMedicines: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export function EmergencyCardView({
  data,
  qrValue,
}: {
  data: EmergencyData;
  qrValue?: string;
}) {
  return (
    <div
      id="emergency-card"
      className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-glow print:shadow-none"
    >
      <div className="flex items-center justify-between brand-gradient px-6 py-5 text-white">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-6" />
          <div>
            <p className="font-heading text-lg font-bold leading-tight">Emergency Card</p>
            <p className="text-xs text-white/80">MedVault AI</p>
          </div>
        </div>
        <LogoMark className="size-9" />
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <User className="size-6" />
            </span>
            <div>
              <p className="font-heading text-xl font-bold">{data.name}</p>
              <p className="text-sm text-muted-foreground">{calcAge(data.age)} years old</p>
            </div>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-destructive/10 px-4 py-2 text-destructive">
            <Droplet className="size-4" />
            <span className="font-heading text-lg font-bold">{data.bloodGroup}</span>
          </div>
        </div>

        <Row icon={TriangleAlert} tone="text-warning" label="Allergies">
          {data.allergies.length ? (
            <div className="flex flex-wrap gap-1.5">
              {data.allergies.map((a) => (
                <Badge key={a} variant="outline" className="border-warning/40 text-warning">{a}</Badge>
              ))}
            </div>
          ) : <span className="text-sm text-muted-foreground">None</span>}
        </Row>

        <Row icon={Activity} tone="text-secondary" label="Conditions">
          {data.conditions.length ? (
            <div className="flex flex-wrap gap-1.5">
              {data.conditions.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
            </div>
          ) : <span className="text-sm text-muted-foreground">None</span>}
        </Row>

        <Row icon={Pill} tone="text-primary" label="Current medicines">
          {data.currentMedicines.length ? (
            <ul className="space-y-0.5 text-sm">
              {data.currentMedicines.map((m) => <li key={m}>• {m}</li>)}
            </ul>
          ) : <span className="text-sm text-muted-foreground">None</span>}
        </Row>

        {data.emergencyContactName && (
          <div className="flex items-center gap-3 rounded-2xl bg-accent p-4">
            <Phone className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Emergency contact</p>
              <p className="font-semibold">
                {data.emergencyContactName} · {data.emergencyContactPhone}
              </p>
            </div>
          </div>
        )}

        {qrValue && (
          <div className="flex flex-col items-center gap-2 border-t border-border pt-5">
            <div className="rounded-2xl bg-white p-3">
              <QRCodeSVG value={qrValue} size={128} fgColor="#0F172A" />
            </div>
            <p className="text-xs text-muted-foreground">Scan for live emergency profile</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  tone,
  label,
  children,
}: {
  icon: typeof Droplet;
  tone: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className={`size-4 ${tone}`} /> {label}
      </p>
      {children}
    </div>
  );
}
