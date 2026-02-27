"use client"

import { useState } from "react"
import {
  Headphones,
  Play,
  Pause,
  Lock,
  Crown,
  ExternalLink,
  Volume2,
  Brain,
  Moon,
  Heart,
  Zap,
  Eye,
} from "lucide-react"
import {
  meditationLinks,
  isSpotifyUrl,
  isGoogleDriveUrl,
  getGoogleDriveAudioUrl,
  type MeditationLink,
} from "@/lib/media-links"
import { ProModal } from "@/components/pro-modal"
import { useAudioPlayer, type AudioTrack } from "@/lib/audio-context"

const categoryConfig: Record<
  MeditationLink["category"],
  { label: string; icon: React.ReactNode; color: string }
> = {
  foco: { label: "Foco", icon: <Brain className="w-3.5 h-3.5" />, color: "#00D4FF" },
  sono: { label: "Sono", icon: <Moon className="w-3.5 h-3.5" />, color: "#A78BFA" },
  ansiedade: { label: "Ansiedade", icon: <Heart className="w-3.5 h-3.5" />, color: "#34D399" },
  energia: { label: "Energia", icon: <Zap className="w-3.5 h-3.5" />, color: "#F59E0B" },
  clareza: { label: "Clareza", icon: <Eye className="w-3.5 h-3.5" />, color: "#EC4899" },
}

const allCategories: MeditationLink["category"][] = ["foco", "sono", "ansiedade", "energia", "clareza"]

export function GuidedMeditations() {
  const [activeCategory, setActiveCategory] = useState<"todos" | MeditationLink["category"]>("todos")
  const [proModalOpen, setProModalOpen] = useState(false)
  const { toggle, isPlaying: globalPlaying, isCurrentTrack } = useAudioPlayer()

  const filtered = activeCategory === "todos"
    ? meditationLinks
    : meditationLinks.filter((m) => m.category === activeCategory)

  const handlePlay = (med: MeditationLink) => {
    if (!med.isFree) {
      setProModalOpen(true)
      return
    }

    const isSpotify = isSpotifyUrl(med.url)
    const audioUrl = isGoogleDriveUrl(med.url)
      ? getGoogleDriveAudioUrl(med.url) ?? med.url
      : med.url

    const cfg = categoryConfig[med.category]
    const track: AudioTrack = {
      id: med.id,
      title: med.title,
      subtitle: med.description,
      url: audioUrl,
      accentColor: cfg.color,
      source: isSpotify ? "spotify" : "inline",
    }
    toggle(track)
  }

  const freeCount = meditationLinks.filter((m) => m.isFree).length

  return (
    <section className="mt-2">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A78BFA]/10">
          <Headphones className="w-4 h-4 text-[#A78BFA]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Meditacoes Guiadas</h2>
          <p className="text-xs text-muted-foreground">
            {freeCount} gratis de {meditationLinks.length} sessoes
          </p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        <button
          onClick={() => setActiveCategory("todos")}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            activeCategory === "todos"
              ? "bg-primary text-primary-foreground neon-glow"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Todos
        </button>
        {allCategories.map((cat) => {
          const cfg = categoryConfig[cat]
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "text-primary-foreground neon-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              style={
                activeCategory === cat
                  ? { background: cfg.color }
                  : undefined
              }
            >
              {cfg.icon}
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Meditation list */}
      <div className="flex flex-col gap-3">
        {filtered.map((med) => {
          const cfg = categoryConfig[med.category]
          const isPlaying = isCurrentTrack(med.id) && globalPlaying
          const isFree = !!med.isFree
          const isSpotify = isSpotifyUrl(med.url)

          return (
            <button
              key={med.id}
              onClick={() => handlePlay(med)}
              className={`group flex items-center gap-3.5 p-3.5 rounded-2xl glass-card border transition-all duration-300 text-left ${
                isFree
                  ? "border-border/30 hover:border-primary/20"
                  : "border-border/20 opacity-80"
              } ${isPlaying ? "animate-neon-pulse" : ""}`}
              aria-label={isFree ? `${isPlaying ? "Pausar" : "Ouvir"} ${med.title}` : `${med.title} - Requer PRO`}
            >
              {/* Play button / Lock */}
              <div
                className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-all"
                style={{
                  background: isFree ? `${cfg.color}15` : `${cfg.color}08`,
                }}
              >
                {!isFree ? (
                  <Lock className="w-4 h-4 text-[#F59E0B]" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4" style={{ color: cfg.color }} />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" style={{ color: cfg.color }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate flex-1">
                    {med.title}
                  </h3>
                  {!isFree && (
                    <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F59E0B]/15 text-[#F59E0B]">
                      <Crown className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
                  {med.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{
                      background: `${cfg.color}15`,
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {med.duration}
                  </span>
                  {isSpotify && isFree && (
                    <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground/60">
                      <ExternalLink className="w-2.5 h-2.5" />
                      Spotify
                    </span>
                  )}
                  {isPlaying && (
                    <span className="flex items-center gap-0.5 text-[9px] font-medium" style={{ color: cfg.color }}>
                      <Volume2 className="w-2.5 h-2.5" />
                      Tocando
                    </span>
                  )}
                  {isFree && !isPlaying && (
                    <span className="text-[9px] font-medium text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">
                      Gratis
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Headphones className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma meditacao nesta categoria</p>
        </div>
      )}

      <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </section>
  )
}
