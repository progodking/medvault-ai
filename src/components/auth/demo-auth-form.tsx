"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpStep } from "@/components/auth/otp-step";
import { GoogleButton } from "@/components/auth/google-button";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Enter your name"),
});

interface DemoAuthFormProps {
  mode: "login" | "signup";
}

export function DemoAuthForm({ mode }: DemoAuthFormProps) {
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const schema = mode === "signup" ? signupSchema : loginSchema;

  type AuthValues = z.infer<typeof signupSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: zodResolver(schema) as unknown as Resolver<AuthValues>,
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    if (mode === "signup") {
      setShowOtp(true);
      toast.info("Verification code sent", {
        description: "Use 123456 to continue (demo).",
      });
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
  };

  if (showOtp) {
    return <OtpStep onVerified={() => router.push("/dashboard")} />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {mode === "signup" ? "Create your vault" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Start protecting your family's health records today."
            : "Log in to access your family health vault."}
        </p>
      </div>

      <GoogleButton
        label={mode === "signup" ? "Sign up with Google" : "Continue with Google"}
      />

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Aarav Sharma" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === "login" && (
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full gap-2 brand-gradient text-white shadow-glow"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              {mode === "signup" ? "Create account" : "Log in"}
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to MedVault AI?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Mail className="size-3" />
        Demo mode — any details work. Add Clerk keys for real auth.
      </p>
    </div>
  );
}
