"use client"

import { useState } from "react"
import {
  User,
  Crown,
  Trophy,
  Flame,
  Target,
  Brain,
  Shield,
  ChevronRight,
  Heart,
  Smartphone,
  CreditCard,
  LogOut,
  Moon,
  Bell,
  Zap,
} from "lucide-react"
import { ProModal } from "@/components/pro-modal"

const allBadges = [
  { id: "streak3", name: "3 dias seguidos", icon: Flame, color: "#F59E0B", unlocked: true },
  { id: "firstscan", name: "Primeiro scan", icon: Target, color: "#00D4FF", unlocked: true },
  { id: "braindump5", name: "5 brain dumps", icon: Brain, color: "#A78BFA", unlocked: true },
  { id: "streak7", name: "7 dias seguidos", icon: Flame, color: "#F97316", unlocked: false },
  { id: "fast16", name: "Jejum de 16h", icon: Shield, color: "#34D399", unlocked: false },
  { id: "master", name: "Biohacker Master", icon: Trophy, color: "#F59E0B", unlocked: false },
]

const XP_CURRENT = 1240
const XP_NEXT_LEVEL = 2000
const LEVEL = 4

interface UserProfileProps {
  onLogout: () => void
}

export function UserProfile({ onLogout }: UserProfileProps) {
  const [proModalOpen, setProModalOpen] = useState(false)
  const unlockedCount = allBadges.filter(b => b.unlocked).length
  const xpPercent = (XP_CURRENT / XP_NEXT_LEVEL) * 100

  return (
    <section className="px-5 pt-2 pb-32">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 neon-glow">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-foreground">Biohacker</h2>
          <p className="text-xs text-muted-foreground">Membro desde Mar 2026</p>
        </div>
      </div>

      {/* Nivel de Evolucao */}
      <div className="rounded-2xl border border-border/40 bg-card/80 p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">Nivel de Evolucao</h3>
          </div>
          <span className="text-xs font-bold text-primary font-mono">Nivel {LEVEL}</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-secondary/60 mb-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${xpPercent}%`,
              background: "linear-gradient(90deg, #00D4FF, #34D399)",
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-mono">{XP_CURRENT} XP</span>
          <span className="text-[10px] text-muted-foreground font-mono">{XP_NEXT_LEVEL} XP</span>
        </div>
      </div>

      {/* Conquistas / Badges */}
      <div className="rounded-2xl border border-border/40 bg-card/80 p-4 mb-4">
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

      {/* Configuracoes */}
      <div className="rounded-2xl border border-border/40 bg-card/80 overflow-hidden mb-4">
        <h3 className="text-xs font-semibold text-foreground px-4 pt-4 pb-2">Configuracoes</h3>

        {/* Integracao com Saude */}
        <SettingRow
          icon={<Heart className="w-4 h-4 text-[#FF4D6A]" />}
          label="Apple Health"
          sublabel="Sincronizar dados de saude"
          trailing={<ToggleSwitch />}
        />
        <SettingRow
          icon={<Smartphone className="w-4 h-4 text-[#34D399]" />}
          label="Google Fit"
          sublabel="Conectar rastreamento de atividade"
          trailing={<ToggleSwitch />}
        />

        {/* Preferencias */}
        <div className="h-px bg-border/20 mx-4" />
        <SettingRow
          icon={<Moon className="w-4 h-4 text-[#A78BFA]" />}
          label="Modo Escuro"
          sublabel="Tema escuro ativado"
          trailing={<ToggleSwitch defaultOn />}
        />
        <SettingRow
          icon={<Bell className="w-4 h-4 text-[#F59E0B]" />}
          label="Notificacoes"
          sublabel="Lembretes e alertas"
          trailing={<ToggleSwitch defaultOn />}
        />
      </div>

      {/* Assinatura */}
      <div className="rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-xs font-semibold text-foreground">Assinatura</h3>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground">FREE</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
          Desbloqueie analise de IA, Brain Dump ilimitado, videos exclusivos e mais.
        </p>
        <button
          onClick={() => setProModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#07070D] text-xs font-bold transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          <Crown className="w-3.5 h-3.5" />
          Assinar NEURON PRO - R$ 9,90/mes
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-xs font-bold transition-all active:scale-[0.98]"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sair da Conta
      </button>

      <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </section>
  )
}

function SettingRow({
  icon,
  label,
  sublabel,
  trailing,
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
  trailing: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sublabel}</p>
      </div>
      {trailing}
    </div>
  )
}

function ToggleSwitch({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${
        on ? "bg-primary" : "bg-secondary"
      }`}
      style={{ width: 40, height: 22 }}
      role="switch"
      aria-checked={on}
    >
      <div
        className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-foreground transition-all shadow-sm"
        style={{ left: on ? 20 : 2 }}
      />
    </button>
  )
}
