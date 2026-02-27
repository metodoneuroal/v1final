export interface ScanResult {
  productName: string
  score: number
  found: { code: string; name: string; risk: "alto" | "medio" | "baixo" }[]
  safe: string[]
  analysis?: string
  shopRecommendation?: { name: string; reason: string } | null
}

/**
 * Envia imagem base64 para a API route /api/analyze-label
 * que integra com Gemini Vision via AI SDK.
 */
export async function analyzeLabel(imageBase64: string): Promise<ScanResult> {
  const res = await fetch("/api/analyze-label", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64 }),
  })
  if (!res.ok) throw new Error("API error")
  return res.json()
}
