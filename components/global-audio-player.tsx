"use client"

import { useAudioPlayer } from "@/lib/audio-context"
import { StickyAudioPlayer } from "@/components/sticky-audio-player"

export function GlobalAudioPlayer() {
  const { currentTrack } = useAudioPlayer()

  if (!currentTrack) return null

  return <StickyAudioPlayer />
}
