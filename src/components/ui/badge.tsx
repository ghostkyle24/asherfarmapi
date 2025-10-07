import { cn } from "./utils";

type Variant = "default" | "success" | "danger" | "warning" | "violet" | "cyan" | "outline";

export function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  const base = "inline-flex items-center gap-1 rounded-full text-xs px-2.5 py-1 font-medium";
  const styles: Record<Variant, string> = {
    default: "bg-neutral-800 text-neutral-200",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    danger: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    violet: "bg-[rgba(139,92,246,0.15)] text-[var(--accent)] border border-[rgba(139,92,246,0.35)]",
    cyan: "bg-[rgba(34,211,238,0.15)] text-[var(--accent-2)] border border-[rgba(34,211,238,0.35)]",
    outline: "bg-transparent text-neutral-300 border border-neutral-700",
  };
  return <span className={cn(base, styles[variant], className)}>{children}</span>;
}


