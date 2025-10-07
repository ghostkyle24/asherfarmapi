import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = await params;
  const conta = await prisma.conta.findUnique({ where: { id: p.id }, include: { bms: true } });
  if (!conta) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(conta);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { profileName, amountPaid, processDate, templateApproved, reposicao, categoria, inviteLink, bms, estado } = body;
  const p = await params;
  const updated = await prisma.conta.update({
    where: { id: p.id },
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
        deleteMany: {},
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
  return NextResponse.json({ id: updated.id });
}


