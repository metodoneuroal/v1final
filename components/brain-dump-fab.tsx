"use client"

import { useState } from "react"
import { Brain, X } from "lucide-react"
import { BrainDump } from "@/components/brain-dump"

export function BrainDumpFab({ isPlayerVisible = false }: { isPlayerVisible?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* FAB Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_4px_20px_rgba(0,212,255,0.4)] active:scale-[0.93] transition-all animate-neon-pulse"
          style={{
            bottom: isPlayerVisible
              ? "calc(10rem + env(safe-area-inset-bottom, 8px))"
              : "calc(5rem + env(safe-area-inset-bottom, 8px))",
          }}
          aria-label="Abrir Brain Dump"
        >
          <Brain className="w-6 h-6" />
        </button>
      )}

      {/* Drawer Overlay */}
      {open && (
        <div className="fixed inset-0 z-[80] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="presentation"
          />

          {/* Drawer content */}
          <div className="relative z-10 mt-auto w-full max-w-md mx-auto max-h-[85vh] rounded-t-3xl border border-border/50 bg-card overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            {/* Drag handle + close */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Brain Dump</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/80 text-muted-foreground"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(85vh-4rem)]">
              <BrainDump />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
