"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, X, Loader2, Camera, FileText, Tag, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

interface Category {
  id: string;
  namePt: string;
  slug: string;
}

const NO_CONDITION_SLUGS = ["servicos", "aulas"];

function SectionTitle({ step, icon: Icon, title }: { step: number; icon: typeof Camera; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-6 h-6 rounded-full bg-[var(--zuno-navy)] text-white text-xs font-bold flex items-center justify-center shrink-0">
        {step}
      </span>
      <Icon size={16} className="text-[var(--zuno-navy)]" />
      <h2 className="text-sm font-bold text-[var(--zuno-navy-dark)]">{title}</h2>
    </div>
  );
}

export default function VenderPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState<"NEW" | "USED">("USED");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId]
  );
  const showCondition = !selectedCategory || !NO_CONDITION_SLUGS.includes(selectedCategory.slug);

  useEffect(() => {
    if (!loading && !user) router.push("/entrar");
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files).slice(0, 6 - images.length)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Erro ao enviar imagem.");
          continue;
        }
        setImages((prev) => [...prev, data.url]);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !description || !price || !categoryId || !city) {
      setError("Preenche todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price,
          categoryId,
          city,
          condition: showCondition ? condition : "NEW",
          images,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao publicar anúncio.");
        return;
      }
      router.push(`/anuncio/${data.listing.id}`);
    } catch {
      setError("Erro de rede. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">A carregar...</div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_320px] gap-6 items-start"
        >
          <div>
          <h1 className="text-2xl font-bold text-[var(--zuno-navy-dark)] mb-1">Publicar anúncio</h1>
          <p className="text-sm text-gray-500 mb-6">
            O teu anúncio fica ativo durante 30 dias — depois disso podes republicá-lo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Secção 1: Fotos */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
              <SectionTitle step={1} icon={Camera} title="Fotos" />
              <p className="text-xs text-gray-400 mb-3">A primeira foto é a capa do anúncio. Até 6 fotos.</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((url, i) => (
                  <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-[var(--zuno-navy)] text-white px-1.5 py-0.5 rounded">
                        Capa
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[var(--zuno-navy)] transition-colors text-gray-400">
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                    <span className="text-[10px]">Adicionar</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Secção 2: Detalhes */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-4">
              <SectionTitle step={2} icon={FileText} title="Detalhes" />

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">Título</label>
                  <span className="text-[10px] text-gray-300">{title.length}/80</span>
                </div>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                  placeholder="Ex: iPhone 13 Pro 256GB"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">Descrição</label>
                  <span className="text-[10px] text-gray-300">{description.length}/1000</span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)] resize-none"
                  placeholder="Descreve o estado, detalhes, motivo de venda..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Categoria</label>
                <div className="relative mt-1">
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)] bg-white"
                  >
                    <option value="">Escolhe...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.namePt}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {showCondition && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Estado</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCondition("NEW")}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                        condition === "NEW"
                          ? "bg-[var(--zuno-navy)] text-white border-[var(--zuno-navy)]"
                          : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      Novo
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition("USED")}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                        condition === "USED"
                          ? "bg-[var(--zuno-navy)] text-white border-[var(--zuno-navy)]"
                          : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      Usado
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Secção 3: Preço e localização */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-4">
              <SectionTitle step={3} icon={Tag} title="Preço e localização" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">Preço (€)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Cidade</label>
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                    placeholder="Ex: Lisboa"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--zuno-navy)] text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-60"
            >
              {submitting ? "A publicar..." : "Publicar anúncio"}
            </motion.button>
          </form>
          </div>

          {/* Pré-visualização ao vivo */}
          <div className="hidden lg:block sticky top-24">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Assim vai ficar
            </p>
            <div className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                {images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Camera size={28} />
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <p className="font-semibold text-sm text-[var(--zuno-navy-dark)] truncate">
                  {title || "O título do teu anúncio"}
                </p>
                <p className="text-base font-bold mt-1 text-[var(--zuno-navy)]">
                  €{price ? Number(price).toFixed(2) : "0.00"}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                  <MapPin size={12} />
                  {city || "Cidade"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
