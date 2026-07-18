import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/** Shield + cross mark inspired by the MedVault AI logo. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mv-shield" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16C7C7" />
          <stop offset="1" stopColor="#1F6BFF" />
        </linearGradient>
      </defs>
      <path
        d="M24 3l16 5v11c0 10.5-6.8 20.2-16 23-9.2-2.8-16-12.5-16-23V8l16-5z"
        fill="url(#mv-shield)"
      />
      <path
        d="M24 6.4l12.6 3.9V19c0 8.6-5.4 16.5-12.6 19-7.2-2.5-12.6-10.4-12.6-19v-8.7L24 6.4z"
        fill="#0F172A"
        fillOpacity="0.12"
      />
      <path
        d="M21 14h6v4h4v6h-4v4h-6v-4h-4v-6h4v-4z"
        fill="white"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function Logo({ className, showText = true, textClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showText && (
        <span className={cn("font-heading text-lg font-bold tracking-tight", textClassName)}>
          <span className="text-foreground">Med</span>
          <span className="text-primary">Vault</span>
          <span className="ml-1 rounded-md brand-gradient px-1.5 py-0.5 text-xs font-bold text-white align-middle">
            AI
          </span>
        </span>
      )}
    </span>
  );
}
