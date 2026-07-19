"use client";

import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  Bell,
  Globe,
  Languages,
  Lock,
  Moon,
  ScrollText,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api-client";
import { DEMO_USER } from "@/lib/demo-user";
import { formatDateTime, initials } from "@/lib/format";
import type { AuditLogEntry } from "@/lib/types";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof User;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-heading font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<string>("en");
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [name, setName] = useState<string>(DEMO_USER.name);
  const [emailAddr, setEmailAddr] = useState<string>(DEMO_USER.email);

  const {
    data: audit,
    isError: auditError,
    refetch: refetchAudit,
  } = useQuery({
    queryKey: ["audit"],
    queryFn: () => api.get<AuditLogEntry[]>("/api/audit"),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account, preferences and security." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Section icon={User} title="Profile" description="Update your personal details.">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={DEMO_USER.avatarUrl} alt={DEMO_USER.name} />
              <AvatarFallback>{initials(DEMO_USER.name)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change photo</Button>
          </div>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pname">Full name</Label>
              <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pemail">Email</Label>
              <Input id="pemail" type="email" value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} />
            </div>
            <Button
              className="brand-gradient text-white"
              onClick={() => toast.success("Profile updated")}
            >
              Save changes
            </Button>
          </div>
        </Section>

        {/* Appearance & language */}
        <div className="space-y-6">
          <Section icon={Moon} title="Appearance" description="Choose your theme.">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Moon className="size-4" /> Dark mode
              </span>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              />
            </div>
          </Section>

          <Section icon={Languages} title="Language" description="Select your preferred language.">
            <Select
              value={language}
              onValueChange={(v) => setLanguage(v ?? "en")}
              items={[{ value: "en", label: "English" }, { value: "hi", label: "हिन्दी (Hindi)" }]}
            >
              <SelectTrigger className="h-9 w-full">
                <span className="flex items-center gap-2">
                  <Globe className="size-4" /> <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </Section>
        </div>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications" description="Control how you get reminded.">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium">Push notifications</span>
              <Switch checked={push} onCheckedChange={setPush} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium">Email notifications</span>
              <Switch checked={email} onCheckedChange={setEmail} />
            </div>
          </div>
        </Section>

        {/* Password */}
        <Section icon={Lock} title="Password" description="Change your account password.">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cur">Current password</Label>
              <Input id="cur" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" placeholder="••••••••" />
            </div>
            <Button variant="outline" onClick={() => toast.success("Password updated")}>
              Update password
            </Button>
          </div>
        </Section>
      </div>

      {/* Audit log */}
      <Section icon={ScrollText} title="Audit log" description="Recent activity on your vault.">
        <div className="space-y-2">
          {(audit ?? []).map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <div>
                <p className="font-medium">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.target}</p>
              </div>
              <span className="text-xs text-muted-foreground">{formatDateTime(a.timestamp)}</span>
            </div>
          ))}
          {auditError ? (
            <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <span className="text-muted-foreground">Couldn&apos;t load the audit log.</span>
              <Button variant="outline" size="sm" onClick={() => refetchAudit()}>
                Try again
              </Button>
            </div>
          ) : (
            (audit ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )
          )}
        </div>
      </Section>

      {/* Danger zone */}
      <Card className="gap-0 rounded-2xl border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Trash2 className="size-5" />
          </span>
          <div>
            <h2 className="font-heading font-semibold text-destructive">Delete account</h2>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all family data.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive">Delete my account</Button>} />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes your account, all family members and their
                  medical records. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.success("Account scheduled for deletion (demo)")}>
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}
