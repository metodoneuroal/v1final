"use client"

import { useState, useMemo, useEffect } from "react"
import { GraduationCap, Play, Clock, X, Lock, Crown, BookOpen, ChevronRight, ArrowLeft, Headphones } from "lucide-react"
import {
  videoLinks,
  isYouTubeUrl,
  isGoogleDriveUrl,
  getYouTubeEmbedUrl,
  getYouTubeVideoId,
  getGoogleDrivePreviewUrl,
  type VideoLink,
} from "@/lib/media-links"
import { ProModal } from "@/components/pro-modal"
import { BiohackerLibrary } from "@/components/biohacker-library"
import { GuidedMeditations } from "@/components/guided-meditations"
import { useAudioPlayer } from "@/lib/audio-context"

/**
 * Returns a Set of video IDs that are the first in their category (free to watch).
 */
function getFirstPerCategory(videos: VideoLink[]): Set<string> {
  const seen = new Set<string>()
  const firstIds = new Set<string>()
  for (const v of videos) {
    const cat = v.category || "__none__"
    if (!seen.has(cat)) {
      seen.add(cat)
      firstIds.add(v.id)
    }
  }
  return firstIds
}

function VideoModal({
  video,
  onClose,
}: {
  video: VideoLink
  onClose: () => void
}) {
  const { pause: pauseAudio, isPlaying: isAudioPlaying } = useAudioPlayer()

  const embedUrl = isYouTubeUrl(video.url)
    ? getYouTubeEmbedUrl(video.url)
    : isGoogleDriveUrl(video.url)
      ? getGoogleDrivePreviewUrl(video.url)
      : null

  // Pausar audio global quando o video abre
  useEffect(() => {
    if (isAudioPlaying) {
      pauseAudio()
    }
    // Apenas na montagem do modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!embedUrl) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/50 neon-glow">
          <iframe
            src={embedUrl}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "auto" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Tarja preta no topo - esconde titulo/logo do YouTube */}
          <div
            className="absolute top-0 inset-x-0 h-10 bg-background z-10 pointer-events-none"
            aria-hidden="true"
          />
        </div>
        <div className="mt-4 px-1">
          <h3 className="text-base font-semibold text-foreground">{video.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{video.description}</p>
          {video.duration && (
            <div className="flex items-center gap-1.5 mt-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">{video.duration}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function YouTubeThumbnail({ url }: { url: string }) {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  return (
    <img
      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      crossOrigin="anonymous"
    />
  )
}

export function NeuralAcademy() {
  const [view, setView] = useState<"landing" | "videos" | "library" | "meditations">("landing")
  const [activeVideo, setActiveVideo] = useState<VideoLink | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("Todos")
  const [proModalOpen, setProModalOpen] = useState(false)

  const freeVideoIds = useMemo(() => getFirstPerCategory(videoLinks), [])

  const categories = useMemo(() => {
    const cats = new Set(videoLinks.map((v) => v.category).filter(Boolean))
    return ["Todos", ...Array.from(cats)]
  }, [])

  const filteredVideos = useMemo(() => {
    if (activeCategory === "Todos") return videoLinks
    return videoLinks.filter((v) => v.category === activeCategory)
  }, [activeCategory])

  const freeCount = videoLinks.filter((v) => freeVideoIds.has(v.id)).length

  const handleVideoClick = (video: VideoLink) => {
    if (freeVideoIds.has(video.id)) {
      setActiveVideo(video)
    } else {
      setProModalOpen(true)
    }
  }

  // ---- LANDING VIEW ----
  if (view === "landing") {
    return (
      <section className="px-5 pt-2 pb-28">
        {/* Section header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Neural Academy</h2>
            <p className="text-xs text-muted-foreground">
              {freeCount} gratis de {videoLinks.length} aulas
            </p>
          </div>
        </div>

        {/* Entry cards */}
        <div className="flex flex-col gap-3">
          {/* Videos card */}
          <button
            onClick={() => setView("videos")}
            className="relative flex items-center gap-4 p-5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 to-primary/3 text-left transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/15 shrink-0">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-foreground mb-0.5">Videos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aulas em video sobre neurociencia e biohacking
              </p>
              <span className="text-[10px] text-primary font-medium mt-1 inline-block">
                {videoLinks.length} aulas disponibles
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
          </button>

          {/* Library card */}
          <button
            onClick={() => setView("library")}
            className="relative flex items-center gap-4 p-5 rounded-2xl border border-[#34D399]/20 bg-gradient-to-r from-[#34D399]/8 to-[#34D399]/3 text-left transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#34D399]/15 shrink-0">
              <BookOpen className="w-6 h-6 text-[#34D399]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-foreground mb-0.5">Biblioteca (Artigos)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Artigos e guias escritos sobre biohacking
              </p>
              <span className="text-[10px] text-[#34D399] font-medium mt-1 inline-block">
                Artigos gratuitos
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-[#34D399] transition-colors" />
          </button>

          {/* Meditations card */}
          <button
            onClick={() => setView("meditations")}
            className="relative flex items-center gap-4 p-5 rounded-2xl border border-[#A78BFA]/20 bg-gradient-to-r from-[#A78BFA]/8 to-[#A78BFA]/3 text-left transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#A78BFA]/15 shrink-0">
              <Headphones className="w-6 h-6 text-[#A78BFA]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-foreground mb-0.5">Meditacoes Guiadas</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sessoes guiadas para foco, sono e clareza
              </p>
              <span className="text-[10px] text-[#A78BFA] font-medium mt-1 inline-block">
                Sessoes gratuitas disponveis
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-[#A78BFA] transition-colors" />
          </button>
        </div>

        <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
      </section>
    )
  }

  // ---- LIBRARY VIEW ----
  if (view === "library") {
    return (
      <section className="px-5 pt-2 pb-28">
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </button>
        <BiohackerLibrary />
      </section>
    )
  }

  // ---- MEDITATIONS VIEW ----
  if (view === "meditations") {
    return (
      <section className="px-5 pt-2 pb-28">
        <button
          onClick={() => setView("landing")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </button>
        <GuidedMeditations />
      </section>
    )
  }

  // ---- VIDEOS VIEW ----
  return (
    <section className="px-5 pt-2 pb-28">
      {/* Back button */}
      <button
        onClick={() => setView("landing")}
        className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar
      </button>

      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <GraduationCap className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Neural Academy</h2>
          <p className="text-xs text-muted-foreground">
            {freeCount} gratis de {videoLinks.length} aulas
          </p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground neon-glow"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="flex flex-col gap-3">
        {filteredVideos.map((video) => {
          const isYT = isYouTubeUrl(video.url)
          const isDrive = isGoogleDriveUrl(video.url)
          const isFree = freeVideoIds.has(video.id)

          return (
            <button
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className={`group flex gap-3.5 p-3 rounded-2xl glass-card border transition-all duration-300 text-left ${
                isFree
                  ? "border-border/30 hover:border-primary/20"
                  : "border-border/20 opacity-80"
              }`}
              aria-label={isFree ? `Assistir ${video.title}` : `${video.title} - Requer PRO`}
            >
              {/* Thumbnail */}
              <div className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden bg-secondary">
                {isYT && <YouTubeThumbnail url={video.url} />}

                {isDrive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Play className="w-3 h-3 text-primary ml-0.5" />
                    </div>
                  </div>
                )}

                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {isFree ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center neon-glow">
                      <Play className="w-3.5 h-3.5 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B]/15 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    </div>
                  </div>
                )}

                {video.duration && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm">
                    <span className="text-[9px] font-mono text-foreground tabular-nums">
                      {video.duration}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <div className="flex items-start gap-1.5">
                  <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 flex-1">
                    {video.title}
                  </h3>
                  {!isFree && (
                    <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F59E0B]/15 text-[#F59E0B] mt-0.5">
                      <Crown className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight mt-1 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  {video.category && (
                    <span className="text-[10px] font-medium text-primary/70">
                      {video.category}
                    </span>
                  )}
                  {isFree && (
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

      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <GraduationCap className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum video nesta categoria</p>
        </div>
      )}

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </section>
  )
}
