import { BadgeCheck } from "lucide-react";

export default function VerifiedBadgeMini({ className = "" }: { className?: string }) {
  return (
    <span
      title="Vendedor verificado"
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--zuno-navy)] shrink-0 ${className}`}
    >
      <BadgeCheck size={11} className="text-white" fill="var(--zuno-navy)" strokeWidth={2.5} />
    </span>
  );
}
