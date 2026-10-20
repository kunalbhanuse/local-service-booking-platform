/**
 * Seeds the first ADMIN account (required – there is no other way to create one),
 * and optionally a demo provider with services when SEED_DEMO=true.
 *
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=changeme npm run db:seed
 *   SEED_DEMO=true npm run db:seed          # also adds demo data (dev only)
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrator";

  if (!email || !password) {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set – skipping admin seed.");
    return;
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: { name, email, password: await bcrypt.hash(password, 10), role: "ADMIN" },
    select: { id: true, email: true, role: true },
  });
  console.log(`Admin ready: ${admin.email} (id ${admin.id})`);
}

async function seedDemo() {
  if (process.env.SEED_DEMO !== "true") return;

  const password = await bcrypt.hash("password123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "demo.provider@example.com" },
    update: { role: "SERVICE_PROVIDER" },
    create: { name: "Rahul Sharma", email: "demo.provider@example.com", password, role: "SERVICE_PROVIDER" },
  });

  const provider = await prisma.provider.upsert({
    where: { userId: owner.id },
    update: { status: "APPROVED", isAvailable: true },
    create: {
      userId: owner.id,
      businessName: "Sharma Home Services",
      bio: "Family-run team covering plumbing and electrical work across Pune since 2014. Same-day visits for emergencies.",
      phone: "+91 98765 43210",
      city: "Pune",
      area: "Kothrud",
      experience: 10,
      status: "APPROVED",
      isAvailable: true,
    },
  });

  const services = [
    { name: "Tap & pipe leak repair", description: "Diagnose and fix leaking taps, joints and exposed pipes. Parts extra.", price: 499, category: "PLUMBING" },
    { name: "Bathroom fitting installation", description: "Install showers, taps, geysers and flush systems. Includes sealing.", price: 1499, category: "PLUMBING" },
    { name: "Ceiling fan & light fitting", description: "Mount and wire fans, lights and switchboards safely.", price: 399, category: "ELECTRICAL" },
    { name: "Full home electrical safety check", description: "Inspect wiring, earthing and MCBs. Written report included.", price: 999, category: "ELECTRICAL" },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { providerId_name: { providerId: provider.id, name: s.name } },
      update: { ...s, isActive: true },
      create: { ...s, providerId: provider.id },
    });
  }

  await prisma.user.upsert({
    where: { email: "demo.customer@example.com" },
    update: {},
    create: { name: "Priya Mehta", email: "demo.customer@example.com", password },
  });

  console.log("Demo data ready: demo.provider@example.com / demo.customer@example.com (password: password123)");
}

seedAdmin()
  .then(seedDemo)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
