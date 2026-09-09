import { BadgeCheck } from "lucide-react";

export default function VerifiedBadgeMini({ className = "" }: { className?: string }) {
  return (
    <span
      title="Vendedor verificado"
      className={`inline-flex items-center gap-0.5 text-[var(--zuno-navy)] bg-[var(--zuno-navy)]/10 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${className}`}
    >
      <BadgeCheck size={10} /> Verificado
    </span>
  );
}
