"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ProModal } from "@/components/pro-modal"
import {
  ShoppingBag,
  ExternalLink,
  Star,
  Tag,
  Download,
  BookOpen,
  GraduationCap,
  ListChecks,
  Package,
  AlertTriangle,
  RefreshCw,
  Crown,
  Clock,
} from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  image: string
  rating: number
  reviews: number
  badge?: string
  badgeColor?: string
  buyUrl: string
  stock?: number
}

interface DigitalProduct {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  badge?: string
  badgeColor?: string
  icon: React.ReactNode
  iconBg: string
  buyUrl: string
}

interface EquipmentProduct {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  image: string
  badge?: string
  badgeColor?: string
  buyUrl: string
  stock?: number
}

/**
 * Stub para verificar estoque - integrar com API real futuramente
 */
function checkStock(stock?: number): { isLow: boolean; label: string } {
  if (stock === undefined) return { isLow: false, label: "" }
  if (stock <= 0) return { isLow: true, label: "Esgotado" }
  if (stock <= 5) return { isLow: true, label: "Estoque baixo" }
  return { isLow: false, label: "" }
}

const products: Product[] = [
  {
    id: "kit-foco",
    name: "Kit Foco Total",
    description:
      "Conjunto completo com nootropicos selecionados para maximizar sua concentracao e produtividade diaria.",
    price: "R$ 197,00",
    originalPrice: "R$ 297,00",
    image: "/images/kit-foco.jpg",
    rating: 4.9,
    reviews: 128,
    badge: "Mais Vendido",
    badgeColor: "#00D4FF",
    buyUrl: "https://www.mercadolivre.com.br",
    stock: 12,
  },
  {
    id: "magnesio",
    name: "Magnesio Treonato Neural",
    description:
      "Forma premium de magnesio que atravessa a barreira hematoencefalica. Melhora sono e cognicao.",
    price: "R$ 89,90",
    image: "/images/magnesio-treonato.jpg",
    rating: 4.8,
    reviews: 95,
    badge: "Novo",
    badgeColor: "#34D399",
    buyUrl: "https://www.mercadolivre.com.br",
    stock: 3,
  },
  {
    id: "kit-sono",
    name: "Kit Sono Profundo",
    description:
      "Magnesio Treonato + L-Teanina + Ashwagandha KSM-66. O trio do sono reparador.",
    price: "R$ 149,00",
    originalPrice: "R$ 219,00",
    image: "/images/kit-sono.jpg",
    rating: 4.7,
    reviews: 67,
    badge: "-32%",
    badgeColor: "#A78BFA",
    buyUrl: "https://www.mercadolivre.com.br",
    stock: 8,
  },
]

const digitalProducts: DigitalProduct[] = [
  {
    id: "rotina-blindada",
    name: "Rotina Blindada",
    description: "Checklist de elite com protocolos avancados de alta performance matinal e noturna.",
    price: "R$ 47,00",
    originalPrice: "R$ 97,00",
    badge: "Mais Vendido",
    badgeColor: "#00D4FF",
    icon: <ListChecks className="w-5 h-5" />,
    iconBg: "#00D4FF",
    buyUrl: "https://kirvano.com/rotina-blindada",
  },
  {
    id: "metodo-neural-completo",
    name: "Metodo Neural Completo",
    description: "Curso completo com 40+ aulas sobre neurociencia aplicada a produtividade e biohacking.",
    price: "R$ 197,00",
    originalPrice: "R$ 397,00",
    badge: "-50%",
    badgeColor: "#F59E0B",
    icon: <GraduationCap className="w-5 h-5" />,
    iconBg: "#F59E0B",
    buyUrl: "https://kirvano.com/metodo-neural",
  },
  {
    id: "ebook-biohacking",
    name: "E-book Biohacking Avancado",
    description: "Guia definitivo com 50+ protocolos de biohacking para otimizar corpo e mente. PDF + audiobook.",
    price: "R$ 37,00",
    originalPrice: "R$ 77,00",
    badge: "-52%",
    badgeColor: "#34D399",
    icon: <BookOpen className="w-5 h-5" />,
    iconBg: "#34D399",
    buyUrl: "https://kirvano.com/ebook-biohacking",
  },
]

const equipmentProducts: EquipmentProduct[] = [
  {
    id: "caneca-neural",
    name: "Caneca Metodo Neural",
    description: "Caneca de ceramica 350ml com logo Metodo Neural. Design minimalista preto fosco.",
    price: "R$ 59,90",
    image: "/images/kit-foco.jpg",
    badge: "Drop",
    badgeColor: "#00D4FF",
    buyUrl: "https://www.mercadolivre.com.br",
    stock: 15,
  },
  {
    id: "ecobag-neural",
    name: "EcoBag Biohacker",
    description: "Sacola ecologica 100% algodao organico com estampa exclusiva do Metodo Neural.",
    price: "R$ 39,90",
    image: "/images/kit-sono.jpg",
    badge: "Drop",
    badgeColor: "#00D4FF",
    buyUrl: "https://www.mercadolivre.com.br",
    stock: 10,
  },
  {
    id: "camiseta-neural",
    name: "Camiseta Metodo Neural",
    description: "Camiseta premium 100% algodao pima. Estampa frontal minimalista com logo neon.",
    price: "R$ 79,90",
    originalPrice: "R$ 119,90",
    image: "/images/magnesio-treonato.jpg",
    badge: "Drop",
    badgeColor: "#00D4FF",
    buyUrl: "https://www.mercadolivre.com.br",
    stock: 8,
  },
]

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="w-3 h-3"
            fill={i < Math.round(rating) ? "#F59E0B" : "transparent"}
            stroke={i < Math.round(rating) ? "#F59E0B" : "currentColor"}
            strokeWidth={1.5}
            style={{ color: i < Math.round(rating) ? "#F59E0B" : "var(--muted-foreground)" }}
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">
        {rating} ({reviews})
      </span>
    </div>
  )
}

