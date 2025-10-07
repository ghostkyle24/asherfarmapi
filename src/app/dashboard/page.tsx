import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { LayoutDashboard, PlusCircle, ListTree, Target, Banknote, RefreshCw } from "lucide-react";
import { prisma } from "../../lib/prisma";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ start?: string; end?: string }> }) {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/login");
	const sp = await searchParams;
	const startStr = sp.start?.trim();
	const endStr = sp.end?.trim();
	const start = startStr && !Number.isNaN(Date.parse(startStr)) ? new Date(startStr) : undefined;
	const end = endStr && !Number.isNaN(Date.parse(endStr)) ? new Date(endStr) : undefined;
	const endPlus = end ? new Date(new Date(end).setDate(end.getDate() + 1)) : undefined;
	const whereDate: any = {};
	if (start || endPlus) {
		whereDate.processDate = {
			...(start ? { gte: start } : {}),
			...(endPlus ? { lt: endPlus } : {}),
		};
	}

	const [count1k, count10k, reposCount, sumAmount] = await Promise.all([
		prisma.conta.count({ where: { ...whereDate, categoria: "C1K" } }),
		prisma.conta.count({ where: { ...whereDate, categoria: "C10K" } }),
		prisma.conta.count({ where: { ...whereDate, reposicao: true } }),
		prisma.conta.aggregate({ where: { ...whereDate }, _sum: { amountPaid: true } }),
	]);
	const totalSpentNumber = (sumAmount._sum.amountPaid as any)?.toNumber?.() ?? Number(sumAmount._sum.amountPaid ?? 0);
	const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalSpentNumber || 0);

	return (
		<div className="space-y-8">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-gradient">Dashboard</h1>
				<Link href="/dashboard/nova">
					<Button>Criar Conta</Button>
				</Link>
			</header>

			{/* Ações principais acima das estatísticas */}
			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Link href="/dashboard/nova" className="group">
					<Card className="hover:scale-[1.01] transition-transform">
						<CardContent className="p-5 flex items-center gap-4">
							<div className="p-3 rounded-lg bg-[rgba(34,211,238,0.15)] text-[var(--accent-2)]">
								<PlusCircle size={22} />
							</div>
							<div>
								<div className="font-semibold">Nova Conta</div>
								<div className="text-sm text-neutral-400">Cadastrar informações</div>
							</div>
						</CardContent>
					</Card>
				</Link>
				<Link href="/dashboard/contas" className="group">
					<Card className="hover:scale-[1.01] transition-transform">
						<CardContent className="p-5 flex items-center gap-4">
							<div className="p-3 rounded-lg bg-[rgba(139,92,246,0.15)] text-[var(--accent)]">
								<ListTree size={22} />
							</div>
							<div>
								<div className="font-semibold">Ver contas</div>
								<div className="text-sm text-neutral-400">Listar e buscar</div>
							</div>
						</CardContent>
					</Card>
				</Link>
			</section>

			<form className="flex flex-wrap items-end gap-3">
				<div className="flex flex-col gap-1">
					<label className="text-sm text-neutral-300">Início</label>
					<input type="date" name="start" defaultValue={startStr} className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2" />
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm text-neutral-300">Fim</label>
					<input type="date" name="end" defaultValue={endStr} className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2" />
				</div>
				<Button type="submit">Filtrar</Button>
				<Link href="/dashboard" className="ml-auto text-sm text-neutral-400 hover:text-white">Limpar filtro</Link>
			</form>

			{(start || end) && (
				<p className="text-sm text-neutral-400">
					Período: {start ? start.toLocaleDateString("pt-BR") : "-"} — {end ? end.toLocaleDateString("pt-BR") : "-"}
				</p>
			)}

			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardContent className="p-5 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-[rgba(139,92,246,0.15)] text-[var(--accent)]"><Target size={22} /></div>
							<div>
								<div className="font-semibold">Contas 1k</div>
								<div className="text-sm text-neutral-400">no período</div>
							</div>
						</div>
						<div className="text-xl font-bold">{count1k}</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-5 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-[rgba(34,211,238,0.15)] text-[var(--accent-2)]"><Target size={22} /></div>
							<div>
								<div className="font-semibold">Contas 10k</div>
								<div className="text-sm text-neutral-400">no período</div>
							</div>
						</div>
						<div className="text-xl font-bold">{count10k}</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-5 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-[rgba(139,92,246,0.15)] text-[var(--accent)]"><Banknote size={22} /></div>
							<div>
								<div className="font-semibold">Valor gasto</div>
								<div className="text-sm text-neutral-400">com perfis</div>
							</div>
						</div>
						<div className="text-xl font-bold">{brl}</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-5 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-3 rounded-lg bg-[rgba(34,211,238,0.15)] text-[var(--accent-2)]"><RefreshCw size={22} /></div>
							<div>
								<div className="font-semibold">Reposições</div>
								<div className="text-sm text-neutral-400">no período</div>
							</div>
						</div>
						<div className="text-xl font-bold">{reposCount}</div>
					</CardContent>
				</Card>
			</section>


		</div>
	);
}


