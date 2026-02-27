"use client"

import { useState } from "react"
import { BookOpen, Clock, X, Brain, Pill, Zap, Moon, Lightbulb } from "lucide-react"

interface Article {
  id: string
  title: string
  summary: string
  readTime: string
  category: string
  categoryColor: string
  content: string
}

const articles: Article[] = [
  {
    id: "art-1",
    title: "Como o Sono Regula a Plasticidade Sinaptica",
    summary: "Entenda por que dormir bem e o hack de performance mais poderoso que existe.",
    readTime: "5 min",
    category: "Neurociencia",
    categoryColor: "#00D4FF",
    content: `O sono nao e apenas descanso - e o momento em que seu cerebro consolida memorias, elimina toxinas e fortalece conexoes neurais. Durante o sono profundo (ondas delta), ocorre a consolidacao das memorias declarativas. Ja no sono REM, o cerebro processa emocoes e integra aprendizados.

Estudos mostram que apenas uma noite de sono ruim pode reduzir a capacidade cognitiva em ate 30%. O sono profundo e essencial para a liberacao de hormonio do crescimento (GH) e para o sistema glinfatico - a "lavagem" do cerebro.

Protocolo para otimizar o sono:
- Manter horario fixo de dormir/acordar (mesmo nos fins de semana)
- Temperatura do quarto entre 18-20 graus
- Escuridao total (mascara de dormir se necessario)
- Magnesio Treonato 30-60 min antes de dormir
- Evitar cafeina apos 14h
- Exposicao a luz solar matinal (10 min) para regular o ritmo circadiano`,
  },
  {
    id: "art-2",
    title: "Suplementacao Inteligente: Por Onde Comecar",
    summary: "O guia definitivo dos 5 suplementos base que todo biohacker precisa.",
    readTime: "7 min",
    category: "Suplementacao",
    categoryColor: "#34D399",
    content: `Antes de qualquer suplemento avancado, voce precisa ter a base coberta. Estes 5 suplementos formam o alicerce de qualquer protocolo de biohacking:

1. MAGNESIO TREONATO - Unica forma que atravessa a barreira hematoencefalica. Melhora memoria, sono e reducao de ansiedade. Dosagem: 144mg de Mg elementar antes de dormir.

2. VITAMINA D3 + K2 - A maioria das pessoas tem deficiencia. D3 regula mais de 1000 genes e e essencial para imunidade e humor. K2 garante que o calcio va para os ossos. Dosagem: 2000-5000UI D3 + 100-200mcg K2 pela manha.

3. OMEGA-3 (EPA/DHA) - Componente estrutural das membranas neuronais. Anti-inflamatorio natural. Dosagem: 2-3g combinados de EPA+DHA com refeicoes.

4. CREATINA - Nao e so para musculos. Aumenta a reserva de ATP cerebral e melhora performance cognitiva. Dosagem: 3-5g/dia, qualquer horario.

5. L-TEANINA - Aminoacido do cha verde. Induz ondas alpha (foco calmo) e potencializa os efeitos da cafeina sem causar ansiedade. Dosagem: 100-200mg com cafe.`,
  },
  {
    id: "art-3",
    title: "Dopamina Detox: Recuperando Seu Sistema de Recompensa",
    summary: "Como o excesso de estimulos esta sabotando sua produtividade e como reverter isso.",
    readTime: "6 min",
    category: "Produtividade",
    categoryColor: "#F59E0B",
    content: `A dopamina nao e o "neurotransmissor do prazer" - e o neurotransmissor da MOTIVACAO. Ela e liberada em antecipacao a recompensa, nao durante. O problema: redes sociais, junk food e entretenimento constante hiper-estimulam os receptores de dopamina, causando downregulation.

Sinais de sistema de recompensa desregulado:
- Dificuldade de concentracao em tarefas longas
- Procrastinacao cronica
- Necessidade de estimulos cada vez mais intensos
- Fadiga mental constante

Protocolo de Reset Dopaminergico (7 dias):
- Eliminar redes sociais e notificacoes nao essenciais
- Jejum de entretenimento passivo (Netflix, YouTube scroll)
- Incluir atividades de "recompensa lenta": leitura, caminhada, cozinhar
- Banho gelado pela manha (2 min) - aumenta dopamina em 250%
- Meditacao diaria (10 min) para fortalecer o cortex pre-frontal
- Completar tarefas dificeis PRIMEIRO (antes das faceis)

Apos 7 dias, reintroduza gradualmente os estimulos, mas com limites claros.`,
  },
  {
    id: "art-4",
    title: "Respiracao Box: A Tecnica dos Navy SEALs para Controle Mental",
    summary: "Uma tecnica simples de 4 minutos que transforma seu estado mental instantaneamente.",
    readTime: "4 min",
    category: "Mindset",
    categoryColor: "#EC4899",
    content: `A respiracao box (ou respiracao quadrada) e usada pelos Navy SEALs para manter a calma sob pressao extrema. Ela ativa o sistema nervoso parassimpatico e reduz cortisol em minutos.

Como fazer:
1. INSPIRE por 4 segundos (pelo nariz)
2. SEGURE por 4 segundos
3. EXPIRE por 4 segundos (pela boca)
4. SEGURE por 4 segundos
5. Repita 4-8 ciclos

Por que funciona:
- A retencao do ar aumenta o CO2 no sangue, que paradoxalmente relaxa o sistema nervoso
- O ritmo constante ativa o nervo vago, principal regulador do estresse
- O foco na contagem interrompe padroes de pensamento ansioso

Quando usar:
- Antes de reunioes ou apresentacoes importantes
- Ao sentir ansiedade ou estresse agudo
- Antes de dormir para induzir relaxamento
- Entre sessoes de deep work para resetar
- Ao acordar, antes de checar o celular`,
  },
  {
    id: "art-5",
    title: "Cronobiologia: Hackeando Seu Relogio Biologico",
    summary: "Use a ciencia dos ritmos circadianos para maximizar energia e performance.",
    readTime: "8 min",
    category: "Neurociencia",
    categoryColor: "#00D4FF",
    content: `Seu corpo opera em ciclos de aproximadamente 24 horas chamados ritmos circadianos. Entender e respeitar esses ciclos e a base de toda otimizacao biologica.

Mapa de Performance por Horario:
06:00-09:00 - Cortisol no pico. Ideal para exercicio e exposicao solar.
09:00-12:00 - Pico de alerta cognitivo. Deep work e tarefas complexas.
12:00-14:00 - Queda pos-almoco natural. Power nap de 20 min se possivel.
14:00-17:00 - Segundo pico de performance. Reunioes e colaboracao.
17:00-19:00 - Melhor horario para exercicio fisico (pico de temperatura corporal).
19:00-21:00 - Inicio da producao de melatonina. Diminuir luzes e estimulos.
21:00-23:00 - Janela ideal para dormir (a maioria dos adultos).

Protocolo de Alinhamento Circadiano:
1. Luz solar nos primeiros 30 min apos acordar (nao use oculos escuros)
2. Primeira refeicao consistente no mesmo horario
3. Cafeina apenas nas primeiras 6h apos acordar
4. Exercicio no mesmo horario diariamente
5. Telas com filtro de luz azul apos o por do sol
6. Temperatura do quarto fria para dormir

Respeitar seu cronotipo (matutino vs vespertino) e tao importante quanto qualquer suplemento.`,
  },
]

