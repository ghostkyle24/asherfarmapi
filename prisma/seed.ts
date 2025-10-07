import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	const count = await prisma.user.count();
	if (count > 0) return;
	const users = [
		{ username: "Wesley", name: "Wesley", password: "senhaWesley" },
		{ username: "Dan", name: "Dan", password: "senhaDan" },
	];
	for (const u of users) {
		const hash = await bcrypt.hash(u.password, 10);
		await prisma.user.create({ data: { username: u.username, name: u.name, passwordHash: hash, role: "user" } });
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
