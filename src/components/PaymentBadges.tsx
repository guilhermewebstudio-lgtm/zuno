import { CreditCard, Smartphone, Wallet } from "lucide-react";

const methods = [
  { label: "Visa", icon: CreditCard },
  { label: "Mastercard", icon: CreditCard },
  { label: "MB WAY", icon: Smartphone },
  { label: "PayPal", icon: Wallet },
];

export default function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {methods.map((m) => (
        <span
          key={m.label}
          className="flex items-center gap-1.5 bg-white/10 text-white/70 text-xs font-medium px-3 py-1.5 rounded-lg"
        >
          <m.icon size={14} />
          {m.label}
        </span>
      ))}
    </div>
  );
}
