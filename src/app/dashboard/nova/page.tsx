"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Categoria = "C250" | "C1K" | "C10K";

export default function NovaContaPage() {
  const [profileName, setProfileName] = useState("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [qtdBms, setQtdBms] = useState<number>(0);
  const [bmNames, setBmNames] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [templateApproved, setTemplateApproved] = useState<string>("");
  const [reposicao, setReposicao] = useState<string>("");
  const [categoria, setCategoria] = useState<Categoria | "">("");
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChangeQtdBms = (v: number) => {
    setQtdBms(v);
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

  const submit = async () => {
    setLoading(true);
    const body: any = {
      profileName: profileName || null,
      amountPaid: amountPaid ? parseFloat(amountPaid) : null,
      processDate: date ? new Date(date).toISOString() : null,
      templateApproved: templateApproved === "SIM" ? true : templateApproved === "NAO" ? false : null,
      reposicao: reposicao === "SIM" ? true : reposicao === "NAO" ? false : null,
      categoria: categoria || null,
      inviteLink: inviteLink || null,
      bms: bmNames.filter((n) => n.trim().length > 0).map((name) => ({ name })),
    };
    const res = await fetch("/api/contas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) router.push("/dashboard/contas");
    setLoading(false);
  };

  return (
    <div className="">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-neutral-400 hover:text-white inline-flex items-center gap-2">
            <span className="inline-block rotate-180">➜</span>
            <span>Voltar</span>
          </a>
        </div>
        <h1 className="text-2xl font-semibold">Nova Conta</h1>
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
            <input type="number" min={0} value={qtdBms} onChange={(e)=>onChangeQtdBms(parseInt(e.target.value || "0"))} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
            {Array.from({ length: qtdBms }).map((_, i) => (
              <div key={i} className="mt-2">
                <label className="block text-xs mb-1">Nome da BM {i+1}</label>
                <input value={bmNames[i] ?? ""} onChange={(e)=>setBmNames((prev)=>{ const next=[...prev]; next[i]=e.target.value; return next; })} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
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
            <label className="block text-sm mb-1">Link de convite</label>
            <input value={inviteLink} onChange={(e)=>setInviteLink(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2"/>
          </div>
          <div className="flex justify-end">
            <button onClick={submit} disabled={loading} className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-neutral-200 disabled:opacity-50">
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


