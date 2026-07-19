import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  error?: unknown;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Surfaces a failed data fetch instead of leaving the caller stuck on a
 * skeleton or an empty state that masks the error. Shows the underlying message
 * and an optional retry action.
 */
export function ErrorState({
  title = "Something went wrong",
  error,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  const message =
    description ?? errorMessage(error, "Couldn't load this data. Please try again.");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
