import { AtSign, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { SITE } from "@/lib/constants";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Emergency Card", href: "/dashboard/emergency" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/about" },
      { label: "Blog", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/about" },
      { label: "Terms", href: "/about" },
      { label: "Security", href: "/features" },
      { label: "HIPAA", href: "/about" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {SITE.description}
            </p>
            <div className="mt-6 flex gap-3">
              {[AtSign, Globe, MessageCircle].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Social link"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for families. Secured by design.
          </p>
        </div>
      </div>
    </footer>
  );
}
