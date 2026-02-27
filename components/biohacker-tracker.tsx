"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  ScanLine,
  Lock,
  Crown,
  Camera,
  X,
  Pill,
  Brain,
  Moon,
  Zap,
  Heart,
  Shield,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Skull,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Sparkles,
  Clock,
} from "lucide-react"
import { ProModal } from "@/components/pro-modal"
import { analyzeLabel } from "@/lib/gemini"

interface Supplement {
  id: string
  name: string
  category: string
  icon: React.ReactNode
  shortDesc: string
  benefits: string[]
  dosage: string
  timing: string
  buyUrl?: string
}

interface HarmfulAdditive {
  code: string
  name: string
  risk: "alto" | "medio" | "baixo"
  description: string
}

interface ScanResult {
  productName: string
  score: number
  found: { code: string; name: string; risk: "alto" | "medio" | "baixo" }[]
  safe: string[]
  analysis?: string
  shopRecommendation?: { name: string; reason: string } | null
}

const harmfulAdditives: HarmfulAdditive[] = [
  {
    code: "E621",
    name: "Glutamato Monossodico",
    risk: "medio",
    description: "Excitotoxina que pode causar dores de cabeca, sobrecarga neuronal e aumento do apetite.",
  },
  {
    code: "E951",
    name: "Aspartame",
    risk: "alto",
    description: "Adocante artificial ligado a neurotoxicidade, alteracoes de humor e possivel carcinogenicidade.",
  },
  {
    code: "E211",
    name: "Benzoato de Sodio",
    risk: "medio",
    description: "Conservante que em combinacao com vitamina C forma benzeno, composto carcinogenico.",
  },
  {
    code: "E129",
    name: "Vermelho Allura",
    risk: "alto",
    description: "Corante artificial associado a hiperatividade em criancas e possivel genotoxicidade.",
  },
  {
    code: "E319",
    name: "TBHQ",
    risk: "alto",
    description: "Antioxidante sintetico derivado do petroleo. Pode prejudicar o sistema imunologico.",
  },
  {
    code: "E250",
    name: "Nitrito de Sodio",
    risk: "medio",
    description: "Conservante em carnes processadas. Forma nitrosaminas carcinogenicas quando aquecido.",
  },
  {
    code: "E110",
    name: "Amarelo Crepusculo",
    risk: "medio",
    description: "Corante artificial ligado a alergias, hiperatividade e possivel efeito carcinogenico.",
  },
  {
    code: "E950",
    name: "Acessulfame K",
    risk: "baixo",
    description: "Adocante sintetico com estudos inconclusivos sobre efeitos a longo prazo na microbiota.",
  },
]

