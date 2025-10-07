"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Categoria = "C250" | "C1K" | "C10K";
type Estado = "ATIVA" | "CAIDA" | "RESTABELECENDO";
type Bm = { id: string; name: string };
type Conta = {
  id: string;
  profileName: string | null;
  amountPaid: string | number | null;
  bms: Bm[];
  processDate: string | Date | null;
  templateApproved: boolean | null;
  reposicao: boolean | null;
  categoria: Categoria | null;
  inviteLink: string | null;
  estado: Estado | null;
};

export default function EditContaPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [bmNames, setBmNames] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [templateApproved, setTemplateApproved] = useState<string>("");
  const [reposicao, setReposicao] = useState<string>("");
  const [categoria, setCategoria] = useState<Categoria | "">("");
  const [inviteLink, setInviteLink] = useState("");
  const [estado, setEstado] = useState<Estado | "">("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const p = await params;
      setId(p.id);
      const res = await fetch(`/api/contas/${p.id}`);
      if (!res.ok) return;
      const c: Conta = await res.json();
      setProfileName(c.profileName ?? "");
      setAmountPaid(c.amountPaid != null ? String(c.amountPaid) : "");
      setBmNames((c.bms ?? []).map((b) => b.name));
      setDate(c.processDate ? new Date(c.processDate).toISOString().slice(0, 10) : "");
      setTemplateApproved(c.templateApproved == null ? "" : c.templateApproved ? "SIM" : "NAO");
      setReposicao(c.reposicao == null ? "" : c.reposicao ? "SIM" : "NAO");
      setCategoria(c.categoria ?? "");
      setInviteLink(c.inviteLink ?? "");
      setEstado(c.estado ?? "");
      setLoading(false);
    })();
  }, [params, id]);

  const onChangeQtdBms = (v: number) => {
    setBmNames((prev) => {
      const next = [...prev];
      if (v > next.length) {
        while (next.length < v) next.push("");
      } else {
        next.length = v;
      }
      return next;
    });
  };

  type UpdateBody = {
    profileName: string | null;
    amountPaid: number | null;
    processDate: string | null;
    templateApproved: boolean | null;
    reposicao: boolean | null;
    categoria: Categoria | null | "";
    inviteLink: string | null;
    bms: Array<{ name: string }>;
    estado: Estado | null | "";
  };

  const submit = async () => {
    const body: any = {
      profileName: profileName || null,
      amountPaid: amountPaid ? parseFloat(amountPaid) : null,
      processDate: date ? new Date(date).toISOString() : null,
      templateApproved: templateApproved === "SIM" ? true : templateApproved === "NAO" ? false : null,
      reposicao: reposicao === "SIM" ? true : reposicao === "NAO" ? false : null,
      categoria: categoria || null,
      inviteLink: inviteLink || null,
      bms: bmNames.filter((n) => n.trim().length > 0).map((name) => ({ name })),
      estado: estado || null,
    };
    const res = await fetch(`/api/contas/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) router.push("/dashboard/contas");
  };

  if (loading) return <div className="min-h-screen bg-black text-white p-6">Carregando...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Editar Conta</h1>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm mb-1">Nome do perfil</label>
            <input value={profileName} onChange={(e)=>setProfileName(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
          </div>
          <div>
            <label className="block text-sm mb-1">Valor Pago</label>
            <input type="number" step="0.01" value={amountPaid} onChange={(e)=>setAmountPaid(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
          </div>
          <div>
            <label className="block text-sm mb-1">Quantas BMS</label>
            <input type="number" min={0} value={bmNames.length} onChange={(e)=>onChangeQtdBms(parseInt(e.target.value || "0"))} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
            {bmNames.map((name, i) => (
              <div key={i} className="mt-2">
                <label className="block text-xs mb-1">Nome da BM {i+1}</label>
                <input value={name} onChange={(e)=>setBmNames((prev)=>{ const next=[...prev]; next[i]=e.target.value; return next; })} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm mb-1">Data</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
          </div>
          <div>
            <label className="block text-sm mb-1">Template aprovado</label>
            <select value={templateApproved} onChange={(e)=>setTemplateApproved(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2">
              <option value="">Sem resposta</option>
              <option value="SIM">SIM</option>
              <option value="NAO">NÃO</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Reposição</label>
            <select value={reposicao} onChange={(e)=>setReposicao(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2">
              <option value="">Sem resposta</option>
              <option value="SIM">SIM</option>
              <option value="NAO">NÃO</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Categoria</label>
            <select value={categoria} onChange={(e)=>setCategoria(e.target.value as Categoria)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2">
              <option value="">Sem resposta</option>
              <option value="C250">250</option>
              <option value="C1K">1k</option>
              <option value="C10K">10k</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Estado</label>
            <select value={estado} onChange={(e)=>setEstado(e.target.value as Estado)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2">
              <option value="">Sem resposta</option>
              <option value="ATIVA">Ativa</option>
              <option value="CAIDA">Caída</option>
              <option value="RESTABELECENDO">Restabelecendo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Link de convite</label>
            <input value={inviteLink} onChange={(e)=>setInviteLink(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
          </div>
          <div className="flex justify-end">
            <button onClick={submit} className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-neutral-200">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}


