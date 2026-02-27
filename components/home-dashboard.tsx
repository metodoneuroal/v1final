"use client"

import { useState, useEffect } from "react"
import {
  Sunrise,
  GraduationCap,
  Activity,
  ShoppingBag,
  ChevronRight,
  Brain,
  Moon,
  Zap,
  Heart,
  Trophy,
  Flame,
  Shield,
  Target,
} from "lucide-react"

interface DashboardCard {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  accentColor: string
  tab: string
}

const dashboardCards: DashboardCard[] = [
  {
    id: "ativacao",
    title: "Ativacao Matinal",
    subtitle: "Complete sua rotina de hoje",
    icon: <Sunrise className="w-4 h-4" />,
    accentColor: "#FF8C42",
    tab: "activation",
  },
  {
    id: "academy",
    title: "Neural Academy",
    subtitle: "Aulas, artigos e meditacoes",
    icon: <GraduationCap className="w-4 h-4" />,
    accentColor: "#00D4FF",
    tab: "academy",
  },
  {
    id: "tracker",
    title: "Biohacker Tracker",
    subtitle: "Wiki + Scanner de rotulos",
    icon: <Activity className="w-4 h-4" />,
    accentColor: "#34D399",
    tab: "tracker",
  },
  {
    id: "arsenal",
    title: "Arsenal Neural",
    subtitle: "Kits, digitais e drop",
    icon: <ShoppingBag className="w-4 h-4" />,
    accentColor: "#F59E0B",
    tab: "arsenal",
  },
]

interface HomeDashboardProps {
  onNavigateToTab: (tab: string) => void
}

// ── Biometria Data ──
const biometrics = [
  { label: "Foco", value: 78, color: "#00D4FF", icon: Brain },
  { label: "Sono", value: 65, color: "#A78BFA", icon: Moon },
  { label: "Energia", value: 82, color: "#F59E0B", icon: Zap },
  { label: "Stress", value: 40, color: "#34D399", icon: Heart },
]

// ── Badges Data ──
const allBadges = [
  { id: "streak3", name: "3 dias seguidos", icon: Flame, color: "#F59E0B", unlocked: true },
  { id: "firstscan", name: "Primeiro scan", icon: Target, color: "#00D4FF", unlocked: true },
  { id: "braindump5", name: "5 brain dumps", icon: Brain, color: "#A78BFA", unlocked: true },
  { id: "streak7", name: "7 dias seguidos", icon: Flame, color: "#F97316", unlocked: false },
  { id: "fast16", name: "Jejum de 16h", icon: Shield, color: "#34D399", unlocked: false },
  { id: "master", name: "Biohacker Master", icon: Trophy, color: "#F59E0B", unlocked: false },
]

function BiometryDashboard() {
  const [metrics, setMetrics] = useState(biometrics.map(b => ({ ...b, animated: 0 })))

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMetrics(biometrics.map(b => ({ ...b, animated: b.value })))
    }, 200)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 p-4 mt-5">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground">Biometria Neural</h3>
      </div>
      <div className="flex items-end gap-3 h-28">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold font-mono" style={{ color: m.color }}>{m.animated}%</span>
              <div className="w-full bg-secondary/60 rounded-full overflow-hidden" style={{ height: 72 }}>
                <div
                  className="w-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    height: `${m.animated}%`,
                    background: `linear-gradient(to top, ${m.color}40, ${m.color})`,
                    marginTop: `${100 - m.animated}%`,
                  }}
                />
              </div>
              <Icon className="w-3 h-3" style={{ color: m.color }} />
              <span className="text-[9px] text-muted-foreground font-medium">{m.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BadgesSection() {
  const unlockedCount = allBadges.filter(b => b.unlocked).length
  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
          <h3 className="text-xs font-semibold text-foreground">Conquistas</h3>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{unlockedCount}/{allBadges.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {allBadges.map((badge) => {
          const Icon = badge.icon
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                badge.unlocked
                  ? "border-border/40 bg-secondary/30"
                  : "border-border/20 bg-secondary/10 opacity-40"
              }`}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ background: badge.unlocked ? `${badge.color}15` : undefined }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: badge.unlocked ? badge.color : "var(--muted-foreground)" }}
                />
              </div>
              <span className="text-[9px] text-center text-muted-foreground font-medium leading-tight">
                {badge.name}
              </span>
              {badge.unlocked && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: badge.color }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function HomeDashboard({ onNavigateToTab }: HomeDashboardProps) {
  return (
    <section className="px-5 mt-5">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Explorar
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        {dashboardCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigateToTab(card.tab)}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-card/60 text-left transition-all hover:border-border/60 active:scale-[0.98] group"
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
              style={{
                background: `${card.accentColor}15`,
                color: card.accentColor,
              }}
            >
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[11px] font-semibold text-foreground truncate">
                {card.title}
              </h3>
              <p className="text-[10px] text-muted-foreground truncate">
                {card.subtitle}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
          </button>
        ))}
      </div>

      {/* Dashboard de Biometria */}
      <BiometryDashboard />

      {/* Sistema de Badges */}
      <BadgesSection />
    </section>
  )
}
