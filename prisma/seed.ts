/**
 * Seed script for MedVault AI.
 * Run: npx prisma db seed   (configured under "prisma.seed" in package.json)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "aarav@medvault.ai" },
    update: {},
    create: {
      email: "aarav@medvault.ai",
      name: "Aarav Sharma",
      plan: "premium",
      avatarUrl:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=256&q=80&auto=format&fit=crop",
    },
  });

  const aarav = await prisma.familyMember.create({
    data: {
      userId: user.id,
      name: "Aarav Sharma",
      relationship: "Self",
      dateOfBirth: new Date("1990-04-12"),
      gender: "Male",
      bloodGroup: "O_POS",
      conditions: ["Type 2 Diabetes", "Hypertension"],
      allergies: ["Penicillin"],
      emergencyContactName: "Priya Sharma",
      emergencyContactPhone: "+91 98765 43210",
      heightCm: 176,
      weightKg: 78,
      records: {
        create: [
          {
            title: "HbA1c Blood Test",
            category: "Report",
            date: new Date("2024-11-02"),
            doctorName: "Dr. Neha Kapoor",
            hospital: "Apollo Hospital",
            diagnosis: "Elevated blood sugar",
            medicines: ["Metformin 500mg"],
            tags: ["report", "diabetes", "2024"],
          },
          {
            title: "Chest X-Ray",
            category: "Scan",
            date: new Date("2024-08-15"),
            hospital: "Fortis Healthcare",
            tags: ["scan", "2024"],
          },
        ],
      },
      medicines: {
        create: [
          {
            name: "Metformin",
            dosage: "500mg",
            schedule: ["morning", "night"],
            startDate: new Date("2024-11-02"),
            expiryDate: new Date("2026-05-01"),
            reminderEnabled: true,
            notes: "Take after meals",
          },
        ],
      },
      reminders: {
        create: [
          {
            type: "Medicine",
            title: "Take Metformin",
            dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
            channels: ["push", "email"],
          },
        ],
      },
    },
  });

  await prisma.familyMember.create({
    data: {
      userId: user.id,
      name: "Priya Sharma",
      relationship: "Spouse",
      dateOfBirth: new Date("1992-09-23"),
      gender: "Female",
      bloodGroup: "A_POS",
      conditions: [],
      allergies: ["Sulfa drugs"],
      emergencyContactName: "Aarav Sharma",
      emergencyContactPhone: "+91 98765 11111",
      heightCm: 162,
      weightKg: 58,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "Seed data created",
      target: `Member ${aarav.name}`,
      actor: user.email,
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
