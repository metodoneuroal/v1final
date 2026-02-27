"use client"

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react"

export interface AudioTrack {
  id: string
  title: string
  subtitle?: string
  url: string
  accentColor?: string
  /** "spotify" opens external, "inline" plays in-app */
  source: "spotify" | "inline"
}

interface AudioPlayerState {
  currentTrack: AudioTrack | null
  isPlaying: boolean
  progress: number
  duration: number
}

interface AudioPlayerContextType extends AudioPlayerState {
  play: (track: AudioTrack) => void
  pause: () => void
  resume: () => void
  stop: () => void
  toggle: (track: AudioTrack) => void
  seekTo: (fraction: number) => void
  skipForward: () => void
  skipBackward: () => void
  toggleLoop: () => void
  isLooping: boolean
  isCurrentTrack: (id: string) => boolean
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null)

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider")
  return ctx
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
  })
  const [isLooping, setIsLooping] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setState((prev) => ({
        ...prev,
        progress: audioRef.current?.currentTime ?? 0,
        duration: audioRef.current?.duration ?? 0,
      }))
    }
    rafRef.current = requestAnimationFrame(updateProgress)
  }, [])

  const stopProgressLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
    stopProgressLoop()
    setState({ currentTrack: null, isPlaying: false, progress: 0, duration: 0 })
  }, [stopProgressLoop])

  const play = useCallback(
    (track: AudioTrack) => {
      // If same track, just resume
      if (audioRef.current && state.currentTrack?.id === track.id) {
        audioRef.current.play().catch(() => {})
        setState((prev) => ({ ...prev, isPlaying: true }))
        rafRef.current = requestAnimationFrame(updateProgress)
        return
      }

      // Stop current
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
      stopProgressLoop()

      const audio = new Audio(track.url)
      audio.crossOrigin = "anonymous"
      audio.loop = isLooping
      audioRef.current = audio

      audio.addEventListener("ended", () => {
        stopProgressLoop()
        setState((prev) => ({ ...prev, isPlaying: false, progress: 0 }))
      })

      audio.addEventListener("loadedmetadata", () => {
        setState((prev) => ({ ...prev, duration: audio.duration }))
      })

      audio.play().catch(() => {
        // Audio failed to play - update state but stay in-app
        setState((prev) => ({ ...prev, isPlaying: false }))
      })

      setState({
        currentTrack: track,
        isPlaying: true,
        progress: 0,
        duration: 0,
      })
      rafRef.current = requestAnimationFrame(updateProgress)
    },
    [state.currentTrack?.id, stopProgressLoop, updateProgress]
  )

  const pause = useCallback(() => {
    audioRef.current?.pause()
    stopProgressLoop()
    setState((prev) => ({ ...prev, isPlaying: false }))
  }, [stopProgressLoop])

  const resume = useCallback(() => {
    audioRef.current?.play().catch(() => {})
    setState((prev) => ({ ...prev, isPlaying: true }))
    rafRef.current = requestAnimationFrame(updateProgress)
  }, [updateProgress])

  const toggle = useCallback(
    (track: AudioTrack) => {
      if (state.currentTrack?.id === track.id && state.isPlaying) {
        pause()
      } else if (state.currentTrack?.id === track.id && !state.isPlaying) {
        resume()
      } else {
        play(track)
      }
    },
    [state.currentTrack?.id, state.isPlaying, pause, resume, play]
  )

  const seekTo = useCallback((fraction: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = fraction * audioRef.current.duration
    }
  }, [])

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 15,
        audioRef.current.duration || Infinity
      )
    }
  }, [])

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0)
    }
  }, [])

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => {
      const next = !prev
      if (audioRef.current) {
        audioRef.current.loop = next
      }
      return next
    })
  }, [])

  const isCurrentTrack = useCallback(
    (id: string) => state.currentTrack?.id === id,
    [state.currentTrack?.id]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
      stopProgressLoop()
    }
  }, [stopProgressLoop])

  return (
    <AudioPlayerContext.Provider
      value={{
        ...state,
        play,
        pause,
        resume,
        stop,
        toggle,
        seekTo,
        skipForward,
        skipBackward,
        toggleLoop,
        isLooping,
        isCurrentTrack,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}
