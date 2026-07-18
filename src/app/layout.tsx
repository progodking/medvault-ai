import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/components/auth/auth-provider";
import { inter, poppins } from "@/lib/fonts";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "health records",
    "family health",
    "medical vault",
    "prescription storage",
    "AI health",
    "emergency card",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full">
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
