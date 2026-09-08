"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function FavoriteButton({
  listingId,
  initialFavorited = false,
  className = "",
}: {
  listingId: string;
  initialFavorited?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/entrar");
      return;
    }
    if (busy) return;

    setBusy(true);
    setFavorited((prev) => !prev);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      setFavorited(data.favorited);
    } catch {
      setFavorited((prev) => !prev);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      className={`bg-white/90 backdrop-blur p-1.5 rounded-full hover:bg-white transition-colors ${className}`}
    >
      <Heart
        size={15}
        className={favorited ? "text-red-500" : "text-gray-500"}
        fill={favorited ? "currentColor" : "none"}
      />
    </button>
  );
}
