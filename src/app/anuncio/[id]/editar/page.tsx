"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, X, Loader2, Camera, FileText, Tag } from "lucide-react";
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

export default function EditarAnuncioPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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
  const [fetching, setFetching] = useState(true);

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

  useEffect(() => {
    if (!user) return;
    fetch(`/api/listings/${id}/edit-data`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.listing) {
          setError("Anúncio não encontrado ou sem permissão.");
          return;
        }
        const l = d.listing;
        setTitle(l.title);
        setDescription(l.description);
        setPrice(String(l.price));
        setCategoryId(l.categoryId);
        setCity(l.city);
        setCondition(l.condition);
        setImages(l.images.map((img: { url: string }) => img.url));
      })
      .finally(() => setFetching(false));
  }, [id, user]);

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
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
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
        setError(data.error || "Erro ao guardar alterações.");
        return;
      }
      router.push(`/anuncio/${id}`);
    } catch {
      setError("Erro de rede. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user || fetching) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">A carregar...</div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-[var(--zuno-navy-dark)] mb-1">Editar anúncio</h1>
          <p className="text-sm text-gray-500 mb-6">Atualiza os detalhes do teu anúncio.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
              <SectionTitle step={1} icon={Camera} title="Fotos" />
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

            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-4">
              <SectionTitle step={2} icon={FileText} title="Detalhes" />
              <div>
                <label className="text-xs font-medium text-gray-500">Título</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Descrição</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)] resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Categoria</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                >
                  <option value="">Escolhe...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.namePt}</option>
                  ))}
                </select>
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
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Cidade</label>
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
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
              {submitting ? "A guardar..." : "Guardar alterações"}
            </motion.button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
