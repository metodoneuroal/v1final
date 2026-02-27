"use client"

import { Headphones, Pause } from "lucide-react"
import { useAudioPlayer, type AudioTrack } from "@/lib/audio-context"
import { playlistLinks, isSpotifyUrl, isGoogleDriveUrl, getGoogleDriveAudioUrl } from "@/lib/media-links"

interface GammaFocusButtonProps {
  className?: string
}

export function GammaFocusButton({ className }: GammaFocusButtonProps) {
  const { toggle, isPlaying, isCurrentTrack } = useAudioPlayer()
  const gammaPlaylist = playlistLinks.find((p) => p.id === "gamma")

  const handleClick = () => {
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
    <section className={`px-5 mt-6 ${className ?? ""}`}>
      <button
        onClick={handleClick}
        className={`w-full relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] ${
          isGammaPlaying
            ? "border-primary/40 bg-gradient-to-r from-primary/15 to-primary/8 animate-neon-pulse"
            : "border-primary/25 bg-gradient-to-r from-primary/10 to-primary/5"
        }`}
      >
        {/* Pulsing glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            background: "radial-gradient(circle at 30% 50%, #00D4FF 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Icon */}
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

        {/* Text */}
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-foreground neon-text">
            {isGammaPlaying ? "Foco Gamma Ativo" : "Audio Foco Gamma"}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {isGammaPlaying ? "Tocando no player global" : "Toque para ativar o foco gamma"}
          </p>
        </div>

        {/* Play indicator */}
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
    </section>
  )
}
