"use client"

import { useState } from "react"
import { X, Bell, Sunrise, GraduationCap, Crown, Flame, Info } from "lucide-react"

interface Notification {
  id: string
  type: "lembrete" | "conteudo" | "promo" | "conquista"
  title: string
  description: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "lembrete",
    title: "Ativacao matinal pendente!",
    description: "Complete sua rotina matinal para manter a streak.",
    time: "Agora",
    read: false,
  },
  {
    id: "n2",
    type: "conteudo",
    title: "Novo video na Academy",
    description: "Dopamina Hack: como usar o ciclo de recompensa a seu favor.",
    time: "2h atras",
    read: false,
  },
  {
    id: "n3",
    type: "promo",
    title: "Oferta PRO expira em 3 dias!",
    description: "Assine o plano PRO por R$ 9,90/mes antes que a oferta acabe.",
    time: "5h atras",
    read: false,
  },
  {
    id: "n4",
    type: "conquista",
    title: "Streak de 7 dias!",
    description: "Voce completou a ativacao matinal por 7 dias seguidos.",
    time: "1 dia atras",
    read: true,
  },
  {
    id: "n5",
    type: "conteudo",
    title: "Nova meditacao disponivel",
    description: "Sono Reparador: 20 min de relaxamento profundo.",
    time: "2 dias atras",
    read: true,
  },
]

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "lembrete":
      return (
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FF8C42]/10 shrink-0">
          <Sunrise className="w-4 h-4 text-[#FF8C42]" />
        </div>
      )
    case "conteudo":
      return (
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 shrink-0">
          <GraduationCap className="w-4 h-4 text-primary" />
        </div>
      )
    case "promo":
      return (
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F59E0B]/10 shrink-0">
          <Crown className="w-4 h-4 text-[#F59E0B]" />
        </div>
      )
    case "conquista":
      return (
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#34D399]/10 shrink-0">
          <Flame className="w-4 h-4 text-[#34D399]" />
        </div>
      )
  }
}

interface NotificationsPanelProps {
  open: boolean
  onClose: () => void
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />

      <div className="relative z-10 w-full max-w-md mx-4 mt-16 rounded-2xl border border-border/50 bg-card overflow-hidden animate-in slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Notificacoes</h2>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-primary font-medium hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar notificacoes"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Info className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma notificacao</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 px-5 py-3.5 border-b border-border/20 transition-colors ${
                    !notification.read ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className={`text-xs font-semibold leading-snug flex-1 ${
                        notification.read ? "text-muted-foreground" : "text-foreground"
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      {notification.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 mt-1 block">
                      {notification.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
