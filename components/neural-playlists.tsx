"use client"

import { Headphones, Play, Pause, ExternalLink, Volume2 } from "lucide-react"
import {
  playlistLinks,
  isSpotifyUrl,
  isGoogleDriveUrl,
  getGoogleDriveAudioUrl,
  type PlaylistLink,
} from "@/lib/media-links"
import { useAudioPlayer, type AudioTrack } from "@/lib/audio-context"

function WaveIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="10" width="2" height="4" rx="1" fill={color} opacity="0.6">
        <animate attributeName="height" values="4;12;4" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="y" values="10;6;10" dur="1.2s" repeatCount="indefinite" />
      </rect>
      <rect x="6" y="7" width="2" height="10" rx="1" fill={color} opacity="0.8">
        <animate attributeName="height" values="10;4;10" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y" values="7;10;7" dur="1s" repeatCount="indefinite" />
      </rect>
      <rect x="10" y="5" width="2" height="14" rx="1" fill={color}>
        <animate attributeName="height" values="14;6;14" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="y" values="5;9;5" dur="1.4s" repeatCount="indefinite" />
      </rect>
      <rect x="14" y="8" width="2" height="8" rx="1" fill={color} opacity="0.8">
        <animate attributeName="height" values="8;14;8" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="y" values="8;5;8" dur="1.1s" repeatCount="indefinite" />
      </rect>
      <rect x="18" y="9" width="2" height="6" rx="1" fill={color} opacity="0.6">
        <animate attributeName="height" values="6;10;6" dur="1.3s" repeatCount="indefinite" />
        <animate attributeName="y" values="9;7;9" dur="1.3s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}

function GammaIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="#00D4FF" strokeWidth="1.5" opacity="0.3" />
      <circle cx="14" cy="14" r="8" stroke="#00D4FF" strokeWidth="1.5" opacity="0.5" />
      <circle cx="14" cy="14" r="4" fill="#00D4FF" opacity="0.8" />
      <circle cx="14" cy="14" r="2" fill="#00D4FF" />
    </svg>
  )
}

function FlowIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 14C4 14 8 6 14 14C20 22 24 14 24 14" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 14C4 14 8 10 14 14C20 18 24 14 24 14" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

function DopamineIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 20L10 12L14 16L18 8L22 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="14" r="2" fill="#F59E0B" />
    </svg>
  )
}

function AlphaIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 14Q8 4 14 14Q20 24 24 14" stroke="#34D399" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M4 14Q8 8 14 14Q20 20 24 14" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  )
}

const iconMap: Record<PlaylistLink["icon"], () => React.ReactNode> = {
  gamma: () => <GammaIcon />,
  flow: () => <FlowIcon />,
  dopamine: () => <DopamineIcon />,
  alpha: () => <AlphaIcon />,
}

const gradientMap: Record<PlaylistLink["icon"], string> = {
  gamma: "from-[#00D4FF]/10 to-[#00D4FF]/5",
  flow: "from-[#A78BFA]/10 to-[#A78BFA]/5",
  dopamine: "from-[#F59E0B]/10 to-[#F59E0B]/5",
  alpha: "from-[#34D399]/10 to-[#34D399]/5",
}

export function NeuralPlaylists() {
  const { toggle, isPlaying: globalPlaying, isCurrentTrack } = useAudioPlayer()

  const handlePlay = (playlist: PlaylistLink) => {
    const isSpotify = isSpotifyUrl(playlist.url)
    const audioUrl = isGoogleDriveUrl(playlist.url)
      ? getGoogleDriveAudioUrl(playlist.url) ?? playlist.url
      : playlist.url

    const track: AudioTrack = {
      id: playlist.id,
      title: playlist.title,
      subtitle: playlist.subtitle,
      url: audioUrl,
      accentColor: playlist.accentColor,
      source: isSpotify ? "spotify" : "inline",
    }
    toggle(track)
  }

  const isSpotify = (url: string) => isSpotifyUrl(url)
  const isDrive = (url: string) => isGoogleDriveUrl(url)

  return (
    <section className="px-5 mt-8 pb-28">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Headphones className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Playlists Neurais</h2>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {playlistLinks.length} playlists
        </span>
      </div>

      {/* Playlist grid */}
      <div className="grid grid-cols-2 gap-3">
        {playlistLinks.map((playlist) => {
          const isPlaying = isCurrentTrack(playlist.id) && globalPlaying
          const spotifyLink = isSpotify(playlist.url)
          const driveLink = isDrive(playlist.url)

          return (
            <button
              key={playlist.id}
              onClick={() => handlePlay(playlist)}
              className={`relative flex flex-col items-start p-4 rounded-2xl bg-gradient-to-br ${gradientMap[playlist.icon]} border border-border/50 transition-all duration-300 text-left group ${
                isPlaying ? "animate-neon-pulse" : ""
              }`}
              style={
                isPlaying
                  ? {
                      borderColor: `${playlist.accentColor}33`,
                      boxShadow: `0 0 20px ${playlist.accentColor}20`,
                    }
                  : undefined
              }
              aria-label={`${isPlaying ? "Pausar" : "Tocar"} ${playlist.title}`}
            >
              {/* Source badge */}
              <div className="absolute top-2.5 right-2.5">
                {spotifyLink && (
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium"
                    style={{ background: `${playlist.accentColor}15`, color: playlist.accentColor }}
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Spotify</span>
                  </div>
                )}
                {driveLink && isPlaying && (
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium"
                    style={{ background: `${playlist.accentColor}15`, color: playlist.accentColor }}
                  >
                    <Volume2 className="w-2.5 h-2.5" />
                    <span>Tocando</span>
                  </div>
                )}
              </div>

              {/* Icon */}
              <div className="mb-3">
                {isPlaying ? (
                  <WaveIcon color={playlist.accentColor} />
                ) : (
                  iconMap[playlist.icon]()
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-foreground leading-snug mb-0.5">
                {playlist.title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-tight mb-3">
                {playlist.subtitle}
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between w-full mt-auto">
                <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                  {playlist.duration}
                </span>
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300"
                  style={{
                    background: isPlaying
                      ? playlist.accentColor
                      : `${playlist.accentColor}1A`,
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" style={{ color: "#07070D" }} />
                  ) : (
                    <Play className="w-3 h-3 ml-0.5" style={{ color: playlist.accentColor }} />
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
