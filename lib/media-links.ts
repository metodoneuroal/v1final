// ============================================================
// Media Links - URLs centralizadas de playlists, videos e meditacoes
// ============================================================

// ---------- Helpers ----------

export function isSpotifyUrl(url: string): boolean {
  return url.includes("spotify.com") || url.includes("open.spotify")
}

export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be")
}

export function isGoogleDriveUrl(url: string): boolean {
  return url.includes("drive.google.com")
}

export function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === "youtu.be") return u.pathname.slice(1)
    return u.searchParams.get("v")
  } catch {
    return null
  }
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url)
  if (!id) return null
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
}

export function getGoogleDrivePreviewUrl(url: string): string | null {
  const match = url.match(/\/d\/([^/]+)/)
  if (!match) return null
  return `https://drive.google.com/file/d/${match[1]}/preview`
}

export function getGoogleDriveAudioUrl(url: string): string | null {
  const match = url.match(/\/d\/([^/]+)/)
  if (!match) return null
  return `https://drive.google.com/uc?export=download&id=${match[1]}`
}

// ---------- Types ----------

export interface PlaylistLink {
  id: string
  title: string
  subtitle: string
  url: string
  duration: string
  accentColor: string
  icon: "gamma" | "flow" | "dopamine" | "alpha"
}

export interface VideoLink {
  id: string
  title: string
  description: string
  url: string
  duration?: string
  thumbnail?: string
  category?: string
}

export interface MeditationLink {
  id: string
  title: string
  description: string
  url: string
  duration: string
  category: "foco" | "sono" | "ansiedade" | "energia" | "clareza"
  isFree?: boolean
}

// ---------- Data ----------

export const playlistLinks: PlaylistLink[] = [
  {
    id: "gamma",
    title: "Foco Gamma 40Hz",
    subtitle: "Ondas binaurais para concentracao extrema",
    url: "https://drive.google.com/file/d/1GammaFocusPlaceholder/view",
    duration: "60 min",
    accentColor: "#00D4FF",
    icon: "gamma",
  },
  {
    id: "flow",
    title: "Flow State",
    subtitle: "Trilha para entrar em estado de fluxo",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS",
    duration: "45 min",
    accentColor: "#A78BFA",
    icon: "flow",
  },
  {
    id: "dopamine",
    title: "Dopamine Boost",
    subtitle: "Musicas que elevam sua motivacao",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",
    duration: "50 min",
    accentColor: "#F59E0B",
    icon: "dopamine",
  },
  {
    id: "alpha",
    title: "Alpha Relax",
    subtitle: "Ondas alpha para relaxamento profundo",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp",
    duration: "55 min",
    accentColor: "#34D399",
    icon: "alpha",
  },
]

export const videoLinks: VideoLink[] = [
  {
    id: "v1",
    title: "Neurociencia do Foco",
    description: "Como treinar seu cerebro para manter a concentracao por horas",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "15:30",
    category: "Foco",
  },
  {
    id: "v2",
    title: "Protocolo de Sono Profundo",
    description: "Tecnicas baseadas em ciencia para otimizar seu sono",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "22:10",
    category: "Sono",
  },
  {
    id: "v3",
    title: "Biohacking para Iniciantes",
    description: "Guia completo para comecar no biohacking de forma segura",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "18:45",
    category: "Biohacking",
  },
  {
    id: "v4",
    title: "Dopamina e Motivacao",
    description: "Entenda como a dopamina controla sua motivacao diaria",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "12:20",
    category: "Foco",
  },
  {
    id: "v5",
    title: "Meditacao Neurocientifica",
    description: "Como a meditacao muda fisicamente seu cerebro",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "20:00",
    category: "Meditacao",
  },
  {
    id: "v6",
    title: "Suplementacao Inteligente",
    description: "Nootropicos e suplementos com evidencia cientifica",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "25:15",
    category: "Biohacking",
  },
  {
    id: "v7",
    title: "Rotina Matinal Otimizada",
    description: "Os primeiros 60 minutos que definem seu dia inteiro",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "16:40",
    category: "Sono",
  },
  {
    id: "v8",
    title: "Jejum Intermitente Avancado",
    description: "Protocolos alem do basico para clareza mental",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "19:30",
    category: "Biohacking",
  },
  {
    id: "v9",
    title: "Tecnicas de Respiracao",
    description: "Respiracao para controle de ansiedade e performance",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "14:00",
    category: "Meditacao",
  },
  {
    id: "v10",
    title: "Cold Exposure Masterclass",
    description: "Exposicao ao frio como ferramenta de performance",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "21:55",
    category: "Biohacking",
  },
]

export const meditationLinks: MeditationLink[] = [
  {
    id: "m1",
    title: "Foco Laser (10 min)",
    description: "Meditacao guiada para concentracao profunda",
    url: "https://drive.google.com/file/d/1MedFocoPlaceholder/view",
    duration: "10 min",
    category: "foco",
    isFree: true,
  },
  {
    id: "m2",
    title: "Sono Reparador",
    description: "Sessao guiada para adormecer mais rapido",
    url: "https://open.spotify.com/track/placeholder-sono",
    duration: "20 min",
    category: "sono",
    isFree: true,
  },
  {
    id: "m3",
    title: "Calma Profunda",
    description: "Reducao de ansiedade com respiracao guiada",
    url: "https://drive.google.com/file/d/1MedAnsiedadePlaceholder/view",
    duration: "15 min",
    category: "ansiedade",
    isFree: true,
  },
  {
    id: "m4",
    title: "Energia Matinal",
    description: "Ativacao energetica para comecar o dia",
    url: "https://open.spotify.com/track/placeholder-energia",
    duration: "8 min",
    category: "energia",
    isFree: true,
  },
  {
    id: "m5",
    title: "Clareza Mental",
    description: "Limpeza mental para tomada de decisao",
    url: "https://drive.google.com/file/d/1MedClarezaPlaceholder/view",
    duration: "12 min",
    category: "clareza",
    isFree: true,
  },
  {
    id: "m6",
    title: "Foco Ultra (30 min)",
    description: "Sessao avancada de foco com ondas binaurais",
    url: "https://drive.google.com/file/d/1MedFocoProPlaceholder/view",
    duration: "30 min",
    category: "foco",
    isFree: false,
  },
  {
    id: "m7",
    title: "Sono Delta",
    description: "Inducao de ondas delta para sono profundo",
    url: "https://drive.google.com/file/d/1MedSonoProPlaceholder/view",
    duration: "45 min",
    category: "sono",
    isFree: false,
  },
  {
    id: "m8",
    title: "Anti-Ansiedade PRO",
    description: "Protocolo completo de reducao de ansiedade",
    url: "https://drive.google.com/file/d/1MedAnsiedadeProPlaceholder/view",
    duration: "25 min",
    category: "ansiedade",
    isFree: false,
  },
]
