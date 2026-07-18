"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface OtpStepProps {
  onVerified: () => void;
}

export function OtpStep({ onVerified }: OtpStepProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text) {
      setDigits(text.padEnd(6, "").split("").slice(0, 6));
      refs.current[Math.min(text.length, 5)]?.focus();
    }
  };

  const verify = async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 700));
    setVerifying(false);
    toast.success("Verified!", { description: "Your account is ready." });
    onVerified();
  };

  const complete = digits.every((d) => d !== "");

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
          <ShieldCheck className="size-7" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">
          Verify your email
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code we sent. Use <b>123456</b> for the demo.
        </p>
      </div>

      <div className="flex justify-center gap-2" onPaste={onPaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className="size-12 rounded-xl border border-input bg-background text-center font-heading text-lg font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        ))}
      </div>

      <Button
        onClick={verify}
        disabled={!complete || verifying}
        className="mt-8 h-11 w-full brand-gradient text-white shadow-glow"
      >
        {verifying ? <Loader2 className="size-4 animate-spin" /> : "Verify & continue"}
      </Button>

      <button
        type="button"
        onClick={() => toast.info("A new code has been sent (demo).")}
        className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-primary"
      >
        Didn&apos;t get a code? Resend
      </button>
    </div>
  );
}
