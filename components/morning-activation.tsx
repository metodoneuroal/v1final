"use client"

import { useState, useEffect } from "react"
import { Sunrise, Check, RotateCcw, ChevronDown, ChevronUp, Headphones, Lock, History, Calendar, Trash2, Save, Pause } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useAudioPlayer, type AudioTrack } from "@/lib/audio-context"
import { playlistLinks, isSpotifyUrl, isGoogleDriveUrl, getGoogleDriveAudioUrl } from "@/lib/media-links"

const STORAGE_KEY = "neural-morning-checklist"
const ACTIVATION_STORAGE_KEY = "neural-morning-activation-v2"
const ACTIVATION_HISTORY_KEY = "neural-activation-history"
const CHAR_LIMIT = 500

interface CheckItem {
  id: string
  label: string
  checked: boolean
}

interface ActivationFields {
  intention: string
  courage: string
  priority: string
  noise: string
  notes: string
  observation: string
}

const emptyActivation: ActivationFields = {
  intention: "",
  courage: "",
  priority: "",
  noise: "",
  notes: "",
  observation: "",
}

function loadActivation(): ActivationFields | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(ACTIVATION_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { fields: ActivationFields; date: string }
    const today = new Date().toDateString()
    if (data.date !== today) return null
    return data.fields
  } catch {
    return null
  }
}

function saveActivation(fields: ActivationFields) {
  if (typeof window === "undefined") return
  localStorage.setItem(
    ACTIVATION_STORAGE_KEY,
    JSON.stringify({ fields, date: new Date().toDateString() })
  )
}

const defaultItems: CheckItem[] = [
  { id: "1", label: "Copo de agua com limao", checked: false },
  { id: "2", label: "10 min de luz solar", checked: false },
  { id: "3", label: "Journaling (3 paginas)", checked: false },
  { id: "4", label: "Meditacao de 5 min", checked: false },
  { id: "5", label: "Exercicio fisico (20 min)", checked: false },
]

function loadChecklist(): CheckItem[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { items: CheckItem[]; date: string }
    const today = new Date().toDateString()
    if (data.date !== today) return null
    return data.items
  } catch {
    return null
  }
}

function saveChecklist(items: CheckItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ items, date: new Date().toDateString() })
  )
}

interface ActivationLog {
  id: string
  fields: ActivationFields
  completedItems: number
  totalItems: number
  date: string
  displayDate: string
}

