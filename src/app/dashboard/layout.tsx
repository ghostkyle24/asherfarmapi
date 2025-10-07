import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-10 border-b border-neutral-900 backdrop-blur">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[rgba(139,92,246,0.15)] via-transparent to-[rgba(34,211,238,0.12)]" />
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/dashboard" className="font-semibold text-gradient">ASHER</Link>
          <nav className="flex items-center gap-3">
            <Link href="/dashboard/contas" className="text-sm text-neutral-300 hover:text-white">Contas</Link>
            <Link href="/dashboard/nova" className="text-sm text-neutral-300 hover:text-white">Nova</Link>
            <form action="/api/auth/signout" method="post">
              <Button type="submit" variant="secondary">Sair</Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}