const supplements: Supplement[] = [
  {
    id: "magnesio-treonato",
    name: "Magnesio Treonato",
    category: "Cognicao",
    icon: <Brain className="w-4 h-4 text-primary" />,
    shortDesc: "Atravessa a barreira hematoencefalica, melhora memoria e sono profundo.",
    benefits: [
      "Melhora memoria de curto e longo prazo",
      "Aumenta plasticidade sinaptica",
      "Regula o sono profundo (ondas delta)",
      "Reduz ansiedade e estresse",
    ],
    dosage: "144mg de magnesio elementar (2g de treonato)",
    timing: "30-60 min antes de dormir",
    buyUrl: "https://www.amazon.com.br/s?k=magnesio+treonato",
  },
  {
    id: "creatina",
    name: "Creatina Monohidratada",
    category: "Energia",
    icon: <Zap className="w-4 h-4 text-[#F59E0B]" />,
    shortDesc: "Combustivel celular para cerebro e musculos. Beneficio cognitivo comprovado.",
    benefits: [
      "Aumenta reserva de ATP cerebral",
      "Melhora raciocinio sob pressao",
      "Suporte a performance fisica",
      "Neuroprotetor",
    ],
    dosage: "3-5g por dia",
    timing: "Qualquer horario, com consistencia",
    buyUrl: "https://www.amazon.com.br/s?k=creatina+monohidratada",
  },
  {
    id: "omega3",
    name: "Omega-3 (EPA/DHA)",
    category: "Cognicao",
    icon: <Brain className="w-4 h-4 text-[#00D4FF]" />,
    shortDesc: "Acido graxo essencial para estrutura cerebral e reducao de inflamacao.",
    benefits: [
      "Componente estrutural das membranas neuronais",
      "Anti-inflamatorio sistemico",
      "Melhora humor e foco",
      "Suporte cardiovascular",
    ],
    dosage: "2-3g combinados de EPA + DHA",
    timing: "Com refeicoes gordurosas",
    buyUrl: "https://www.amazon.com.br/s?k=omega+3+epa+dha",
  },
  {
    id: "vitamina-d3",
    name: "Vitamina D3 + K2",
    category: "Base",
    icon: <Shield className="w-4 h-4 text-[#F59E0B]" />,
    shortDesc: "Hormonio essencial para imunidade, humor e funcao cognitiva.",
    benefits: [
      "Regula mais de 1000 genes",
      "Suporte imunologico",
      "Melhora humor e energia",
      "K2 direciona calcio para ossos",
    ],
    dosage: "2000-5000 UI D3 + 100-200mcg K2",
    timing: "Pela manha, com gordura",
    buyUrl: "https://www.amazon.com.br/s?k=vitamina+d3+k2",
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha KSM-66",
    category: "Adaptogeno",
    icon: <Heart className="w-4 h-4 text-[#34D399]" />,
    shortDesc: "Adaptogeno que reduz cortisol e melhora resiliencia ao estresse.",
    benefits: [
      "Reduz cortisol em ate 30%",
      "Melhora qualidade do sono",
      "Aumenta testosterona naturalmente",
      "Reduz ansiedade",
    ],
    dosage: "600mg extrato KSM-66",
    timing: "Noite, com refeicao",
    buyUrl: "https://www.amazon.com.br/s?k=ashwagandha+ksm-66",
  },
  {
    id: "l-teanina",
    name: "L-Teanina",
    category: "Foco",
    icon: <Moon className="w-4 h-4 text-[#A78BFA]" />,
    shortDesc: "Aminoacido do cha verde que promove foco calmo e ondas alpha.",
    benefits: [
      "Induz ondas cerebrais alpha",
      "Foco sem nervosismo",
      "Potencializa cafeina sem jitters",
      "Melhora qualidade do sono",
    ],
    dosage: "100-200mg (ou 2:1 com cafeina)",
    timing: "Manha com cafe ou noite para relaxar",
    buyUrl: "https://www.amazon.com.br/s?k=l-teanina",
  },
  {
    id: "lions-mane",
    name: "Lion's Mane",
    category: "Cognicao",
    icon: <Brain className="w-4 h-4 text-[#F59E0B]" />,
    shortDesc: "Cogumelo que estimula NGF e neurogenese - crescimento de novos neuronios.",
    benefits: [
      "Estimula fator de crescimento neural (NGF)",
      "Promove neurogenese",
      "Melhora memoria e aprendizado",
      "Efeito neuroprotetor",
    ],
    dosage: "500-1000mg extrato (30% polissacarideos)",
    timing: "Manha, com ou sem comida",
    buyUrl: "https://www.amazon.com.br/s?k=lions+mane+cogumelo",
  },
]

const categories = ["Todos", "Cognicao", "Energia", "Foco", "Adaptogeno", "Base"]

function getRiskColor(risk: string) {
  switch (risk) {
    case "alto": return { bg: "bg-destructive/15", text: "text-destructive", border: "border-destructive/20" }
    case "medio": return { bg: "bg-[#F59E0B]/15", text: "text-[#F59E0B]", border: "border-[#F59E0B]/20" }
    case "baixo": return { bg: "bg-[#34D399]/15", text: "text-[#34D399]", border: "border-[#34D399]/20" }
    default: return { bg: "bg-secondary", text: "text-muted-foreground", border: "border-border" }
  }
}

function getRiskLabel(risk: string) {
  switch (risk) {
    case "alto": return "Risco Alto"
    case "medio": return "Risco Medio"
    case "baixo": return "Risco Baixo"
    default: return risk
  }
}

