"use client"

import { useState, useEffect } from "react"
import { Check, Lock, Crown, RotateCcw, Shield, Moon, RefreshCw } from "lucide-react"
import { ProModal } from "@/components/pro-modal"
import { Progress } from "@/components/ui/progress"

const STORAGE_KEY_PREFIX = "neural-pro-checklist-"

interface ProChecklist {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  accentColor: string
  items: { id: string; label: string }[]
}

const proChecklists: ProChecklist[] = [
  {
    id: "rotina-blindada",
    title: "Rotina Blindada",
    description: "Protocolo avancado de alta performance matinal",
    icon: <Shield className="w-4 h-4" />,
    accentColor: "#00D4FF",
    items: [
      { id: "rb1", label: "Cold exposure (2 min banho gelado)" },
      { id: "rb2", label: "Protocolo de respiracao Wim Hof (3 rodadas)" },
      { id: "rb3", label: "Journaling estrategico (10 min)" },
      { id: "rb4", label: "Suplementacao matinal completa" },
      { id: "rb5", label: "Deep work block (90 min sem interrupcao)" },
      { id: "rb6", label: "Revisao de metas do trimestre" },
      { id: "rb7", label: "Treino funcional (30 min)" },
      { id: "rb8", label: "Leitura tecnica (20 paginas)" },
    ],
  },
  {
    id: "protocolo-noturno",
    title: "Protocolo Noturno",
    description: "Otimize seu sono e recuperacao neural",
    icon: <Moon className="w-4 h-4" />,
    accentColor: "#A78BFA",
    items: [
      { id: "pn1", label: "Desligar telas 1h antes de dormir" },
      { id: "pn2", label: "Magnesio Treonato + L-Teanina" },
      { id: "pn3", label: "Temperatura do quarto em 19-20C" },
      { id: "pn4", label: "Meditacao de gratidao (5 min)" },
      { id: "pn5", label: "Revisao do dia (journaling)" },
      { id: "pn6", label: "Respiracao 4-7-8 para relaxar" },
    ],
  },
  {
    id: "reset-semanal",
    title: "Reset Semanal",
    description: "Revisao e planejamento de elite toda semana",
    icon: <RefreshCw className="w-4 h-4" />,
    accentColor: "#34D399",
    items: [
      { id: "rs1", label: "Revisao das metas da semana anterior" },
      { id: "rs2", label: "Planejamento de 3 prioridades da semana" },
      { id: "rs3", label: "Limpeza digital (emails, apps, notificacoes)" },
      { id: "rs4", label: "Sessao de reflexao profunda (30 min)" },
      { id: "rs5", label: "Ajuste de suplementacao e protocolos" },
    ],
  },
]

interface ChecklistState {
  [itemId: string]: boolean
}

function loadChecklistState(id: string): ChecklistState {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + id)
    if (!raw) return {}
    const data = JSON.parse(raw) as { state: ChecklistState; date: string }
    const today = new Date().toDateString()
    if (id === "reset-semanal") {
      // Reset weekly
      const saved = new Date(data.date)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - saved.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays >= 7) return {}
      return data.state
    }
    if (data.date !== today) return {}
    return data.state
  } catch {
    return {}
  }
}

function saveChecklistState(id: string, state: ChecklistState) {
  if (typeof window === "undefined") return
  localStorage.setItem(
    STORAGE_KEY_PREFIX + id,
    JSON.stringify({ state, date: new Date().toDateString() })
  )
}

function ProChecklistCard({ checklist, isPro }: { checklist: ProChecklist; isPro: boolean }) {
  const [state, setState] = useState<ChecklistState>({})
  const [hydrated, setHydrated] = useState(false)
  const [proModalOpen, setProModalOpen] = useState(false)

  useEffect(() => {
    setState(loadChecklistState(checklist.id))
    setHydrated(true)
  }, [checklist.id])

  const toggleItem = (itemId: string) => {
    if (!isPro) return
    setState((prev) => {
      const updated = { ...prev, [itemId]: !prev[itemId] }
      saveChecklistState(checklist.id, updated)
      return updated
    })
  }

  const resetChecklist = () => {
    const empty: ChecklistState = {}
    setState(empty)
    saveChecklistState(checklist.id, empty)
  }

  const completedCount = checklist.items.filter((item) => state[item.id]).length
  const progressValue = (completedCount / checklist.items.length) * 100

  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: `${checklist.accentColor}15`,
              color: checklist.accentColor,
            }}
          >
            {checklist.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-foreground">{checklist.title}</h3>
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F59E0B]/15 text-[#F59E0B]">
                <Crown className="w-2 h-2" />
                PRO
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">{checklist.description}</p>
          </div>
        </div>
        {isPro && completedCount === checklist.items.length && hydrated && (
          <button
            onClick={resetChecklist}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Resetar checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Progress */}
      {isPro && (
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">
              {completedCount}/{checklist.items.length}
            </span>
            <span className="text-[10px] font-mono text-primary tabular-nums">
              {hydrated ? `${Math.round(progressValue)}%` : "..."}
            </span>
          </div>
          <Progress value={hydrated ? progressValue : 0} className="h-1 bg-secondary" />
        </div>
      )}

      {/* Items */}
      <div className="px-4 pb-4">
        <div className={`flex flex-col gap-1.5 ${!isPro ? "blur-[4px] select-none pointer-events-none" : ""}`}>
          {checklist.items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                state[item.id]
                  ? "bg-primary/5"
                  : "bg-secondary/30 hover:bg-secondary/50"
              }`}
            >
              <div
                className={`flex items-center justify-center w-4 h-4 rounded-[4px] border transition-all shrink-0 ${
                  state[item.id]
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}
                style={
                  state[item.id]
                    ? { boxShadow: `0 0 8px ${checklist.accentColor}40` }
                    : undefined
                }
              >
                {state[item.id] && (
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                )}
              </div>
              <span
                className={`text-[11px] transition-all ${
                  state[item.id]
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PRO overlay */}
      {!isPro && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[1px]">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full mb-3 animate-neon-pulse"
            style={{
              background: `${checklist.accentColor}10`,
              border: `1px solid ${checklist.accentColor}30`,
            }}
          >
            <Lock className="w-5 h-5" style={{ color: checklist.accentColor }} />
          </div>
          <p className="text-[11px] text-muted-foreground mb-3 text-center px-6">
            Desbloqueie este checklist com o plano PRO
          </p>
          <button
            onClick={() => setProModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#07070D] text-[11px] font-bold shadow-[0_0_15px_rgba(245,158,11,0.25)] active:scale-[0.97] transition-all"
          >
            <Crown className="w-3 h-3" />
            Upgrade PRO
          </button>
        </div>
      )}

      <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </div>
  )
}

export function ProChecklists() {
  // Placeholder - replace with useUserPlan() when Clerk is integrated
  const isPro = false

  return (
    <section className="px-5 mt-8">
      <div className="flex items-center gap-2 mb-1">
        <Crown className="w-4 h-4 text-[#F59E0B]" />
        <h2 className="text-sm font-semibold text-foreground">Checklists de Elite</h2>
      </div>
      <p className="text-[10px] text-muted-foreground mb-4 ml-6">
        Protocolos avancados para alta performance.
      </p>

      <div className="flex flex-col gap-4">
        {proChecklists.map((checklist) => (
          <ProChecklistCard
            key={checklist.id}
            checklist={checklist}
            isPro={isPro}
          />
        ))}
      </div>
    </section>
  )
}