function loadActivationHistory(): ActivationLog[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(ACTIVATION_HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveActivationHistory(logs: ActivationLog[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(ACTIVATION_HISTORY_KEY, JSON.stringify(logs))
}

interface FieldConfig {
  key: keyof ActivationFields
  label: string
  placeholder: string
  color: string
  minRows: number
}

const fieldConfigs: FieldConfig[] = [
  {
    key: "intention",
    label: "Intencao do Dia",
    placeholder: "Qual e minha intencao para hoje?",
    color: "#00D4FF",
    minRows: 2,
  },
  {
    key: "courage",
    label: "Coragem",
    placeholder: "Qual desafio vou enfrentar hoje?",
    color: "#F59E0B",
    minRows: 2,
  },
  {
    key: "priority",
    label: "Prioridade #1",
    placeholder: "Minha tarefa de maior alavancagem",
    color: "#34D399",
    minRows: 2,
  },
  {
    key: "noise",
    label: "Ruidos Mentais",
    placeholder: "O que esta tirando meu foco? Preocupacoes, distrações...",
    color: "#FF4D6A",
    minRows: 3,
  },
  {
    key: "notes",
    label: "Anotacoes",
    placeholder: "Ideias, lembretes, insights do momento...",
    color: "#A78BFA",
    minRows: 3,
  },
  {
    key: "observation",
    label: "Observacao do Dia",
    placeholder: "Como estou me sentindo agora? Estado fisico e mental.",
    color: "#EC4899",
    minRows: 2,
  },
]

function GammaAudioButton() {
  const { toggle, isPlaying, isCurrentTrack } = useAudioPlayer()
  const gammaPlaylist = playlistLinks.find((p) => p.id === "gamma")

  const handleGammaPlay = () => {
    if (!gammaPlaylist) return
    const isSpotify = isSpotifyUrl(gammaPlaylist.url)
    const audioUrl = isGoogleDriveUrl(gammaPlaylist.url)
      ? getGoogleDriveAudioUrl(gammaPlaylist.url) ?? gammaPlaylist.url
      : gammaPlaylist.url

    const track: AudioTrack = {
      id: gammaPlaylist.id,
      title: gammaPlaylist.title,
      subtitle: gammaPlaylist.subtitle,
      url: audioUrl,
      accentColor: gammaPlaylist.accentColor,
      source: isSpotify ? "spotify" : "inline",
    }
    toggle(track)
  }

  const isGammaPlaying = gammaPlaylist ? isCurrentTrack(gammaPlaylist.id) && isPlaying : false

  return (
    <button
      onClick={handleGammaPlay}
      className={`w-full relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] mb-6 ${
        isGammaPlaying
          ? "border-primary/40 bg-gradient-to-r from-primary/15 to-primary/8 animate-neon-pulse"
          : "border-primary/25 bg-gradient-to-r from-primary/10 to-primary/5"
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          background: "radial-gradient(circle at 30% 50%, #00D4FF 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 shrink-0">
        {isGammaPlaying ? (
          <Pause className="w-5 h-5 text-primary" />
        ) : (
          <Headphones className="w-5 h-5 text-primary" />
        )}
        {isGammaPlaying && (
          <div className="absolute inset-0 rounded-xl border border-primary/30 animate-ping opacity-20" />
        )}
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-sm font-bold text-foreground neon-text">
          {isGammaPlaying ? "Foco Gamma Ativo" : "Audio Foco Gamma"}
        </h3>
        <p className="text-[11px] text-muted-foreground">
          {isGammaPlaying ? "Tocando no player global" : "Toque para ativar o foco gamma"}
        </p>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-primary"
            style={{
              height: `${8 + Math.sin(i * 1.2) * 6}px`,
              animation: isGammaPlaying ? `neon-pulse ${1 + i * 0.2}s ease-in-out infinite` : "none",
              opacity: isGammaPlaying ? 1 : 0.4,
            }}
          />
        ))}
      </div>
    </button>
  )
}

export function MorningActivation() {
  const [items, setItems] = useState<CheckItem[]>(defaultItems)
  const [hydrated, setHydrated] = useState(false)
  const [activation, setActivation] = useState<ActivationFields>(emptyActivation)
  const [checklistOpen, setChecklistOpen] = useState(true)
  const [activationHistory, setActivationHistory] = useState<ActivationLog[]>([])
  const [showHistorySection, setShowHistorySection] = useState(false)
  const [finalized, setFinalized] = useState(false)

  useEffect(() => {
    const saved = loadChecklist()
    if (saved) setItems(saved)
    const savedActivation = loadActivation()
    if (savedActivation) setActivation(savedActivation)
    setActivationHistory(loadActivationHistory())
    setHydrated(true)
  }, [])

  const updateActivation = (field: keyof ActivationFields, value: string) => {
    if (value.length > CHAR_LIMIT) return
    setActivation((prev) => {
      const updated = { ...prev, [field]: value }
      saveActivation(updated)
      return updated
    })
  }

  const toggleItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
      saveChecklist(updated)
      return updated
    })
  }

  const saveToHistory = () => {
    const hasContent = Object.values(activation).some((v) => v.trim().length > 0)
    if (!hasContent) return

    const log: ActivationLog = {
      id: Date.now().toString(),
      fields: { ...activation },
      completedItems: items.filter((i) => i.checked).length,
      totalItems: items.length,
      date: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    const updated = [log, ...activationHistory].slice(0, 30)
    setActivationHistory(updated)
    saveActivationHistory(updated)
  }

  const deleteHistoryEntry = (id: string) => {
    const updated = activationHistory.filter((l) => l.id !== id)
    setActivationHistory(updated)
    saveActivationHistory(updated)
  }

  const resetChecklist = () => {
    // Salva no historico antes de resetar
    saveToHistory()

    const reset = defaultItems.map((i) => ({ ...i, checked: false }))
    setItems(reset)
    saveChecklist(reset)
    setActivation(emptyActivation)
    saveActivation(emptyActivation)
  }

  const completedCount = items.filter((i) => i.checked).length
  const progressValue = (completedCount / items.length) * 100
  const allDone = completedCount === items.length

  return (
    <section className="px-5 pt-2 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF8C42]/10">
            <Sunrise className="w-4 h-4 text-[#FF8C42]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Ativacao Matinal</h2>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{items.length} concluidos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetChecklist}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Resetar tudo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-primary tabular-nums">
            {hydrated ? `${Math.round(progressValue)}%` : "..."}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <Progress
          value={hydrated ? progressValue : 0}
          className="h-1.5 bg-secondary"
        />
      </div>

      {/* Checklist section - NO TOPO */}
      <div className="glass-card rounded-2xl overflow-hidden mb-5">
        <button
          onClick={() => setChecklistOpen(!checklistOpen)}
          className="flex items-center justify-between w-full p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Checklist</span>
            <span className="text-[10px] text-muted-foreground">
              ({completedCount}/{items.length})
            </span>
          </div>
          {checklistOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {checklistOpen && (
          <div className="px-4 pb-4 flex flex-col gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-left ${
                  item.checked
                    ? "bg-primary/5"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-300 shrink-0 ${
                    item.checked
                      ? "bg-primary border-primary neon-glow"
                      : "border-border"
                  }`}
                >
                  {item.checked && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span
                  className={`text-sm transition-all duration-300 ${
                    item.checked
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* All done celebration */}
      {allDone && hydrated && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 mb-5">
          <Check className="w-4 h-4 text-[#34D399]" />
          <span className="text-xs text-[#34D399] font-medium">
            Ativacao completa! Seu cerebro agradece.
          </span>
        </div>
      )}

      {/* Gamma Focus - Trilha sonora da ativacao (agora usa GlobalAudioPlayer) */}
      <GammaAudioButton />

      {/* Activation Fields - Expandable Textareas */}
      <div className="flex flex-col gap-4 mb-6">
        {fieldConfigs.map((cfg) => {
          const charCount = activation[cfg.key].length
          const isAtLimit = charCount >= CHAR_LIMIT
          return (
            <div key={cfg.key}>
              <label
                htmlFor={`activation-${cfg.key}`}
                className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 block"
                style={{ color: cfg.color }}
              >
                {cfg.label}
              </label>
              <textarea
                id={`activation-${cfg.key}`}
                value={activation[cfg.key]}
                onChange={(e) => updateActivation(cfg.key, e.target.value)}
                placeholder={cfg.placeholder}
                rows={cfg.minRows}
                maxLength={CHAR_LIMIT}
                className={`w-full bg-secondary/60 border rounded-xl px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-y focus:outline-none focus:ring-1 transition-all leading-relaxed ${
                  isAtLimit ? "border-destructive/60" : "border-border/60"
                }`}
                style={{
                  minHeight: `${cfg.minRows * 2.2}rem`,
                }}
                onFocus={(e) => {
                  if (!isAtLimit) {
                    e.currentTarget.style.borderColor = `${cfg.color}40`
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${cfg.color}30`
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ""
                  e.currentTarget.style.boxShadow = ""
                }}
              />
              <div className="flex items-center justify-between mt-1">
                {isAtLimit ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Lock className="w-3 h-3 text-destructive shrink-0" />
                    <span className="text-[10px] text-destructive font-medium">
                      Limite de Expansao Neural atingido. Assine o NEURON PRO para liberar escrita ilimitada e backup.
                    </span>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] text-[10px] font-bold hover:bg-[#F59E0B]/25 transition-colors"
                    >
                      Ativar NEURON PRO
                    </a>
                  </div>
                ) : (
                  <span className="text-[10px] text-transparent">.</span>
                )}
                <span
                  className={`text-[10px] font-mono tabular-nums shrink-0 ${
                    isAtLimit ? "text-destructive" : "text-muted-foreground/50"
                  }`}
                >
                  {charCount}/{CHAR_LIMIT}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Botao Finalizar Ativacao */}
      <button
        onClick={() => {
          saveToHistory()
          setFinalized(true)
          setTimeout(() => setFinalized(false), 3000)
        }}
        disabled={finalized}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
          finalized
            ? "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30"
            : "bg-primary text-primary-foreground neon-glow active:scale-[0.98]"
        }`}
      >
        {finalized ? (
          <>
            <Check className="w-4 h-4" />
            Ativacao Salva no Log!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Finalizar Ativacao
          </>
        )}
      </button>

      {/* Historico de Ativacoes */}
      {activationHistory.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowHistorySection(!showHistorySection)}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-left mb-2"
          >
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-[#FF8C42]" />
              <span className="text-xs font-semibold text-foreground">
                Historico de Ativacoes
              </span>
              <span className="text-[10px] text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded-full">
                {activationHistory.length}
              </span>
            </div>
            {showHistorySection ? (
              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>

          {showHistorySection && (
            <div className="max-h-96 overflow-y-auto rounded-xl border border-border/30 bg-card/60">
              <Accordion type="single" collapsible className="w-full">
                {activationHistory.map((log) => {
                  const filledFields = Object.entries(log.fields).filter(
                    ([, v]) => v.trim().length > 0
                  )
                  const totalReflectionFields = Object.keys(log.fields).length
                  return (
                    <AccordionItem key={log.id} value={log.id} className="border-border/20">
                      <div className="flex items-center pr-2">
                        <AccordionTrigger className="flex-1 px-3 py-2.5 hover:no-underline">
                          <div className="flex flex-col items-start gap-0.5">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-[#FF8C42] shrink-0" />
                              <span className="text-[11px] font-mono text-muted-foreground">
                                {log.displayDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 ml-5">
                              <span className="text-[10px] font-medium text-primary">
                                {"Checklist: "}{log.completedItems}/{log.totalItems}{" concluido"}
                              </span>
                              <span className="text-[10px] font-medium text-[#A78BFA]">
                                {"Reflexoes: "}{filledFields.length}/{totalReflectionFields}{" preenchidas"}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteHistoryEntry(log.id)
                          }}
                          className="flex items-center justify-center w-5 h-5 rounded bg-secondary/60 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          aria-label="Excluir entrada"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <AccordionContent className="px-3 pb-3">
                        <div className="space-y-1.5">
                          {filledFields.map(([key, value]) => {
                            const cfg = fieldConfigs.find((c) => c.key === key)
                            return (
                              <div key={key}>
                                <span
                                  className="text-[9px] font-semibold uppercase tracking-wider"
                                  style={{ color: cfg?.color || "#888" }}
                                >
                                  {cfg?.label || key}
                                </span>
                                <p className="text-[11px] text-foreground/80 leading-relaxed">
                                  {value}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          )}
        </div>
      )}

      {/* Persistence hint */}
      <p className="text-[10px] text-muted-foreground/40 text-center mt-4">
        Progresso salvo automaticamente. Reseta todo dia. Historico salvo ao resetar.
      </p>
    </section>
  )
}
