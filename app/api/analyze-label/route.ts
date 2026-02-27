import { generateText, Output } from "ai"
import { z } from "zod"

const ScanResultSchema = z.object({
  productName: z.string(),
  score: z.number().min(0).max(100),
  found: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      risk: z.enum(["alto", "medio", "baixo"]),
    })
  ),
  safe: z.array(z.string()),
  analysis: z.string(),
  shopRecommendation: z
    .object({
      name: z.string(),
      reason: z.string(),
    })
    .nullable(),
})

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json()

    const result = await generateText({
      model: "google/gemini-2.5-flash",
      output: Output.object({ schema: ScanResultSchema }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Voce e um especialista em analise de rotulos de alimentos e suplementos. Analise esta imagem de rotulo e retorne um JSON com:

1. "productName": nome do produto identificado
2. "score": pontuacao de 0 a 100 (100 = completamente saudavel, 0 = extremamente prejudicial)
3. "found": array de ingredientes prejudiciais encontrados, cada um com "code" (codigo E se existir, ou "N/A"), "name" (nome do ingrediente) e "risk" ("alto", "medio" ou "baixo")
4. "safe": array de nomes de ingredientes seguros encontrados
5. "analysis": uma analise detalhada em 4-5 paragrafos em portugues brasileiro explicando: (1) visao geral do produto, (2) ingredientes preocupantes e por que, (3) ingredientes positivos, (4) recomendacao final e alternativas, (5) impacto no desempenho cognitivo e fisico
6. "shopRecommendation": recomendacao de suplemento alternativo com "name" e "reason", ou null se nao aplicavel

Seja detalhado na analise. Se a imagem nao for de um rotulo, tente identificar o produto e dar uma analise geral. Responda APENAS com o JSON.`,
            },
            {
              type: "image",
              image: `data:image/jpeg;base64,${imageBase64}`,
            },
          ],
        },
      ],
    })

    if (result.output) {
      return Response.json(result.output)
    }

    // Fallback
    return Response.json({
      productName: "Produto Nao Identificado",
      score: 50,
      found: [],
      safe: [],
      analysis:
        "Nao foi possivel identificar claramente o rotulo na imagem. Tente novamente com uma foto mais nitida e bem iluminada do rotulo de ingredientes.",
      shopRecommendation: null,
    })
  } catch (error) {
    console.error("Erro na analise:", error)
    return Response.json(
      {
        productName: "Erro na Analise",
        score: 50,
        found: [],
        safe: [],
        analysis:
          "Ocorreu um erro ao processar a imagem. Verifique sua conexao e tente novamente.",
        shopRecommendation: null,
      },
      { status: 500 }
    )
  }
}
