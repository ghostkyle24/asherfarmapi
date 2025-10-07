"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    if (res && typeof res === "object" && "error" in res && res.error) setError("Credenciais inválidas");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_400px_at_85%_-10%,rgba(139,92,246,0.18),transparent_60%)]" />
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 glass p-6 rounded-xl">
        <h1 className="text-2xl font-semibold text-gradient">Acesso</h1>
        <div className="space-y-2">
          <label className="block text-sm">Usuário</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"/>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Senha</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600"/>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} type="submit" className="w-full bg-white text-black rounded px-3 py-2 font-medium hover:bg-neutral-200 disabled:opacity-50">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}


