"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Tag, Lock, MessageCircle, Star, Send } from "lucide-react";
import VerifiedBadgeMini from "@/components/VerifiedBadgeMini";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: string;
  city: string;
  condition: string;
  isFeatured: boolean;
  status: string;
  images: { url: string }[];
  category: { namePt: string };
  user: { id: string; name: string; city: string | null; isVerified: boolean };
}

interface CommentRow {
  id: string;
  body: string;
  createdAt: string;
  user: { name: string; isVerified: boolean };
}

function StarRating({
  value,
  onChange,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={n <= value ? "text-[var(--zuno-gold)]" : "text-gray-200"}
            fill={n <= value ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}

export default function AnuncioPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [sellerRating, setSellerRating] = useState<number | null>(null);
  const [sellerRatingCount, setSellerRatingCount] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [newComment, setNewComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  const [myRating, setMyRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [sendingRating, setSendingRating] = useState(false);
  const [ratingSaved, setRatingSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setListing(d.listing);
        setSellerRating(d.sellerRating);
        setSellerRatingCount(d.sellerRatingCount || 0);
      })
      .finally(() => setLoading(false));

    fetch(`/api/listings/${id}/comments`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments || []));
  }, [id]);

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSendingComment(true);
    try {
      const res = await fetch(`/api/listings/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
      }
    } finally {
      setSendingComment(false);
    }
  }

  async function submitRating(e: React.FormEvent) {
    e.preventDefault();
    if (myRating === 0) return;
    setSendingRating(true);
    try {
      const res = await fetch(`/api/listings/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: myRating, comment: ratingComment }),
      });
      if (res.ok) {
        setRatingSaved(true);
        const refreshed = await fetch(`/api/listings/${id}`).then((r) => r.json());
        setSellerRating(refreshed.sellerRating);
        setSellerRatingCount(refreshed.sellerRatingCount || 0);
      }
    } finally {
      setSendingRating(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center text-gray-400">A carregar...</div>
        <Footer />
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Anúncio não encontrado.</div>
        <Footer />
      </>
    );
  }

  const isOwner = user?.id === listing.user.id;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative">
              {listing.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.images[activeImage].url} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">Sem foto</div>
              )}
              {listing.isFeatured && (
                <span className="absolute top-3 left-3 flex items-center gap-1 bg-[var(--zuno-gold)] text-white text-xs font-bold px-3 py-1 rounded-full">
                  <Star size={12} /> Destaque
                </span>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {listing.images.map((img, i) => (
                  <button
                    key={img.url}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      i === activeImage ? "border-[var(--zuno-navy)]" : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--zuno-navy)] bg-[var(--zuno-navy)]/10 px-3 py-1 rounded-full">
              <Tag size={12} /> {listing.category.namePt}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)] mt-3">
              {listing.title}
            </h1>
            <p className="text-3xl font-extrabold text-[var(--zuno-navy)] mt-2">
              €{Number(listing.price).toFixed(2)}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-400 mt-2">
              <MapPin size={14} /> {listing.city}
              <span className="mx-1">·</span>
              {listing.condition === "NEW" ? "Novo" : "Usado"}
            </div>

            <p className="text-sm text-gray-600 mt-6 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-400 mb-2">Vendido por</p>
              <p className="font-semibold text-[var(--zuno-navy-dark)] flex items-center gap-1.5 flex-wrap">
                {listing.user.name}
                {listing.user.isVerified && (
                  <span className="flex items-center gap-1 text-[var(--zuno-navy)] text-xs font-semibold">
                    <VerifiedBadgeMini /> Verificado
                  </span>
                )}
              </p>
              {sellerRating !== null && sellerRatingCount > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <StarRating value={Math.round(sellerRating)} size={14} />
                  <span className="text-xs text-gray-400">
                    {sellerRating.toFixed(1)} ({sellerRatingCount} avaliaç{sellerRatingCount === 1 ? "ão" : "ões"})
                  </span>
                </div>
              )}
            </div>

            {user ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--zuno-navy)] text-white font-semibold py-3.5 rounded-xl text-sm"
              >
                <MessageCircle size={18} />
                Contactar vendedor
              </motion.button>
            ) : (
              <Link href="/entrar">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--zuno-green)] text-white font-semibold py-3.5 rounded-xl text-sm cursor-pointer"
                >
                  <Lock size={16} />
                  Entra para contactar o vendedor
                </motion.div>
              </Link>
            )}
          </motion.div>
        </div>

        {/* Classificação */}
        {user && !isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-white rounded-2xl border border-black/5 shadow-sm p-6 max-w-xl"
          >
            <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-3">Classifica este anúncio</h3>
            <form onSubmit={submitRating} className="space-y-3">
              <StarRating value={myRating} onChange={setMyRating} />
              <textarea
                rows={2}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Comentário opcional sobre a tua experiência..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)] resize-none"
              />
              <button
                type="submit"
                disabled={myRating === 0 || sendingRating}
                className="bg-[var(--zuno-navy)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-50"
              >
                {sendingRating ? "A enviar..." : ratingSaved ? "Classificação atualizada!" : "Enviar classificação"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Comentários */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 max-w-xl"
        >
          <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-4">
            Comentários {comments.length > 0 && `(${comments.length})`}
          </h3>

          <div className="space-y-3 mb-4">
            {comments.length === 0 && (
              <p className="text-sm text-gray-400">Ainda não há comentários. Sê o primeiro a perguntar algo.</p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-semibold text-sm text-[var(--zuno-navy-dark)]">{c.user.name}</span>
                  {c.user.isVerified && <VerifiedBadgeMini />}
                  <span className="text-xs text-gray-300">
                    · {new Date(c.createdAt).toLocaleDateString("pt-PT")}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{c.body}</p>
              </div>
            ))}
          </div>

          {user ? (
            <form onSubmit={submitComment} className="flex items-center gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
                placeholder="Escreve um comentário..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
              />
              <button
                type="submit"
                disabled={sendingComment || !newComment.trim()}
                className="w-10 h-10 rounded-full bg-[var(--zuno-navy)] text-white flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </form>
          ) : (
            <Link href="/entrar" className="text-sm text-[var(--zuno-navy)] font-semibold">
              Entra para comentares
            </Link>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