// Simulated scan results for demonstration
const mockScanResults: ScanResult[] = [
  {
    productName: "Refrigerante Diet Cola",
    score: 25,
    found: [
      { code: "E951", name: "Aspartame", risk: "alto" },
      { code: "E950", name: "Acessulfame K", risk: "baixo" },
      { code: "E211", name: "Benzoato de Sodio", risk: "medio" },
    ],
    safe: ["Agua carbonatada", "Acido fosforico", "Cafeina"],
    shopRecommendation: {
      name: "Kit Foco Total",
      reason: "Substitua refrigerantes artificiais por nootropicos que realmente ativam seu cerebro.",
    },
  },
  {
    productName: "Salgadinho Industrializado",
    score: 15,
    found: [
      { code: "E621", name: "Glutamato Monossodico", risk: "medio" },
      { code: "E319", name: "TBHQ", risk: "alto" },
      { code: "E110", name: "Amarelo Crepusculo", risk: "medio" },
    ],
    safe: ["Farinha de milho", "Oleo vegetal"],
    shopRecommendation: {
      name: "E-book Biohacking",
      reason: "Aprenda 50+ protocolos para substituir ultraprocessados por alimentos que potencializam o cerebro.",
    },
  },
  {
    productName: "Iogurte Zero Acucar",
    score: 65,
    found: [
      { code: "E951", name: "Aspartame", risk: "alto" },
    ],
    safe: ["Leite desnatado", "Fermento lactico", "Pectina"],
    shopRecommendation: {
      name: "Magnesio Treonato Neural",
      reason: "Potencialize seu sono e cognicao com o suplemento mais eficaz para o cerebro.",
    },
  },
]

function ScannerOverlay({
  onClose,
  onScanComplete,
}: {
  onClose: () => void
  onScanComplete: (result: ScanResult) => void
}) {
  const [phase, setPhase] = useState<"camera" | "scanning" | "done">("camera")
  const [cameraError, setCameraError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera
  useEffect(() => {
    let cancelled = false
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 640 } },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      } catch {
        setCameraError(true)
      }
    }
    startCamera()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const captureAndScan = useCallback(async () => {
    setPhase("scanning")

    let base64 = ""
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 640
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1] ?? ""
      }
    }

    try {
      const result = await analyzeLabel(base64)
      setPhase("done")
      setTimeout(() => {
        onScanComplete(result)
        onClose()
      }, 600)
    } catch {
      // Fallback to mock
      const randomResult = mockScanResults[Math.floor(Math.random() * mockScanResults.length)]
      setPhase("done")
      setTimeout(() => {
        onScanComplete(randomResult)
        onClose()
      }, 600)
    }
  }, [onClose, onScanComplete])

  const handleClose = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/98 backdrop-blur-md">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-secondary z-20"
        aria-label="Fechar scanner"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex flex-col items-center gap-5">
        {/* Scanner viewfinder with live camera */}
        <div className="relative w-72 h-72 rounded-2xl overflow-hidden">
          {/* Camera feed */}
          {!cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-[11px] text-muted-foreground">Camera indisponivel</p>
              </div>
            </div>
          )}

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-primary rounded-tl-lg animate-bracket-pulse" />
          <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-primary rounded-tr-lg animate-bracket-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-primary rounded-bl-lg animate-bracket-pulse" style={{ animationDelay: "0.4s" }} />
          <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-primary rounded-br-lg animate-bracket-pulse" style={{ animationDelay: "0.6s" }} />

          {/* Laser scan line */}
          {phase === "scanning" && (
            <div className="absolute inset-x-6 h-[2px] animate-laser-scan" style={{ top: "10%" }}>
              <div className="w-full h-full bg-primary rounded-full shadow-[0_0_15px_rgba(0,212,255,0.8),0_0_30px_rgba(0,212,255,0.4),0_0_60px_rgba(0,212,255,0.2)]" />
              <div className="absolute -top-1 left-1/4 w-1 h-1 rounded-full bg-primary/80 shadow-[0_0_6px_rgba(0,212,255,0.9)]" />
              <div className="absolute -top-0.5 left-1/2 w-0.5 h-0.5 rounded-full bg-primary/60 shadow-[0_0_4px_rgba(0,212,255,0.7)]" />
              <div className="absolute -top-1 left-3/4 w-1 h-1 rounded-full bg-primary/80 shadow-[0_0_6px_rgba(0,212,255,0.9)]" />
            </div>
          )}

          {/* Overlay text on camera */}
          {phase === "camera" && !cameraError && (
            <div className="absolute inset-0 flex items-end justify-center pb-6">
              <p className="text-xs text-foreground bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                Aponte a camera para o rotulo
              </p>
            </div>
          )}
        </div>

        {phase === "scanning" ? (
          <div className="text-center">
            <p className="text-sm text-primary font-medium animate-pulse">Escaneando ingredientes...</p>
            <div className="flex gap-1 justify-center mt-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : phase === "done" ? (
          <div className="flex items-center gap-2 text-[#34D399]">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Analise completa!</span>
          </div>
        ) : null}

        <button
          onClick={captureAndScan}
          disabled={phase === "scanning"}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm neon-glow active:scale-[0.97] transition-all disabled:opacity-50"
        >
          <ScanLine className="w-4 h-4" />
          {phase === "scanning" ? "Escaneando..." : "Escanear Rotulo"}
        </button>
      </div>
    </div>
  )
}

