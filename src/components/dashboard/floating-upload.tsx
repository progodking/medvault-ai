"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function FloatingUpload() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard/upload")) return null;

  return (
    <Link
      href="/dashboard/upload"
      aria-label="Upload report"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-2xl brand-gradient text-white shadow-glow transition-transform hover:scale-105 active:scale-95",
      )}
    >
      <Plus className="size-6" />
    </Link>
  );
}
