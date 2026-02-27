"use client"

import { useState, useEffect } from "react"
import { Zap, Bell } from "lucide-react"
import { NotificationsPanel } from "@/components/notifications-panel"

interface AppHeaderProps {
  onOpenPro?: () => void
}

export function AppHeader({ onOpenPro }: AppHeaderProps) {
  const [daysLeft, setDaysLeft] = useState(8)
  const [greeting, setGreeting] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Bom dia")
    else if (hour < 18) setGreeting("Boa tarde")
    else setGreeting("Boa noite")
  }, [])

  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 neon-glow">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{greeting}</p>
          <h1 className="text-base font-semibold text-foreground tracking-tight">NEURON</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenPro}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 neon-border border transition-all active:scale-[0.97]"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">
            {daysLeft} dias
          </span>
        </button>
        <div className="relative group">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-secondary transition-colors hover:bg-secondary/80"
            aria-label="Notificacoes"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            {/* Ponto vermelho de notificacao */}
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-background" />
          </button>
          {/* Tooltip */}
          <div className="absolute right-0 top-full mt-1.5 px-2.5 py-1 rounded-lg bg-foreground text-background text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Novidades em breve
          </div>
        </div>
        <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      </div>
    </header>
  )
}
