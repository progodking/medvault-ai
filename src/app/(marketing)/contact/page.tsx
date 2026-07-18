"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email"),
  subject: z.string().min(3, "Add a subject"),
  message: z.string().min(10, "Tell us a bit more"),
});

type FormValues = z.infer<typeof schema>;

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@medvault.ai" },
  { icon: Phone, label: "Phone", value: "+91 1800 123 4567" },
  { icon: MapPin, label: "Office", value: "Bengaluru, India" },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Message sent!", {
      description: `Thanks ${values.name}, we'll get back to you shortly.`,
    });
    reset();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            Contact
          </span>
          <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions about MedVault AI, partnerships or support? Send us a
            message and our team will respond within one business day.
          </p>

          <div className="mt-10 space-y-4">
            {contactInfo.map((c) => (
              <div key={c.label} className="flex items-center gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <c.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="rounded-3xl border-border/70 p-6 shadow-soft sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              <h2 className="font-heading text-lg font-semibold">
                Send a message
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" {...register("name")} />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  {...register("subject")}
                />
                {errors.subject && (
                  <p className="text-xs text-destructive">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Write your message…"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full brand-gradient text-white shadow-glow"
              >
                {isSubmitting ? "Sending…" : "Send message"}
              </Button>
            </form>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
