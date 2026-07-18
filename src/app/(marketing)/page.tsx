import { Cta } from "@/components/marketing/landing/cta";
import { Faq } from "@/components/marketing/landing/faq";
import { Features } from "@/components/marketing/landing/features";
import { Hero } from "@/components/marketing/landing/hero";
import { Previews } from "@/components/marketing/landing/previews";
import { Testimonials } from "@/components/marketing/landing/testimonials";
import { Trusted } from "@/components/marketing/landing/trusted";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Trusted />
      <Features />
      <Previews />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  );
}
