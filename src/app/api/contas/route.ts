import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const date = searchParams.get("date") ?? undefined;
  const where: Prisma.ContaWhereInput = {};
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
  const { profileName, amountPaid, processDate, templateApproved, reposicao, categoria, inviteLink, bms, estado } = body as {
    profileName?: string | null;
    amountPaid?: number | null;
    processDate?: string | null;
    templateApproved?: boolean | null;
    reposicao?: boolean | null;
    categoria?: "C250" | "C1K" | "C10K" | null;
    inviteLink?: string | null;
    estado?: "ATIVA" | "CAIDA" | "RESTABELECENDO" | null;
    bms?: Array<{ name?: string | null }> | null;
  };
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
      bms: {
        create: (
          Array.isArray(bms)
            ? (bms as Array<{ name?: string | null }>)
            : []
        )
          .filter((x): x is { name: string } => typeof x?.name === "string" && x.name.trim().length > 0)
          .map((x) => ({ name: x.name })),
      },
    },
  });
  return NextResponse.json({ id: created.id }, { status: 201 });
}


