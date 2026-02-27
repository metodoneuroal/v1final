"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Trash2,
  Sparkles,
  Lock,
  Crown,
  CheckCircle2,
  ListChecks,
  FileText,
  Save,
  Clock,
  ChevronDown,
  ChevronUp,
  Brain,
  Loader2,
} from "lucide-react"
import { ProModal } from "@/components/pro-modal"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const STORAGE_KEY = "neural-braindump-notes"
const FREE_CHAR_LIMIT = 500

interface SavedNote {
  id: string
  text: string
  savedAt: string
}

const exampleChecklist = [
  "Definir as 3 prioridades do dia",
  "Bloquear 90 min de deep work",
  "Revisar metas semanais",
  "Preparar ambiente sem distracoes",
  "Fazer 5 min de respiracao box",
]

const exampleInsights = [
  "Seu padrao de preocupacao indica sobrecarga de decisoes. Simplifique suas escolhas matinais.",
  "Alto nivel de pensamentos sobre tarefas futuras. Aplique o time-blocking.",
  "Pensamentos repetitivos detectados. Tecnica sugerida: regra dos 2 minutos.",
]

const protocolSteps = [
  { time: "06:00", action: "Exposicao a luz solar (10 min)" },
  { time: "06:15", action: "Cold shower / Agua gelada no rosto" },
  { time: "06:20", action: "Journaling - Brain Dump completo" },
  { time: "06:35", action: "Meditacao focada (10 min)" },
  { time: "06:45", action: "Primeira tarefa de alta alavancagem" },
]