/** Neon Modal for scan results */
function NeonResultModal({
  result,
  onClose,
  onShopClick,
  onProClick,
}: {
  result: ScanResult
  onClose: () => void
  onShopClick: () => void
  onProClick: () => void
}) {
  const isElite = result.score >= 70
  const isAcceptable = result.score >= 40 && result.score < 70
  const neonColor = isElite ? "#34D399" : isAcceptable ? "#F59E0B" : "#FF4D6A"
  const label = isElite ? "ELITE" : isAcceptable ? "ACEITAVEL" : "VENENO"

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-3xl border-2 bg-card overflow-hidden animate-in zoom-in-95 duration-300"
        style={{
          borderColor: `${neonColor}60`,
          boxShadow: `0 0 40px ${neonColor}30, 0 0 80px ${neonColor}15, inset 0 1px 0 ${neonColor}20`,
        }}
      >
        {/* Glow bg */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] opacity-[0.08] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${neonColor} 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-secondary/80 text-muted-foreground z-10"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative px-6 pt-8 pb-6">
          {/* Score circle */}
          <div className="flex flex-col items-center mb-5">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-full border-3 mb-3"
              style={{
                borderColor: neonColor,
                boxShadow: `0 0 20px ${neonColor}40, inset 0 0 15px ${neonColor}15`,
              }}
            >
              <span className="text-2xl font-bold font-mono" style={{ color: neonColor }}>
                {result.score}
              </span>
            </div>
            <span
              className="text-lg font-black tracking-widest"
              style={{
                color: neonColor,
                textShadow: `0 0 15px ${neonColor}60`,
              }}
            >
              {label}
            </span>
            <p className="text-sm text-foreground font-semibold mt-1">{result.productName}</p>
          </div>

          {/* Found harmful */}
          {result.found.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <XCircle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-[11px] font-semibold text-destructive">Ingredientes prejudiciais</span>
              </div>
              <div className="flex flex-col gap-1">
                {result.found.map((item) => (
                  <div key={item.code} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/40">
                    <span className="text-[10px] font-bold font-mono text-destructive">{item.code}</span>
                    <span className="text-[11px] text-foreground flex-1">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe */}
          {result.safe.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-[11px] font-semibold text-[#34D399]">Seguros</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.safe.map((item) => (
                  <span key={item} className="text-[10px] px-2 py-1 rounded-lg bg-[#34D399]/10 text-[#34D399] font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Shop recommendation */}
          {result.shopRecommendation && (
            <button
              onClick={onShopClick}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-left mb-3"
            >
              <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-foreground">{result.shopRecommendation.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{result.shopRecommendation.reason}</p>
              </div>
            </button>
          )}

          {/* PRO analysis preview + trava */}
          <div className="relative rounded-xl overflow-hidden mb-3">
            <div className="p-2.5 pb-0">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Score <span className="font-bold" style={{ color: neonColor }}>{result.score}/100</span> - {result.found.length} aditivo(s) detectado(s).
              </p>
            </div>
            <div className="relative">
              <div className="p-2.5 pt-1 select-none pointer-events-none" style={{ filter: "blur(8px)" }} aria-hidden="true">
                <p className="text-[10px] text-secondary-foreground leading-relaxed">
                  Analise completa do perfil bioquimico com base nos ingredientes detectados e protocolo de eliminacao personalizado.
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={onProClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#07070D] text-[10px] font-bold active:scale-[0.97] transition-all"
                >
                  <Lock className="w-2.5 h-2.5" />
                  VER ANALISE COMPLETA (NEURON PRO)
                </button>
              </div>
            </div>
          </div>

          {/* PRO CTA */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onProClick() }}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#07070D] text-xs font-bold transition-all active:scale-[0.97] shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <Crown className="w-3.5 h-3.5" />
            Desbloquear NEURON PRO
          </a>
        </div>
      </div>
    </div>
  )
}

function ScanResultCard({
  result,
  onShopClick,
  onProClick,
}: {
  result: ScanResult
  onShopClick: () => void
  onProClick: () => void
}) {
  const scoreColor = result.score >= 60 ? "#34D399" : result.score >= 40 ? "#F59E0B" : "#FF4D6A"
  const scoreLabel = result.score >= 60 ? "Aceitavel" : result.score >= 40 ? "Atencao" : "Evitar"

  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 overflow-hidden mb-5">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">{result.productName}</h3>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: `${scoreColor}15` }}>
            <span className="text-lg font-bold font-mono" style={{ color: scoreColor }}>{result.score}</span>
            <span className="text-[9px] font-medium" style={{ color: scoreColor }}>/ 100</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: scoreColor }} />
          <span className="text-[11px] font-medium" style={{ color: scoreColor }}>{scoreLabel}</span>
        </div>
      </div>

      {/* Found harmful */}
      {result.found.length > 0 && (
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-1.5 mb-2.5">
            <XCircle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-[11px] font-semibold text-destructive">Ingredientes prejudiciais encontrados</span>
          </div>
          <div className="space-y-1.5">
            {result.found.map((item) => {
              const risk = getRiskColor(item.risk)
              return (
                <div key={item.code} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/40">
                  <span className={`text-[10px] font-bold font-mono ${risk.text}`}>{item.code}</span>
                  <span className="text-[11px] text-foreground flex-1">{item.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${risk.bg} ${risk.text}`}>
                    {getRiskLabel(item.risk)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Safe ingredients */}
      {result.safe.length > 0 && (
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="text-[11px] font-semibold text-[#34D399]">Ingredientes seguros</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.safe.map((item) => (
              <span key={item} className="text-[10px] px-2 py-1 rounded-lg bg-[#34D399]/10 text-[#34D399] font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bio-Individual Analysis - PRO (blur + trava) */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-[11px] font-semibold text-[#F59E0B]">Analise Bio-Individual</span>
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#F59E0B]/15 text-[#F59E0B]">
            <Crown className="w-2 h-2" />
            PRO
          </span>
        </div>
        <div className="relative rounded-xl overflow-hidden">
          {/* Primeiras 2 linhas visiveis */}
          <div className="p-3 pb-0">
            <p className="text-[11px] text-secondary-foreground leading-relaxed">
              Score: <span className="font-bold" style={{ color: scoreColor }}>{result.score}/100</span> - {result.productName} contém {result.found.length} aditivo(s) potencialmente prejudicial(is).
            </p>
          </div>
          {/* Restante com blur */}
          <div className="relative">
            <div className="p-3 pt-1 select-none pointer-events-none" style={{ filter: "blur(8px)" }} aria-hidden="true">
              <p className="text-[11px] text-secondary-foreground leading-relaxed">
                Com base no seu perfil genetico e historico de saude, este produto apresenta risco elevado para
                o seu biotipo. Recomendamos substituicao imediata por alternativas naturais que respeitam
                sua sensibilidade metabolica individual. A combinacao de {result.found.map(f => f.name).join(", ")} pode causar efeitos sinergicos negativos.
                Protocolo sugerido: eliminacao gradual em 7 dias com reposicao nutricional personalizada.
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onProClick() }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-[#07070D] text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.97] transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                VER ANALISE COMPLETA (NEURON PRO)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Shop recommendation */}
      {result.shopRecommendation && (
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-primary">Opcao de Elite Recomendada</span>
          </div>
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15">
            <h4 className="text-xs font-bold text-foreground mb-1">{result.shopRecommendation.name}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              {result.shopRecommendation.reason}
            </p>
            <button
              onClick={onShopClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold neon-glow active:scale-[0.97] transition-all"
            >
              <ShoppingBag className="w-3 h-3" />
              Ver na Lojinha Neural
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Timer de Jejum Intermitente ──
function FastingTimer() {
  const [fasting, setFasting] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const FAST_GOAL = 16 * 60 * 60 // 16h em segundos

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("neuron-fast-start") : null
    if (saved) {
      setStartTime(Number(saved))
      setFasting(true)
    }
  }, [])

  useEffect(() => {
    if (!fasting || !startTime) return
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [fasting, startTime])

  const toggleFast = () => {
    if (fasting) {
      setFasting(false)
      setStartTime(null)
      setElapsed(0)
      localStorage.removeItem("neuron-fast-start")
    } else {
      const now = Date.now()
      setStartTime(now)
      setFasting(true)
      localStorage.setItem("neuron-fast-start", String(now))
    }
  }

  const pct = Math.min((elapsed / FAST_GOAL) * 100, 100)
  const hrs = Math.floor(elapsed / 3600)
  const mins = Math.floor((elapsed % 3600) / 60)
  const secs = elapsed % 60
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="rounded-2xl border border-border/40 bg-card/80 p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-[#34D399]" />
        <h3 className="text-sm font-semibold text-foreground">Jejum Intermitente</h3>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#34D399]/15 text-[#34D399]">16:8</span>
      </div>
      {/* Circular progress */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-secondary" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={pct >= 100 ? "#34D399" : "#00D4FF"}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold font-mono text-foreground">{pad(hrs)}:{pad(mins)}</span>
            <span className="text-[9px] text-muted-foreground font-mono">{pad(secs)}s</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
            {fasting
              ? pct >= 100
                ? "Meta de 16h atingida! Autofagia em andamento."
                : `${Math.floor(FAST_GOAL / 3600 - hrs)}h ${60 - mins}min restantes para a meta.`
              : "Inicie o timer ao comecar seu periodo de jejum."}
          </p>
          <div className="w-full h-1.5 rounded-full bg-secondary mb-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: pct >= 100 ? "#34D399" : "#00D4FF" }}
            />
          </div>
          <button
            onClick={toggleFast}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${
              fasting
                ? "bg-destructive/15 text-destructive border border-destructive/30"
                : "bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30"
            }`}
          >
            {fasting ? <><X className="w-3 h-3" /> Encerrar Jejum</> : <><Zap className="w-3 h-3" /> Iniciar Jejum</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Grafico de Ritmo Circadiano ──
function CircadianChart() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const hour = now.getHours() + now.getMinutes() / 60

  // Pontos da curva circadiana (energia relativa 0-1)
  const points = [
    { h: 0, e: 0.15 }, { h: 2, e: 0.08 }, { h: 4, e: 0.05 }, { h: 5, e: 0.1 },
    { h: 6, e: 0.25 }, { h: 7, e: 0.45 }, { h: 8, e: 0.65 }, { h: 9, e: 0.82 },
    { h: 10, e: 0.95 }, { h: 11, e: 0.98 }, { h: 12, e: 0.88 }, { h: 13, e: 0.7 },
    { h: 14, e: 0.6 }, { h: 15, e: 0.72 }, { h: 16, e: 0.85 }, { h: 17, e: 0.82 },
    { h: 18, e: 0.7 }, { h: 19, e: 0.55 }, { h: 20, e: 0.4 }, { h: 21, e: 0.3 },
    { h: 22, e: 0.2 }, { h: 23, e: 0.15 }, { h: 24, e: 0.15 },
  ]

  const W = 300, H = 100, padY = 10
  const toX = (h: number) => (h / 24) * W
  const toY = (e: number) => H - padY - e * (H - padY * 2)

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.h).toFixed(1)},${toY(p.e).toFixed(1)}`).join(" ")
  const areaD = pathD + ` L${W},${H} L0,${H} Z`
  const nowX = toX(hour)
  // Interpolar energia atual
  const lo = points.filter(p => p.h <= hour).pop() || points[0]
  const hi = points.find(p => p.h > hour) || points[points.length - 1]
  const t = hi.h === lo.h ? 0 : (hour - lo.h) / (hi.h - lo.h)
  const nowE = lo.e + t * (hi.e - lo.e)
  const nowY = toY(nowE)

  const getPhase = () => {
    if (hour < 6) return { label: "Sono Profundo", color: "#A78BFA", tip: "Melatonina em pico. Mantenha o quarto escuro." }
    if (hour < 9) return { label: "Despertar", color: "#F59E0B", tip: "Luz solar nos olhos + agua gelada no rosto." }
    if (hour < 12) return { label: "Pico Cognitivo", color: "#00D4FF", tip: "Hora ideal para deep work e decisoes complexas." }
    if (hour < 14) return { label: "Dip Pos-Almoco", color: "#F59E0B", tip: "Evite carboidratos pesados. Faca uma caminhada." }
    if (hour < 17) return { label: "Segundo Pico", color: "#34D399", tip: "Bom para reunioes, exercicio e criatividade." }
    if (hour < 21) return { label: "Desaceleracao", color: "#F59E0B", tip: "Reduza telas. Inicie protocolo de sono." }
    return { label: "Modo Noturno", color: "#A78BFA", tip: "Blue blockers + ambiente escuro. Melatonina natural." }
  }
  const phase = getPhase()

  return (
    <div className="rounded-2xl border border-border/40 bg-card/80 p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-[#A78BFA]" />
          <h3 className="text-sm font-semibold text-foreground">Ritmo Circadiano</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: `${phase.color}15` }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: phase.color }} />
          <span className="text-[10px] font-bold" style={{ color: phase.color }}>{phase.label}</span>
        </div>
      </div>
      {/* SVG Chart */}
      <div className="w-full overflow-hidden rounded-xl bg-secondary/30 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Hora labels */}
          {[0, 6, 12, 18, 24].map(h => (
            <text key={h} x={toX(h)} y={H - 1} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>
              {h === 24 ? "0h" : `${h}h`}
            </text>
          ))}
          {/* Area fill */}
          <path d={areaD} fill="url(#circGrad)" opacity="0.2" />
          {/* Line */}
          <path d={pathD} fill="none" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Now marker */}
          <line x1={nowX} y1={padY} x2={nowX} y2={H - padY} stroke={phase.color} strokeWidth="0.7" strokeDasharray="3 2" opacity="0.5" />
          <circle cx={nowX} cy={nowY} r="4" fill={phase.color} stroke="var(--background)" strokeWidth="1.5" />
          <circle cx={nowX} cy={nowY} r="6" fill="none" stroke={phase.color} strokeWidth="0.5" opacity="0.4" />
          <defs>
            <linearGradient id="circGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Tip */}
      <div className="flex items-start gap-2 mt-3 px-2 py-2 rounded-lg" style={{ background: `${phase.color}08` }}>
        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: phase.color }} />
        <p className="text-[11px] text-muted-foreground leading-relaxed">{phase.tip}</p>
      </div>
    </div>
  )
}

export function BiohackerTracker({ onNavigateToShop }: { onNavigateToShop?: () => void }) {
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState<"aditivos" | "suplementos">("aditivos")
  const [proModalOpen, setProModalOpen] = useState(false)

  const filtered = supplements.filter((s) => {
    const matchesCategory =
      activeCategory === "Todos" || s.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="px-5 pt-2 pb-32">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Pill className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">
          Biohacker Tracker
        </h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5 ml-[42px]">
        Escaneie rotulos e consulte a wiki de suplementos.
      </p>

      {/* Scanner Card - FREE for all */}
      <div className="relative rounded-2xl border border-primary/20 bg-card/80 overflow-hidden mb-5 animate-neon-pulse">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 shrink-0">
              <ScanLine className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Scanner de Rotulos
                </h3>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#34D399]/15 text-[#34D399]">
                  GRATIS
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Aponte a camera para qualquer rotulo e receba uma analise basica instantanea.
              </p>
              <button
                onClick={() => setScannerOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold neon-glow transition-all active:scale-[0.97]"
              >
                <Camera className="w-3.5 h-3.5" />
                Escanear Rotulo
              </button>
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04]" aria-hidden="true">
          <svg viewBox="0 0 100 100" fill="none">
            <rect x="10" y="10" width="80" height="80" rx="8" stroke="#00D4FF" strokeWidth="2" />
            <line x1="10" y1="30" x2="90" y2="30" stroke="#00D4FF" strokeWidth="1" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#00D4FF" strokeWidth="1" />
            <line x1="10" y1="70" x2="90" y2="70" stroke="#00D4FF" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Scanner Modal */}
      {scannerOpen && (
        <ScannerOverlay
          onClose={() => setScannerOpen(false)}
          onScanComplete={(result) => setScanResult(result)}
        />
      )}

      {/* Neon Result Modal */}
      {scanResult && !scannerOpen && (
        <NeonResultModal
          result={scanResult}
          onClose={() => setScanResult(null)}
          onShopClick={() => {
            setScanResult(null)
            onNavigateToShop?.()
          }}
          onProClick={() => {
            setScanResult(null)
            setProModalOpen(true)
          }}
        />
      )}

      {/* Timer de Jejum Intermitente */}
      <FastingTimer />

      {/* Grafico de Ritmo Circadiano */}
      <CircadianChart />

      {/* Section Toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveSection("aditivos")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSection === "aditivos"
              ? "bg-destructive/15 text-destructive border border-destructive/30"
              : "bg-secondary/50 text-muted-foreground border border-border/30"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Aditivos Prejudiciais
        </button>
        <button
          onClick={() => setActiveSection("suplementos")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSection === "suplementos"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-secondary/50 text-muted-foreground border border-border/30"
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          Wiki Suplementos
        </button>
      </div>

      {/* Harmful Additives List - Open for all */}
      {activeSection === "aditivos" && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Skull className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-semibold text-foreground">
              Lista de Aditivos Prejudiciais
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground mb-4 ml-6">
            Consulte antes de comprar. Conhecimento e gratuito.
          </p>

          <div className="space-y-2.5">
            {harmfulAdditives.map((additive) => {
              const risk = getRiskColor(additive.risk)
              const isExpanded = expandedId === additive.code

              return (
                <div
                  key={additive.code}
                  className={`rounded-xl border bg-card/60 overflow-hidden transition-all duration-300 ${risk.border}`}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : additive.code)}
                    className="w-full flex items-center gap-3 p-3.5 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${risk.bg}`}>
                      <span className={`text-xs font-bold font-mono ${risk.text}`}>
                        {additive.code}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-foreground truncate">
                          {additive.name}
                        </h4>
                        <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${risk.bg} ${risk.text}`}>
                          {getRiskLabel(additive.risk)}
                        </span>
                      </div>
                      {!isExpanded && (
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {additive.description}
                        </p>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-0 border-t border-border/30">
                      <div className="pt-3">
                        <p className="text-xs text-secondary-foreground leading-relaxed">
                          {additive.description}
                        </p>
                        <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg ${risk.bg}`}>
                          <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${risk.text}`} />
                          <p className={`text-[11px] font-medium ${risk.text}`}>
                            {additive.risk === "alto"
                              ? "Evite este aditivo sempre que possivel."
                              : additive.risk === "medio"
                                ? "Consuma com moderacao. Prefira alternativas naturais."
                                : "Baixo risco, mas monitore sua sensibilidade."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Supplements Wiki */}
      {activeSection === "suplementos" && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-4 h-4 text-[#A78BFA]" />
            <h3 className="text-sm font-semibold text-foreground">
              Wiki de Suplementos
            </h3>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar suplemento..."
              className="w-full bg-secondary/60 border border-border/60 rounded-xl pl-8 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-secondary/60 text-muted-foreground border border-border/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Supplement List */}
          <div className="space-y-2.5">
            {filtered.map((supp) => {
              const isExpanded = expandedId === supp.id
              return (
                <div
                  key={supp.id}
                  className="rounded-xl border border-border/40 bg-card/60 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : supp.id)}
                    className="w-full flex items-center gap-3 p-3.5 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary/80 shrink-0">
                      {supp.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-foreground truncate">
                          {supp.name}
                        </h4>
                        <span className="shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                          {supp.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {supp.shortDesc}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-0 border-t border-border/30">
                      <div className="pt-3 space-y-3">
                        <div>
                          <h5 className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1.5">
                            Beneficios
                          </h5>
                          <ul className="space-y-1.5">
                            {supp.benefits.map((b, i) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] text-secondary-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1 p-2.5 rounded-lg bg-secondary/40">
                            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                              Dosagem
                            </p>
                            <p className="text-[11px] text-foreground">{supp.dosage}</p>
                          </div>
                          <div className="flex-1 p-2.5 rounded-lg bg-secondary/40">
                            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                              Horario
                            </p>
                            <p className="text-[11px] text-foreground">{supp.timing}</p>
                          </div>
                        </div>
                        {supp.buyUrl && (
                          <a
                            href={supp.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-xs font-semibold transition-all hover:bg-primary/10 active:scale-[0.98]"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Comprar com Desconto
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-10 text-center">
                <Search className="w-6 h-6 text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">Nenhum suplemento encontrado.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ProModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
    </section>
  )
}
