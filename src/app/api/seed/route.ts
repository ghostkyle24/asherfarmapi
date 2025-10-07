import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

async function seedUsers() {
  const users = [
    { username: "Wesley", name: "Wesley", password: "senhaWesley" },
    { username: "Dan", name: "Dan", password: "senhaDan" },
    { username: "wesleydaniel", name: "wesleydaniel", password: "sourico" },
    { username: "motomoto", name: "motomoto", password: "sereirico" },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: { username: u.username, name: u.name, passwordHash: hash, role: "user" },
    });
  }
}

export async function POST() {
  await seedUsers();
  return NextResponse.json({ ok: true, seeded: true });
}

export async function GET() {
  await seedUsers();
  return NextResponse.json({ ok: true, seeded: true });
}


