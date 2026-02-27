"use client"

import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Crown, ShoppingBag, Zap, ChevronRight } from "lucide-react"

interface Banner {
  id: string
  title: string
  subtitle: string
  cta: string
  action: "pro" | "lojinha" | "external"
  url?: string
  accentColor: string
  icon: React.ReactNode
}

const banners: Banner[] = [
  {
    id: "b1",
    title: "Rotina Blindada",
    subtitle: "Seu checklist de elite para alta performance.",
    cta: "Conhecer Agora",
    action: "external",
    accentColor: "#00D4FF",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: "b2",
    title: "NEURON PRO",
    subtitle: "67% OFF - Desbloqueie todas as ferramentas.",
    cta: "Assinar PRO",
    action: "pro",
    accentColor: "#F59E0B",
    icon: <Crown className="w-6 h-6" />,
  },
  {
    id: "b3",
    title: "Kits Biohacker",
    subtitle: "Suplementos selecionados com frete gratis.",
    cta: "Ver Kits",
    action: "lojinha",
    accentColor: "#34D399",
    icon: <ShoppingBag className="w-6 h-6" />,
  } as Banner,
]

interface PromoBannerProps {
  onOpenPro: () => void
  onNavigateToTab: (tab: string) => void
}

export function PromoBanner({ onOpenPro, onNavigateToTab }: PromoBannerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" })
  const [activeIndex, setActiveIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-rotate every 5s
  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [emblaApi])

  const handleBannerClick = (banner: Banner) => {
    if (banner.action === "pro") {
      onOpenPro()
    } else if (banner.id === "b3") {
      // Kits Biohacker -> aba kits do Arsenal
      onNavigateToTab("arsenal:kits")
    } else if (banner.id === "b1") {
      // Rotina Blindada -> aba digital do Arsenal
      onNavigateToTab("arsenal:digital")
    } else {
      onNavigateToTab("arsenal")
    }
  }

  return (
    <section className="px-5 mt-5">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0 px-0.5">
              <button
                onClick={() => handleBannerClick(banner)}
                className="w-full relative overflow-hidden rounded-2xl border p-5 text-left transition-all active:scale-[0.99]"
                style={{
                  borderColor: `${banner.accentColor}20`,
                  background: `linear-gradient(135deg, ${banner.accentColor}08 0%, ${banner.accentColor}03 100%)`,
                }}
              >
                {/* Glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-[0.06] pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${banner.accentColor} 0%, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />

                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                    style={{
                      background: `${banner.accentColor}15`,
                      color: banner.accentColor,
                    }}
                  >
                    {banner.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground mb-0.5">
                      {banner.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {banner.subtitle}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold"
                    style={{
                      background: `${banner.accentColor}15`,
                      color: banner.accentColor,
                    }}
                  >
                    {banner.cta}
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-5 h-1.5 bg-primary"
                : "w-1.5 h-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
