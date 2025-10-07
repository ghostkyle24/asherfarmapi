import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function ensureUser(username: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return existing;
  const hash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      username,
      name: name ?? username,
      passwordHash: hash,
      role: "user",
    },
  });
}

async function main() {
  await ensureUser("wesleydaniel", "sourico", "wesleydaniel");
  await ensureUser("motomoto", "sereirico", "motomoto");
}

main()
  .then(() => {
    console.log("Users created or already existed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