function StockBadge({ stock }: { stock?: number }) {
  const { isLow, label } = checkStock(stock)
  if (!isLow) return null
  return (
    <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-destructive/15 text-destructive">
      <AlertTriangle className="w-2.5 h-2.5" />
      {label}
    </span>
  )
}

interface ArsenalProps {
  initialTab?: "kits" | "digital" | "drop"
}

export function Arsenal({ initialTab = "kits" }: ArsenalProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"kits" | "digital" | "drop">(initialTab)
  const [proModalOpen, setProModalOpen] = useState(false)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  return (
    <section className="px-5 pt-2 pb-32 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <ShoppingBag className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            Arsenal Neural
          </h2>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4 ml-[42px]">
        Produtos selecionados para potencializar seu metodo.
      </p>



      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab("kits")}
          className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "kits"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-secondary/50 text-muted-foreground border border-border/30"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Kits Biohacker
        </button>
        <button
          onClick={() => setActiveTab("digital")}
          className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "digital"
              ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
              : "bg-secondary/50 text-muted-foreground border border-border/30"
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          Produtos Digitais
        </button>
        <button
          onClick={() => setActiveTab("drop")}
          className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "drop"
              ? "bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30"
              : "bg-secondary/50 text-muted-foreground border border-border/30"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Drop
        </button>
      </div>

      {/* Physical Products (Kits) */}
      {activeTab === "kits" && (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="relative rounded-2xl border border-border/50 bg-card/80 overflow-hidden transition-all duration-300"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {product.badge && (
                <div
                  className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                  style={{
                    background: `${product.badgeColor}20`,
                    color: product.badgeColor,
                  }}
                >
                  <Tag className="w-2.5 h-2.5" />
                  {product.badge}
                </div>
              )}

              <div className="relative w-full h-44 bg-secondary/40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 430px) 100vw, 430px"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/90 to-transparent" />
              </div>

              <div className="p-4 pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground flex-1">
                    {product.name}
                  </h3>
                  <StockBadge stock={product.stock} />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                  {product.description}
                </p>

                <StarRating rating={product.rating} reviews={product.reviews} />

                <div className="flex items-end justify-between mt-3">
                  <div className="flex flex-col">
                    {product.originalPrice && (
                      <span className="text-[10px] text-muted-foreground/60 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="text-base font-bold text-foreground">
                      {product.price}
                    </span>
                  </div>

                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.97] bg-primary text-primary-foreground neon-glow ${
                      hoveredId === product.id ? "shadow-[0_0_25px_rgba(0,212,255,0.5)]" : ""
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Comprar
                  </a>
                </div>
              </div>
            </article>
          ))}

        </div>
      )}

      {/* Digital Products (Kirvano) */}
      {activeTab === "digital" && (
        <div className="flex flex-col gap-3">
          {digitalProducts.map((product) => (
            <article
              key={product.id}
              className="relative rounded-2xl border border-border/50 bg-card/80 overflow-hidden transition-all duration-300"
            >
              <div className="p-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                    style={{
                      background: `${product.iconBg}15`,
                      color: product.iconBg,
                    }}
                  >
                    {product.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground truncate flex-1">
                        {product.name}
                      </h3>
                      {product.badge && (
                        <span
                          className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: `${product.badgeColor}15`,
                            color: product.badgeColor,
                          }}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#A78BFA]/15 text-[#A78BFA] mb-2">
                      <Download className="w-2.5 h-2.5" />
                      Digital
                    </span>

                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        {product.originalPrice && (
                          <span className="text-[10px] text-muted-foreground/60 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                        <span className="text-base font-bold text-foreground">
                          {product.price}
                        </span>
                      </div>

                      <a
                        href={product.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.97] bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#07070D] shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Comprar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Equipment Products */}
      {activeTab === "drop" && (
        <div className="flex flex-col gap-4">
          {equipmentProducts.map((product) => (
            <article
              key={product.id}
              className="relative rounded-2xl border border-border/50 bg-card/80 overflow-hidden transition-all duration-300"
            >
              {product.badge && (
                <div
                  className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
                  style={{
                    background: `${product.badgeColor}20`,
                    color: product.badgeColor,
                  }}
                >
                  <Tag className="w-2.5 h-2.5" />
                  {product.badge}
                </div>
              )}

              <div className="relative w-full h-40 bg-secondary/40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 430px) 100vw, 430px"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/90 to-transparent" />
              </div>

              <div className="p-4 pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground flex-1">
                    {product.name}
                  </h3>
                  <StockBadge stock={product.stock} />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                  {product.description}
                </p>

                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    {product.originalPrice && (
                      <span className="text-[10px] text-muted-foreground/60 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="text-base font-bold text-foreground">
                      {product.price}
                    </span>
                  </div>

                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.97] bg-[#34D399] text-[#07070D] shadow-[0_0_15px_rgba(52,211,153,0.25)]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Comprar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </section>
  )
}
