// ============================================================
// AUTH - Preparacao para integracao com Clerk
// ============================================================
// Quando integrar Clerk:
// 1. Instale: npm install @clerk/nextjs
// 2. Adicione ClerkProvider no app/layout.tsx
// 3. Configure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY e CLERK_SECRET_KEY
// 4. Substitua useUserPlan() pela logica real de membership
// ============================================================

"use client"

import { useState, useEffect } from "react"

export type UserPlan = "free" | "pro"

interface UserPlanState {
  plan: UserPlan
  isPro: boolean
  daysLeft: number
}

const PLAN_STORAGE_KEY = "neural-user-plan"

/**
 * Hook placeholder para o plano do usuario.
 * Atualmente retorna "free" sempre.
 * Substituir pela logica real do Clerk + Stripe/Kirvano quando integrar.
 */
export function useUserPlan(): UserPlanState {
  const [plan] = useState<UserPlan>("free")

  return {
    plan,
    isPro: plan === "pro",
    daysLeft: 8,
  }
}

/**
 * Verifica se um conteudo e gratuito ou PRO.
 * Usa a posicao do item na lista: primeiro de cada categoria e FREE.
 */
export function isContentFree(index: number, categoryFirstIndexes: Set<number>): boolean {
  return categoryFirstIndexes.has(index)
}
