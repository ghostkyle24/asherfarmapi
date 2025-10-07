import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const date = searchParams.get("date") ?? undefined;
  const where: any = {};
  if (q) {
    where.OR = [
      { profileName: { contains: q, mode: "insensitive" } },
      { bms: { some: { name: { contains: q, mode: "insensitive" } } } },
    ];
  }
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    where.processDate = { gte: start, lt: end };
  }
  const contas = await prisma.conta.findMany({ where, include: { bms: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(contas);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { profileName, amountPaid, processDate, templateApproved, reposicao, categoria, inviteLink, bms, estado } = body;
  const created = await prisma.conta.create({
    data: {
      profileName,
      amountPaid,
      processDate: processDate ? new Date(processDate) : null,
      templateApproved,
      reposicao,
      categoria,
      inviteLink,
      estado,
      bms: { create: (Array.isArray(bms) ? bms : []).map((x: any) => ({ name: x.name })) },
    },
  });
  return NextResponse.json({ id: created.id }, { status: 201 });
}


