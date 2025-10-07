import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">ASHER Dashboard</h1>
        <p className="text-neutral-300 mb-6">Acesse para gerenciar contas e processos de farm.</p>
        <Link href="/login" className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-neutral-200">Entrar</Link>
      </div>
    </div>
  );
}
