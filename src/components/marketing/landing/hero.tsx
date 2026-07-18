"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  FileText,
  Pill,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const floatFiles = [
  { icon: FileText, label: "Lab Report.pdf", tone: "text-secondary" },
  { icon: Pill, label: "Prescription.jpg", tone: "text-primary" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full brand-gradient opacity-20 blur-[120px] animate-aurora" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--muted-foreground)_16%,transparent)_1px,transparent_0)] [background-size:26px_26px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-28 lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur"
          >
            <Sparkles className="size-3.5 text-primary" />
            AI-powered family health vault
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-6 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Never Lose A <br className="hidden sm:block" />
            <span className="brand-text-gradient">Medical Report</span> Again
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg text-muted-foreground"
          >
            Prescriptions, lab reports and medical history scattered across
            hospitals, WhatsApp and paper files? MedVault AI keeps every family
            member&apos;s records in one secure, searchable place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 gap-2 brand-gradient px-6 text-base text-white shadow-glow"
              render={<Link href="/signup">Start free <ArrowRight className="size-4" /></Link>}
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 gap-2 px-6 text-base"
              render={<Link href="/features"><Upload className="size-4" /> See how it works</Link>}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-success" /> Encrypted storage
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-success" /> No credit card
            </span>
          </motion.div>
        </div>

        {/* Upload preview animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="glass-strong relative rounded-3xl border border-border/70 p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-destructive/70" />
                <span className="size-3 rounded-full bg-warning/70" />
                <span className="size-3 rounded-full bg-success/70" />
              </div>
              <span className="text-xs text-muted-foreground">MedVault AI · Upload</span>
            </div>

            <div className="mt-5 rounded-2xl border-2 border-dashed border-primary/40 bg-accent/50 p-8 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl brand-gradient text-white shadow-glow">
                <Upload className="size-6" />
              </div>
              <p className="mt-3 text-sm font-medium">Drop your report here</p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG · OCR extracts everything
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Scanning with OCR…</span>
                <span>100%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full brand-gradient"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, delay: 0.6, ease: "easeInOut" }}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {[
                ["Doctor", "Dr. Neha Kapoor"],
                ["Hospital", "Apollo Hospital"],
                ["Diagnosis", "Diabetes — controlled"],
                ["Date", "10 Jun 2025"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-card p-2.5">
                  <p className="text-[10px] uppercase text-muted-foreground">{k}</p>
                  <p className="mt-0.5 font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {floatFiles.map((f, i) => (
            <motion.div
              key={f.label}
              className="absolute hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-soft sm:flex"
              style={
                i === 0
                  ? { top: "-1.5rem", right: "1rem" }
                  : { bottom: "-1.5rem", left: "1rem" }
              }
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <f.icon className={`size-4 ${f.tone}`} />
              {f.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
