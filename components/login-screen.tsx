"use client"

import { useState } from "react"
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronRight, Brain, Sparkles, Shield } from "lucide-react"

const onboardingSlides = [
  {
    icon: Brain,
    color: "#00D4FF",
    title: "Ative seu potencial cognitivo",
    description: "O NEURON combina neurociencia, biohacking e IA para otimizar sua performance mental e fisica.",
  },
  {
    icon: Sparkles,
    color: "#F59E0B",
    title: "IA que entende voce",
    description: "Brain Dump, Scanner de rotulos e protocolos personalizados que evoluem com os seus dados.",
  },
  {
    icon: Shield,
    color: "#34D399",
    title: "Tudo em um so lugar",
    description: "Playlists neurais, meditacoes, academia de videos, timer de jejum e arsenal de suplementos.",
  },
]

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [step, setStep] = useState<"onboarding" | "login">("onboarding")
  const [slideIndex, setSlideIndex] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (step === "onboarding") {
    const slide = onboardingSlides[slideIndex]
    const Icon = slide.icon
    const isLast = slideIndex === onboardingSlides.length - 1

    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-between px-6 py-12 max-w-md mx-auto relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] opacity-[0.06] rounded-full"
          style={{ background: `radial-gradient(circle, ${slide.color} 0%, transparent 70%)` }}
          aria-hidden="true"
        />

        {/* Skip */}
        <div className="w-full flex justify-end">
          <button
            onClick={() => setStep("login")}
            className="text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-lg hover:text-foreground transition-colors"
          >
            Pular
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div
            className="flex items-center justify-center w-24 h-24 rounded-3xl mb-8 animate-neon-pulse"
            style={{ background: `${slide.color}12`, border: `1px solid ${slide.color}30` }}
          >
            <Icon className="w-12 h-12" style={{ color: slide.color }} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3 text-balance">{slide.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs text-pretty">{slide.description}</p>
        </div>

        {/* Dots + Next */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            {onboardingSlides.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === slideIndex ? 24 : 8,
                  background: i === slideIndex ? slide.color : "var(--border)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => {
              if (isLast) {
                onLogin()
              } else {
                setSlideIndex(slideIndex + 1)
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: slide.color, color: "#07070D" }}
          >
            {isLast ? "Comecar" : "Proximo"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // ── LOGIN SCREEN ──
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center px-6 pt-16 pb-8 max-w-md mx-auto relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.04] rounded-full"
        style={{ background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Logo */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 neon-glow mb-6">
        <Zap className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-1">NEURON</h1>
      <p className="text-sm text-muted-foreground mb-10">Ative seu potencial cognitivo</p>

      {/* Form */}
      <div className="w-full space-y-3 mb-6">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="w-full bg-secondary/60 border border-border/60 rounded-xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full bg-secondary/60 border border-border/60 rounded-xl pl-11 pr-11 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm neon-glow transition-all active:scale-[0.98] mb-4"
      >
        Entrar
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full mb-4">
        <div className="flex-1 h-px bg-border/50" />
        <span className="text-[10px] text-muted-foreground font-medium">ou continue com</span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Social buttons */}
      <div className="flex gap-3 w-full mb-8">
        <button
          onClick={onLogin}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border/50 bg-secondary/40 text-sm text-foreground font-medium transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button
          onClick={onLogin}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border/50 bg-secondary/40 text-sm text-foreground font-medium transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4 fill-foreground" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground/60 text-center">
        Ao entrar, voce concorda com os Termos de Uso e Politica de Privacidade.
      </p>
    </div>
  )
}
