import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { User, Calendar, CheckCircle2, RotateCw, Link2, Wallet } from "lucide-react";
import type { Prisma } from "@prisma/client";

export default async function ContasPage({ searchParams }: { searchParams: Promise<{ q?: string; date?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const sp = await searchParams;
  const q = sp.q?.trim();
  const date = sp.date;
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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contas</h1>
      <form className="flex gap-2">
        <Input name="q" placeholder="Buscar por nome/BM" defaultValue={q} />
        <Input type="date" name="date" defaultValue={date} className="w-[200px]" />
        <Button type="submit">Buscar</Button>
      </form>
      <div className="grid gap-3">
        {contas.map((c) => (
          <a href={`/dashboard/contas/${c.id}`} key={c.id}>
            <Card>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  <div className="flex items-center gap-2"><User size={16} className="text-neutral-400"/><span className="text-neutral-400">Perfil:</span> <span className="font-medium">{c.profileName ?? "-"}</span></div>
                  <div className="flex items-center gap-2"><Wallet size={16} className="text-neutral-400"/><span className="text-neutral-400">Valor:</span> <span className="font-medium">{c.amountPaid?.toString() ?? "-"}</span></div>
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-neutral-400"/><span className="text-neutral-400">Data:</span> <span className="font-medium">{c.processDate ? new Date(c.processDate).toLocaleDateString() : "-"}</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-neutral-400"/><span className="text-neutral-400">Template:</span> {c.templateApproved == null ? <Badge variant="outline">-</Badge> : c.templateApproved ? <Badge variant="success">SIM</Badge> : <Badge variant="danger">NÃO</Badge>}</div>
                  <div className="flex items-center gap-2"><RotateCw size={16} className="text-neutral-400"/><span className="text-neutral-400">Reposição:</span> {c.reposicao == null ? <Badge variant="outline">-</Badge> : c.reposicao ? <Badge variant="success">SIM</Badge> : <Badge variant="danger">NÃO</Badge>}</div>
                  <div className="flex items-center gap-2"><span className="text-neutral-400">Estado:</span> <Badge variant="violet">{c.estado ? (c.estado === 'ATIVA' ? 'Ativa' : c.estado === 'CAIDA' ? 'Caída' : 'Restabelecendo') : '-'}</Badge></div>
                  <div className="flex items-center gap-2"><Badge variant="violet">{c.categoria ?? "-"}</Badge></div>
                  <div className="flex items-center gap-2 col-span-full truncate"><Link2 size={16} className="text-neutral-400"/><span className="text-neutral-400">Convite:</span> <span className="font-medium truncate">{c.inviteLink ?? "-"}</span></div>
                </div>
                {c.bms.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.bms.map((b)=> (
                      <Badge key={b.id} variant="cyan">{b.name}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
        {contas.length === 0 && <div className="text-neutral-400">Nenhum resultado</div>}
      </div>
    </div>
  );
}