const categoryIcons: Record<string, React.ReactNode> = {
  Neurociencia: <Brain className="w-3 h-3" />,
  Suplementacao: <Pill className="w-3 h-3" />,
  Produtividade: <Zap className="w-3 h-3" />,
  Sono: <Moon className="w-3 h-3" />,
  Mindset: <Lightbulb className="w-3 h-3" />,
}

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative z-10 w-full max-w-md mx-4 mb-4 sm:mb-0 max-h-[85vh] rounded-2xl border border-border/50 bg-card overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-border/30">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded"
                style={{
                  background: `${article.categoryColor}15`,
                  color: article.categoryColor,
                }}
              >
                {categoryIcons[article.category]}
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-2.5 h-2.5" />
                {article.readTime}
              </span>
            </div>
            <h2 className="text-base font-bold text-foreground leading-snug">
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[65vh]">
          <div className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">
            {article.content}
          </div>
        </div>
      </div>
    </div>
  )
}

export function BiohackerLibrary() {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [activeCategory, setActiveCategory] = useState("Todos")

  const categories = ["Todos", ...new Set(articles.map((a) => a.category))]

  const filtered = activeCategory === "Todos"
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  return (
    <div className="mt-8">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#34D399]/10">
          <BookOpen className="w-4 h-4 text-[#34D399]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Biblioteca Biohacker</h2>
          <p className="text-xs text-muted-foreground">{articles.length} artigos</p>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#34D399] text-[#07070D]"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article list */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((article) => (
          <button
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-border/30 bg-card/60 text-left transition-all hover:border-border/50 active:scale-[0.99]"
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5"
              style={{
                background: `${article.categoryColor}15`,
                color: article.categoryColor,
              }}
            >
              {categoryIcons[article.category] || <BookOpen className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                {article.title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-tight mt-1 line-clamp-2">
                {article.summary}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background: `${article.categoryColor}15`,
                    color: article.categoryColor,
                  }}
                >
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />
                  {article.readTime}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-10 text-center">
          <BookOpen className="w-8 h-8 text-muted-foreground/40 mb-2" />
          <p className="text-xs text-muted-foreground">Nenhum artigo nesta categoria</p>
        </div>
      )}

      {/* Article modal */}
      {activeArticle && (
        <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      )}
    </div>
  )
}
