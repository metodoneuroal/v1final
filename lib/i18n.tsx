"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Locale = "pt" | "en"

// Dictionary type - flat keys
type Dict = Record<string, string>

const pt: Dict = {
  // Navigation
  "nav.home": "Home",
  "nav.activation": "Ativacao",
  "nav.academy": "Academy",
  "nav.tracker": "Tracker",
  "nav.arsenal": "Arsenal",

  // Home
  "home.explore": "Explorar",
  "home.playlists": "Playlists Neurais",

  // Morning Activation
  "activation.title": "Ativacao Matinal",
  "activation.completed": "concluidos",
  "activation.intention": "Intencao do Dia",
  "activation.intention_placeholder": "Qual e minha intencao para hoje?",
  "activation.courage": "Coragem",
  "activation.courage_placeholder": "Qual desafio vou enfrentar hoje?",
  "activation.priority": "Prioridade #1",
  "activation.priority_placeholder": "Minha tarefa de maior alavancagem",
  "activation.noise": "Ruidos Mentais",
  "activation.noise_placeholder": "O que esta tirando meu foco?",
  "activation.notes": "Anotacoes",
  "activation.notes_placeholder": "Ideias, lembretes, insights...",
  "activation.observation": "Observacao do Dia",
  "activation.observation_placeholder": "Como estou me sentindo agora?",
  "activation.complete": "Ativacao completa! Seu cerebro agradece.",
  "activation.saved": "Progresso salvo automaticamente. Reseta todo dia.",
  "activation.checklist": "Checklist",

  // Brain Dump
  "braindump.title": "Brain Dump",
  "braindump.subtitle": "Despeje tudo que ocupa espaco na sua mente.",
  "braindump.placeholder": "Escreva aqui tudo que esta na sua cabeca...",
  "braindump.save": "Salvar Nota",
  "braindump.analyze": "Analisar com IA",

  // Scanner
  "scanner.title": "Scanner de Rotulos",
  "scanner.scan": "Escanear Rotulo",
  "scanner.scanning": "Analisando rotulo...",
  "scanner.point_camera": "Aponte a camera para o rotulo",
  "scanner.result_elite": "ELITE",
  "scanner.result_poison": "VENENO",

  // Academy
  "academy.title": "Neural Academy",
  "academy.videos": "Videos",
  "academy.library": "Biblioteca (Artigos)",
  "academy.videos_subtitle": "Aulas em video sobre neurociencia e biohacking",
  "academy.library_subtitle": "Artigos e guias escritos",

  // Arsenal
  "arsenal.title": "Arsenal Neural",
  "arsenal.subtitle": "Produtos selecionados para potencializar seu metodo.",
  "arsenal.kits": "Kits Biohacker",
  "arsenal.digital": "Produtos Digitais",
  "arsenal.equipment": "Equipamentos",
  "arsenal.buy": "Comprar",
  "arsenal.low_stock": "Estoque baixo",

  // General
  "general.free": "Gratis",
  "general.close": "Fechar",
  "general.back": "Voltar",
  "general.pro": "PRO",
  "general.free_days": "dias gratis",
}

const en: Dict = {
  // Navigation
  "nav.home": "Home",
  "nav.activation": "Activation",
  "nav.academy": "Academy",
  "nav.tracker": "Tracker",
  "nav.arsenal": "Arsenal",

  // Home
  "home.explore": "Explore",
  "home.playlists": "Neural Playlists",

  // Morning Activation
  "activation.title": "Morning Activation",
  "activation.completed": "completed",
  "activation.intention": "Today's Intention",
  "activation.intention_placeholder": "What is my intention for today?",
  "activation.courage": "Courage",
  "activation.courage_placeholder": "What challenge will I face today?",
  "activation.priority": "Priority #1",
  "activation.priority_placeholder": "My highest leverage task",
  "activation.noise": "Mental Noise",
  "activation.noise_placeholder": "What is distracting me?",
  "activation.notes": "Notes",
  "activation.notes_placeholder": "Ideas, reminders, insights...",
  "activation.observation": "Daily Observation",
  "activation.observation_placeholder": "How am I feeling right now?",
  "activation.complete": "Activation complete! Your brain thanks you.",
  "activation.saved": "Progress saved automatically. Resets daily.",
  "activation.checklist": "Checklist",

  // Brain Dump
  "braindump.title": "Brain Dump",
  "braindump.subtitle": "Dump everything occupying space in your mind.",
  "braindump.placeholder": "Write everything on your mind here...",
  "braindump.save": "Save Note",
  "braindump.analyze": "Analyze with AI",

  // Scanner
  "scanner.title": "Label Scanner",
  "scanner.scan": "Scan Label",
  "scanner.scanning": "Analyzing label...",
  "scanner.point_camera": "Point the camera at the label",
  "scanner.result_elite": "ELITE",
  "scanner.result_poison": "POISON",

  // Academy
  "academy.title": "Neural Academy",
  "academy.videos": "Videos",
  "academy.library": "Library (Articles)",
  "academy.videos_subtitle": "Video lessons on neuroscience and biohacking",
  "academy.library_subtitle": "Written articles and guides",

  // Arsenal
  "arsenal.title": "Neural Arsenal",
  "arsenal.subtitle": "Selected products to power up your method.",
  "arsenal.kits": "Biohacker Kits",
  "arsenal.digital": "Digital Products",
  "arsenal.equipment": "Equipment",
  "arsenal.buy": "Buy",
  "arsenal.low_stock": "Low stock",

  // General
  "general.free": "Free",
  "general.close": "Close",
  "general.back": "Back",
  "general.pro": "PRO",
  "general.free_days": "free days",
}

const dictionaries: Record<Locale, Dict> = { pt, en }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider")
  return ctx
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "pt"
    return (localStorage.getItem("neural-locale") as Locale) || "pt"
  })

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    if (typeof window !== "undefined") {
      localStorage.setItem("neural-locale", l)
    }
  }, [])

  const t = useCallback(
    (key: string): string => {
      return dictionaries[locale][key] ?? key
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}
