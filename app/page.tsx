"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { PromoBanner } from "@/components/promo-banner"
import { HomeDashboard } from "@/components/home-dashboard"
import { NeuralPlaylists } from "@/components/neural-playlists"
import { NeuralAcademy } from "@/components/neural-academy"
import { MorningActivation } from "@/components/morning-activation"
import { Arsenal } from "@/components/arsenal"
import { BiohackerTracker } from "@/components/biohacker-tracker"
import { BottomNav, type Tab } from "@/components/bottom-nav"
import { BrainDumpFab } from "@/components/brain-dump-fab"
import { ProModal } from "@/components/pro-modal"
import { useAudioPlayer } from "@/lib/audio-context"
import { LoginScreen } from "@/components/login-screen"
import { UserProfile } from "@/components/user-profile"

const LOGIN_KEY = "neuron-logged-in"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [arsenalSubTab, setArsenalSubTab] = useState<"kits" | "digital" | "drop">("kits")
  const [proModalOpen, setProModalOpen] = useState(false)
  const { currentTrack } = useAudioPlayer()
  const isPlayerVisible = !!currentTrack

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem(LOGIN_KEY) === "true")
    setHydrated(true)
  }, [])

  const handleLogin = () => {
    localStorage.setItem(LOGIN_KEY, "true")
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(LOGIN_KEY)
    setIsLoggedIn(false)
    setActiveTab("home")
  }

  const handleNavigateToTab = (tab: string) => {
    if (tab.startsWith("arsenal:")) {
      const sub = tab.split(":")[1] as "kits" | "digital" | "drop"
      setArsenalSubTab(sub)
      setActiveTab("arsenal")
    } else {
      setActiveTab(tab as Tab)
    }
  }

  if (!hydrated) return null

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="min-h-dvh bg-background max-w-md mx-auto relative">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.03] rounded-full"
        style={{
          background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Scrollable content */}
      <main className={`relative z-10 ${isPlayerVisible ? "pb-44" : "pb-24"}`}>
        <AppHeader onOpenPro={() => setProModalOpen(true)} onOpenProfile={() => setActiveTab("profile" as Tab)} />

        {activeTab === "home" && (
          <>
            <PromoBanner
              onOpenPro={() => setProModalOpen(true)}
              onNavigateToTab={handleNavigateToTab}
            />
            <HomeDashboard onNavigateToTab={handleNavigateToTab} />
            <NeuralPlaylists />
          </>
        )}

        {activeTab === "activation" && <MorningActivation />}

        {activeTab === "academy" && <NeuralAcademy />}

        {activeTab === "tracker" && (
          <BiohackerTracker onNavigateToShop={() => setActiveTab("arsenal")} />
        )}

        {activeTab === "arsenal" && <Arsenal initialTab={arsenalSubTab} />}

        {(activeTab as string) === "profile" && <UserProfile onLogout={handleLogout} />}
      </main>

      {/* Brain Dump FAB */}
      <BrainDumpFab isPlayerVisible={isPlayerVisible} />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </div>
  )
}
