"use client"

import { Crown, X, Sparkles, Brain, Scan, Video, Zap, Timer } from "lucide-react"
import { useState, useEffect } from "react"

interface ProModalProps {
  open: boolean
  onClose: () => void
}

const features = [
  { icon: <Sparkles className="w-4 h-4" />, label: "Brain Dump com IA avancada" },
  { icon: <Brain className="w-4 h-4" />, label: "Checklist e Protocolo de Elite" },
  { icon: <Scan className="w-4 h-4" />, label: "Analise Bio-Individual de rotulos" },
  { icon: <Video className="w-4 h-4" />, label: "Todos os videos da Academy" },
  { icon: <Zap className="w-4 h-4" />, label: "Insights personalizados com IA" },
]

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ d: 8, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const STORAGE_KEY = "neural-pro-countdown-end"
    let endTime: number

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      endTime = parseInt(stored, 10)
    } else {
      endTime = Date.now() + 8 * 24 * 60 * 60 * 1000
      localStorage.setItem(STORAGE_KEY, endTime.toString())
    }

    function update() {
      const diff = Math.max(0, endTime - Date.now())
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ d, h, m, s })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center gap-1.5 mb-5">
      <Timer className="w-3.5 h-3.5 text-[#F59E0B]" />
      <span className="text-xs text-[#F59E0B] font-medium">Oferta expira em</span>
      <div className="flex items-center gap-1">
        {[
          { value: timeLeft.d, label: "d" },
          { value: timeLeft.h, label: "h" },
          { value: timeLeft.m, label: "m" },
          { value: timeLeft.s, label: "s" },
        ].map((unit) => (
          <div key={unit.label} className="flex items-center">
            <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[11px] font-bold font-mono px-1.5 py-0.5 rounded">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-[#F59E0B]/60 ml-0.5">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProModal({ open, onClose }: ProModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-3xl border border-[#F59E0B]/20 bg-card overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Glow effect */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] opacity-[0.08] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-secondary/80 text-muted-foreground z-10"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative px-6 pt-8 pb-6">
          {/* Crown badge */}
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F97316]/20 border border-[#F59E0B]/30 mx-auto mb-4">
            <Crown className="w-8 h-8 text-[#F59E0B]" />
          </div>

          <h2 className="text-xl font-bold text-foreground text-center mb-1">
            Desbloqueie o NEURON PRO
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-5">
            Acesse todas as ferramentas do NEURON
          </p>

          {/* Features list */}
          <div className="space-y-2.5 mb-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm text-foreground font-medium">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Pricing - Anchoring */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground/60 line-through">R$ 29,90</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
                -67%
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm text-muted-foreground">por apenas</span>
              <span className="text-3xl font-bold text-foreground">R$ 9,90</span>
              <span className="text-sm text-muted-foreground">/mes</span>
            </div>
            <p className="text-[11px] text-[#34D399] font-medium mt-1.5">
              Oferta de Lancamento
            </p>
          </div>

          {/* Countdown */}
          <CountdownTimer />

          {/* CTA - Link para checkout */}
          <a
            href="#"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#07070D] font-bold text-sm transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(245,158,11,0.35)]"
          >
            <Crown className="w-4 h-4" />
            Assinar NEURON PRO
          </a>

          <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
            Pagamento seguro. Cancele quando quiser.
          </p>
        </div>
      </div>
    </div>
  )
}
