"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateMember, useUpdateMember } from "@/hooks/use-members";
import { BLOOD_GROUPS, RELATIONSHIPS } from "@/lib/constants";
import type { FamilyMember } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Enter a name"),
  relationship: z.string().min(1),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.string().min(1),
  bloodGroup: z.string().min(1),
  photoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  conditions: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  heightCm: z.string().optional(),
  weightKg: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface MemberFormDialogProps {
  trigger: ReactNode;
  member?: FamilyMember;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MemberFormDialog({
  trigger,
  member,
  open,
  onOpenChange,
}: MemberFormDialogProps) {
  const isEdit = !!member;
  const create = useCreateMember();
  const update = useUpdateMember(member?.id ?? "");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      relationship: "Other",
      gender: "Male",
      bloodGroup: "O+",
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        relationship: member.relationship,
        dateOfBirth: member.dateOfBirth,
        gender: member.gender,
        bloodGroup: member.bloodGroup,
        photoUrl: member.photoUrl ?? "",
        conditions: member.conditions.join(", "),
        allergies: member.allergies.join(", "),
        emergencyContactName: member.emergencyContactName,
        emergencyContactPhone: member.emergencyContactPhone,
        heightCm: member.heightCm?.toString() ?? "",
        weightKg: member.weightKg?.toString() ?? "",
      });
    }
  }, [member, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload: Partial<FamilyMember> = {
      name: values.name,
      relationship: values.relationship as FamilyMember["relationship"],
      dateOfBirth: values.dateOfBirth,
      gender: values.gender as FamilyMember["gender"],
      bloodGroup: values.bloodGroup as FamilyMember["bloodGroup"],
      photoUrl: values.photoUrl || undefined,
      conditions: values.conditions
        ? values.conditions.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      allergies: values.allergies
        ? values.allergies.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      emergencyContactName: values.emergencyContactName,
      emergencyContactPhone: values.emergencyContactPhone,
      heightCm: values.heightCm ? Number(values.heightCm) : undefined,
      weightKg: values.weightKg ? Number(values.weightKg) : undefined,
    };

    try {
      if (isEdit) {
        await update.mutateAsync(payload);
        toast.success("Member updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Member added");
        reset();
      }
      onOpenChange?.(false);
    } catch (err) {
      toast.error(isEdit ? "Couldn't update member" : "Couldn't add member", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit member" : "Add family member"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this member's profile details."
              : "Create a health profile for a family member."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Aarav Sharma" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Relationship</Label>
              <Controller
                control={control}
                name="relationship"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIPS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of birth</Label>
              <Input id="dob" type="date" {...register("dateOfBirth")} />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Male", "Female", "Other"].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Blood group</Label>
              <Controller
                control={control}
                name="bloodGroup"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" placeholder="170" {...register("heightCm")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" placeholder="65" {...register("weightKg")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="conditions">Conditions (comma separated)</Label>
            <Input id="conditions" placeholder="Diabetes, Hypertension" {...register("conditions")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="allergies">Allergies (comma separated)</Label>
            <Input id="allergies" placeholder="Penicillin, Peanuts" {...register("allergies")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ecn">Emergency contact</Label>
              <Input id="ecn" placeholder="Priya Sharma" {...register("emergencyContactName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ecp">Contact phone</Label>
              <Input id="ecp" placeholder="+91 98765 43210" {...register("emergencyContactPhone")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="photo">Photo URL (optional)</Label>
            <Input id="photo" placeholder="https://…" {...register("photoUrl")} />
            {errors.photoUrl && (
              <p className="text-xs text-destructive">{errors.photoUrl.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending} className="brand-gradient text-white">
              {pending ? <Loader2 className="size-4 animate-spin" /> : isEdit ? "Save changes" : "Add member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
