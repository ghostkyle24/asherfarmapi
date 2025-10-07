import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST() {
  const count = await prisma.user.count();
  if (count > 0) return NextResponse.json({ ok: true, alreadySeeded: true });
  const users = [
    { username: "Wesley", name: "Wesley", password: "senhaWesley" },
    { username: "Dan", name: "Dan", password: "senhaDan" },
  ];
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.user.create({ data: { username: u.username, name: u.name, passwordHash: hash, role: "user" } });
  }
  return NextResponse.json({ ok: true });
}