function loadNotes(): SavedNote[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveNotesToStorage(notes: SavedNote[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

type AnalyzePhase = "idle" | "loading" | "done"

const loadingMessages = [
  "Sincronizando sinapses...",
  "Mapeando padroes neurais...",
  "Processando lixo mental...",
]

export function BrainDump() {
  const [text, setText] = useState("")
  const [saved, setSaved] = useState(false)
  const [notes, setNotes] = useState<SavedNote[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [proModalOpen, setProModalOpen] = useState(false)
  const [analyzePhase, setAnalyzePhase] = useState<AnalyzePhase>("idle")
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0])


  useEffect(() => {
    setNotes(loadNotes())
  }, [])

  const handleTextChange = (value: string) => {
    if (value.length <= FREE_CHAR_LIMIT) {
      setText(value)
    }
  }

  const handleSave = useCallback(() => {
    if (text.trim().length === 0) return
    const newNote: SavedNote = {
      id: Date.now().toString(),
      text: text.trim(),
      savedAt: new Date().toLocaleString("pt-BR"),
    }
    const updated = [newNote, ...notes].slice(0, 50)
    setNotes(updated)
    saveNotesToStorage(updated)
    setText("")
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [text, notes])

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id)
    setNotes(updated)
    saveNotesToStorage(updated)
  }

  const handleAnalyzeClick = () => {
    if (analyzePhase === "loading") return
    setAnalyzePhase("loading")
    setLoadingMsg(loadingMessages[0])

    // Cycle through loading messages
    const msgInterval = setInterval(() => {
      setLoadingMsg((prev) => {
        const idx = loadingMessages.indexOf(prev)
        return loadingMessages[(idx + 1) % loadingMessages.length]
      })
    }, 1000)

    // After 3 seconds, show the modal
    setTimeout(() => {
      clearInterval(msgInterval)
      setAnalyzePhase("idle")
      setProModalOpen(true)
    }, 3000)
  }

  const charPercent = (text.length / FREE_CHAR_LIMIT) * 100
  const isNearLimit = text.length >= FREE_CHAR_LIMIT * 0.9

  return (
    <section className="px-5 pt-2 pb-32">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Trash2 className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Brain Dump</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4 ml-[42px]">
        Despeje tudo que ocupa espaco na sua mente.
      </p>

      {/* Text Area */}
      <div className="relative mb-1">
        <label htmlFor="brain-dump-input" className="sr-only">
          Lixo Mental
        </label>
        <textarea
          id="brain-dump-input"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Escreva aqui tudo que esta na sua cabeca... pensamentos, preocupacoes, ideias soltas, listas mentais..."
          rows={6}
          maxLength={FREE_CHAR_LIMIT}
          className="w-full bg-secondary/60 border border-border/60 rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all"
        />
      </div>

      {/* Character counter with progress bar */}
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="flex-1 h-1 rounded-full bg-secondary/80 mr-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isNearLimit ? "bg-destructive" : "bg-primary/60"
            }`}
            style={{ width: `${charPercent}%` }}
          />
        </div>
        <span className={`text-[10px] font-mono shrink-0 ${
          isNearLimit ? "text-destructive" : "text-muted-foreground/50"
        }`}>
          {text.length}/{FREE_CHAR_LIMIT}
        </span>
      </div>

      {/* Upgrade prompt when at limit */}
      {text.length >= FREE_CHAR_LIMIT && (
        <div className="flex items-center gap-2 px-3 py-2.5 mb-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <Lock className="w-3.5 h-3.5 text-destructive shrink-0" />
          <span className="text-[10px] text-destructive font-medium flex-1">
            Limite atingido.
          </span>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#07070D] text-[10px] font-bold transition-all active:scale-[0.97] shrink-0"
          >
            <Crown className="w-3 h-3" />
            Liberar Espaco Ilimitado no NEURON PRO
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2.5 mb-2">
        {/* Save Note - Free */}
        <button
          onClick={handleSave}
          disabled={text.trim().length === 0}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            saved
              ? "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30"
              : text.trim().length > 0
                ? "bg-secondary border border-border/60 text-foreground active:scale-[0.98] hover:border-primary/30"
                : "bg-secondary/60 text-muted-foreground/50 cursor-not-allowed border border-transparent"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Salva!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar Nota
            </>
          )}
        </button>

        {/* Analyze with AI - PRO (with loading) */}
        <button
          onClick={handleAnalyzeClick}
          disabled={analyzePhase === "loading"}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            analyzePhase === "loading"
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-primary text-primary-foreground neon-glow active:scale-[0.98]"
          }`}
        >
          {analyzePhase === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">{loadingMsg}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analisar com IA
            </>
          )}
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground/50 text-center mb-6">
        Salvar Nota e gratis ({FREE_CHAR_LIMIT} caracteres). Analisar com IA requer o plano PRO.
      </p>

      {/* Loading animation overlay */}
      {analyzePhase === "loading" && (
        <div className="flex flex-col items-center py-6 mb-4">
          <div className="relative w-16 h-16 mb-3">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-1 rounded-full border-2 border-primary/30 animate-synapse" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-synapse" style={{ animationDelay: "0.3s" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-primary font-medium animate-pulse">{loadingMsg}</p>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Entradas Recentes - Accordion */}
      {notes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Entradas Recentes
              </span>
              <span className="text-[10px] text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded-full">
                {notes.length}
              </span>
            </div>
            {notes.length > 3 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 text-[10px] text-primary font-medium"
              >
                {showHistory ? "Ver menos" : "Ver todas"}
                {showHistory ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto rounded-xl border border-border/30 bg-card/60">
            <Accordion type="single" collapsible className="w-full">
              {(showHistory ? notes : notes.slice(0, 3)).map((note) => (
                <AccordionItem key={note.id} value={note.id} className="border-border/20">
                  <div className="flex items-center pr-2">
                    <AccordionTrigger className="flex-1 px-3 py-2.5 hover:no-underline">
                      <div className="flex flex-col items-start gap-0.5">
                        <p className="text-xs text-foreground line-clamp-1 leading-relaxed text-left">
                          {note.text}
                        </p>
                        <span className="text-[10px] text-muted-foreground/60 font-mono">
                          {note.savedAt}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNote(note.id)
                      }}
                      className="shrink-0 flex items-center justify-center w-5 h-5 rounded bg-secondary/60 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Excluir nota de ${note.savedAt}`}
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <AccordionContent className="px-3 pb-3">
                    <div className="rounded-lg bg-secondary/40 p-3">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {note.text}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {note.text.length} caracteres
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}

      {/* Resultados da IA - sempre visiveis */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-xs font-semibold text-[#F59E0B]">
            Resultados da IA
          </span>
        </div>

        {/* Card 1 - Checklist de Elite */}
        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/60">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Checklist de Elite
              </h3>
            </div>
            <ul className="space-y-2.5">
              {exampleChecklist.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded border border-primary/40 shrink-0" />
                  <span className="text-xs text-secondary-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 2 - Insights Cognitivos */}
        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/60">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#34D399]" />
              <h3 className="text-sm font-semibold text-foreground">
                Insights Cognitivos
              </h3>
            </div>
            <ul className="space-y-2.5">
              {exampleInsights.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]/60 mt-1.5 shrink-0" />
                  <span className="text-xs text-secondary-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 3 - Protocolo de Alto Desempenho */}
        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/60">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#A78BFA]" />
              <h3 className="text-sm font-semibold text-foreground">
                Protocolo de Alto Desempenho
              </h3>
            </div>
            <ul className="space-y-2.5">
              {protocolSteps.map((step, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-primary/60 w-10 shrink-0">
                    {step.time}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]/60 shrink-0" />
                  <span className="text-xs text-secondary-foreground">{step.action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>



      <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </section>
  )
}
