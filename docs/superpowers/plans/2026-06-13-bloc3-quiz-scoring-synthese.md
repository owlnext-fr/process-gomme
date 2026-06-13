# Bloc 3 — Quiz + scoring + synthèse — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Assembler l'application complète — 3 écrans (intro → quiz paginé → résultats), un moteur de scoring pur et testé, et un écran de résultats « signature » (immeuble/pyramide animé + radar + synthèse textuelle originale étoffée) — à partir du contenu validé au Bloc 2.

**Architecture:** State machine en mémoire (`useReducer`) pour la navigation et les réponses. Logique pure isolée dans `lib/scoring.ts` (aucune dépendance React, 100 % testable). UI découpée par feature (`intro`, `quiz`, `results`). Contenu textuel original dans `content/`. Recharts pour le radar, `motion` (Framer Motion) pour les transitions et la construction animée de l'immeuble, en respectant `prefers-reduced-motion`.

**Tech Stack:** React 19, TypeScript, Tailwind v4, shadcn/ui (Card, Progress, RadioGroup, Slider, Button), Recharts, `motion` (import `motion/react`), Vitest + RTL, Playwright.

**Spec source :** `docs/superpowers/specs/2026-06-13-bloc3-quiz-scoring-synthese-design.md`

> ⚠️ **Task 4 (rédaction des synthèses) est à exécuter en ULTRATHINK** — textes étoffés, originaux, jamais de reformulation de matériel propriétaire.

---

## File Structure

| Fichier | Responsabilité |
|---|---|
| `src/lib/scoring.ts` | Types `Answer`/`Answers`/`ScoreResult` + `computeResult` (pur) |
| `src/lib/scoring.test.ts` | Tests unitaires du moteur |
| `src/features/quiz/quizReducer.ts` | State machine (écran, index, réponses) |
| `src/features/quiz/quizReducer.test.ts` | Tests du reducer |
| `src/content/descriptions.ts` | 6 paragraphes base + 6 phase (ULTRATHINK, original) |
| `src/content/interactions.ts` | `composeInteraction(base, phase)` + `IMMEUBLE_INTRO` |
| `src/content/interactions.test.ts` | Tests de composition |
| `src/features/intro/IntroScreen.tsx` | Écran d'accueil |
| `src/features/quiz/ForcedChoice.tsx` | RadioGroup pour un choix forcé |
| `src/features/quiz/LikertScale.tsx` | Slider pour un Likert |
| `src/features/quiz/QuizScreen.tsx` | Orchestration quiz (Progress + transitions) |
| `src/features/results/Immeuble.tsx` | Pyramide animée (largeur ∝ score) |
| `src/features/results/RadarProfil.tsx` | Radar Recharts |
| `src/features/results/Synthese.tsx` | Sections titrées (base/phase/immeuble/interactions) |
| `src/features/results/ResultsScreen.tsx` | Split layout + bouton recommencer |
| `src/App.tsx` | Routeur d'écrans (useReducer) — remplace la page Hello |

---

## Task 1: Moteur de scoring (`lib/scoring.ts`)

**Files:** Create `src/lib/scoring.ts`, `src/lib/scoring.test.ts`.

- [ ] **Step 1: Écrire les tests (échouent : module absent)**

Create `src/lib/scoring.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { computeResult, type Answers } from "./scoring"
import { QUESTIONS } from "@/data/questions"
import { TYPE_IDS, type TypeId } from "@/data/types"

// Construit des réponses qui font gagner `cibleBase` en base et `ciblePhase` en phase :
// chaque choix forcé vote pour la cible voulue si elle est une option, sinon la 1re option ;
// chaque Likert est mis à 5 si sa cible est la cible voulue, sinon 1.
function answersFavorisant(cibleBase: TypeId, ciblePhase: TypeId): Answers {
  const a: Answers = {}
  for (const q of QUESTIONS) {
    const cible = q.famille === "base" ? cibleBase : ciblePhase
    if (q.kind === "forced") {
      const match = q.options.find((o) => o.cible === cible)
      a[q.id] = { kind: "forced", cible: (match ?? q.options[0]).cible }
    } else {
      a[q.id] = { kind: "likert", valeur: q.cible === cible ? 5 : 1 }
    }
  }
  return a
}

describe("computeResult", () => {
  it("la base et la phase sont les types favorisés", () => {
    const r = computeResult(answersFavorisant("travaillomane", "empathique"))
    expect(r.base).toBe("travaillomane")
    expect(r.phase).toBe("empathique")
    expect(r.baseEgalePhase).toBe(false)
  })

  it("chaque vecteur est normalisé en % (somme ≈ 100)", () => {
    const r = computeResult(answersFavorisant("perseverant", "rebelle"))
    const somme = (v: Record<TypeId, number>) =>
      TYPE_IDS.reduce((s, t) => s + v[t], 0)
    expect(somme(r.socle)).toBeCloseTo(100, 5)
    expect(somme(r.motivation)).toBeCloseTo(100, 5)
  })

  it("l'immeuble classe les 6 types par score socle décroissant", () => {
    const r = computeResult(answersFavorisant("reveur", "reveur"))
    for (let i = 1; i < r.immeuble.length; i++) {
      expect(r.socle[r.immeuble[i - 1]]).toBeGreaterThanOrEqual(
        r.socle[r.immeuble[i]],
      )
    }
    expect(r.immeuble).toHaveLength(6)
    expect(new Set(r.immeuble).size).toBe(6)
  })

  it("gère le cas base === phase", () => {
    const r = computeResult(answersFavorisant("promoteur", "promoteur"))
    expect(r.base).toBe("promoteur")
    expect(r.phase).toBe("promoteur")
    expect(r.baseEgalePhase).toBe(true)
  })

  it("ne plante pas sur des réponses vides et départage par l'ordre canonique", () => {
    const r = computeResult({})
    expect(r.base).toBe(TYPE_IDS[0])
    expect(r.phase).toBe(TYPE_IDS[0])
    expect(r.immeuble).toEqual(TYPE_IDS)
  })
})
```

- [ ] **Step 2: Lancer → échec**

Run: `pnpm test src/lib/scoring.test.ts`
Expected: FAIL (`Cannot find module './scoring'`).

- [ ] **Step 3: Écrire `src/lib/scoring.ts`**

Create `src/lib/scoring.ts`:
```ts
import { QUESTIONS } from "@/data/questions"
import { TYPE_IDS, type TypeId } from "@/data/types"

export type Answer =
  | { kind: "forced"; cible: TypeId }
  | { kind: "likert"; valeur: 1 | 2 | 3 | 4 | 5 }

export type Answers = Record<string, Answer>

export interface ScoreResult {
  socle: Record<TypeId, number>
  motivation: Record<TypeId, number>
  base: TypeId
  phase: TypeId
  immeuble: TypeId[]
  baseEgalePhase: boolean
}

function vecteurNul(): Record<TypeId, number> {
  return Object.fromEntries(TYPE_IDS.map((t) => [t, 0])) as Record<TypeId, number>
}

function normaliser(v: Record<TypeId, number>): Record<TypeId, number> {
  const total = TYPE_IDS.reduce((s, t) => s + v[t], 0)
  const out = vecteurNul()
  if (total > 0) {
    for (const t of TYPE_IDS) out[t] = (v[t] / total) * 100
  }
  return out
}

function argmax(v: Record<TypeId, number>): TypeId {
  let best = TYPE_IDS[0]
  for (const t of TYPE_IDS) if (v[t] > v[best]) best = t
  return best
}

export function computeResult(answers: Answers): ScoreResult {
  const socleRaw = vecteurNul()
  const motivationRaw = vecteurNul()

  for (const q of QUESTIONS) {
    const cible = q.famille === "base" ? socleRaw : motivationRaw
    const a = answers[q.id]
    if (q.kind === "forced") {
      if (a && a.kind === "forced") cible[a.cible] += 1
    } else {
      // Likert : réponse 1..5 → (r-1)/4 ∈ [0,1]. Absent → neutre (3) → 0.5.
      const valeur = a && a.kind === "likert" ? a.valeur : 3
      cible[q.cible] += (valeur - 1) / 4
    }
  }

  const socle = normaliser(socleRaw)
  const motivation = normaliser(motivationRaw)
  const base = argmax(socle)
  const phase = argmax(motivation)
  const immeuble = [...TYPE_IDS].sort(
    (a, b) => socle[b] - socle[a] || TYPE_IDS.indexOf(a) - TYPE_IDS.indexOf(b),
  )

  return { socle, motivation, base, phase, immeuble, baseEgalePhase: base === phase }
}
```

- [ ] **Step 4: Lancer → succès**

Run: `pnpm test src/lib/scoring.test.ts`
Expected: PASS (5 tests).

> Note : avec `{}` (réponses vides), chaque Likert absent contribue 0.5 à sa cible ;
> chaque type a 1 Likert/famille → tous égaux → `argmax`/`immeuble` départagés par
> l'ordre canonique. Cohérent avec le test « réponses vides ».

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring.ts src/lib/scoring.test.ts
git commit -m "✨ feat: moteur de scoring base/phase/immeuble (pur, testé)"
```

---

## Task 2: State machine du quiz (`features/quiz/quizReducer.ts`)

**Files:** Create `src/features/quiz/quizReducer.ts`, `src/features/quiz/quizReducer.test.ts`.

- [ ] **Step 1: Écrire les tests**

Create `src/features/quiz/quizReducer.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { quizReducer, initialState, type QuizState } from "./quizReducer"
import { QUESTIONS } from "@/data/questions"

const DERNIER = QUESTIONS.length - 1

describe("quizReducer", () => {
  it("démarre sur l'intro", () => {
    expect(initialState.screen).toBe("intro")
    expect(initialState.index).toBe(0)
  })

  it("start passe au quiz à l'index 0", () => {
    const s = quizReducer(initialState, { type: "start" })
    expect(s.screen).toBe("quiz")
    expect(s.index).toBe(0)
  })

  it("answer enregistre la réponse par id", () => {
    const s = quizReducer({ ...initialState, screen: "quiz" }, {
      type: "answer",
      id: "b-fc-01",
      answer: { kind: "forced", cible: "rebelle" },
    })
    expect(s.answers["b-fc-01"]).toEqual({ kind: "forced", cible: "rebelle" })
  })

  it("next avance, prev recule, bornés", () => {
    let s: QuizState = { screen: "quiz", index: 0, answers: {} }
    s = quizReducer(s, { type: "next" })
    expect(s.index).toBe(1)
    s = quizReducer(s, { type: "prev" })
    expect(s.index).toBe(0)
    s = quizReducer(s, { type: "prev" })
    expect(s.index).toBe(0)
  })

  it("next sur la dernière question passe aux résultats", () => {
    const s = quizReducer({ screen: "quiz", index: DERNIER, answers: {} }, { type: "next" })
    expect(s.screen).toBe("results")
  })

  it("restart réinitialise tout", () => {
    const s = quizReducer(
      { screen: "results", index: DERNIER, answers: { x: { kind: "likert", valeur: 5 } } },
      { type: "restart" },
    )
    expect(s).toEqual(initialState)
  })
})
```

- [ ] **Step 2: Lancer → échec**

Run: `pnpm test src/features/quiz/quizReducer.test.ts`
Expected: FAIL (module absent).

- [ ] **Step 3: Écrire `src/features/quiz/quizReducer.ts`**

Create `src/features/quiz/quizReducer.ts`:
```ts
import type { Answer, Answers } from "@/lib/scoring"
import { QUESTIONS } from "@/data/questions"

export type Screen = "intro" | "quiz" | "results"

export interface QuizState {
  screen: Screen
  index: number
  answers: Answers
}

export const initialState: QuizState = { screen: "intro", index: 0, answers: {} }

export type Action =
  | { type: "start" }
  | { type: "answer"; id: string; answer: Answer }
  | { type: "next" }
  | { type: "prev" }
  | { type: "restart" }

export function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "start":
      return { ...state, screen: "quiz", index: 0 }
    case "answer":
      return { ...state, answers: { ...state.answers, [action.id]: action.answer } }
    case "next":
      if (state.index >= QUESTIONS.length - 1) return { ...state, screen: "results" }
      return { ...state, index: state.index + 1 }
    case "prev":
      return { ...state, index: Math.max(0, state.index - 1) }
    case "restart":
      return initialState
    default:
      return state
  }
}
```

- [ ] **Step 4: Lancer → succès**

Run: `pnpm test src/features/quiz/quizReducer.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/quiz/quizReducer.ts src/features/quiz/quizReducer.test.ts
git commit -m "✨ feat: state machine du quiz (intro/quiz/results)"
```

---

## Task 3: Installer Recharts + motion

**Files:** Modify `package.json`, `pnpm-lock.yaml`.

- [ ] **Step 1: Installer**

```bash
pnpm add recharts motion
```

- [ ] **Step 2: Vérifier l'import de motion**

Créer un fichier temporaire `src/_probe.ts` :
```ts
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
export const _ = { motion, AnimatePresence, useReducedMotion }
```
Run: `pnpm exec tsc -b`
Expected: pas d'erreur de résolution de `motion/react`. Si erreur, l'import correct est
`from "framer-motion"` — le noter et l'utiliser dans tout le bloc. Puis supprimer le probe :
`rm src/_probe.ts`.

- [ ] **Step 3: Vérifier le build**

Run: `pnpm build`
Expected: OK.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "➕ deps: recharts + motion (framer motion)"
```

---

## Task 4: Synthèses textuelles — **ULTRATHINK**

**Files:** Create `src/content/descriptions.ts`, `src/content/interactions.ts`, `src/content/interactions.test.ts`.

> **ULTRATHINK.** Textes **étoffés** (≈ 4–7 phrases par paragraphe), originaux, en français
> neutre à la 2ᵉ personne (« tu » — cohérent avec un retour de test personnel), dérivés des
> essences/besoins du Bloc 2 (`TYPES[*].essenceBase` / `besoinPhase`). Jamais de reformulation
> de matériel propriétaire. Chaque description doit être juste, nuancée et bienveillante
> (forces + zones de vigilance), sans jugement de valeur entre types.

- [ ] **Step 1: Écrire les tests de composition (échouent)**

Create `src/content/interactions.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { composeInteraction, IMMEUBLE_INTRO } from "./interactions"
import { DESCRIPTIONS } from "./descriptions"
import { TYPE_IDS } from "@/data/types"

describe("DESCRIPTIONS", () => {
  it("a une description base et phase étoffée pour chaque type", () => {
    for (const t of TYPE_IDS) {
      expect(DESCRIPTIONS[t].base.length).toBeGreaterThan(120)
      expect(DESCRIPTIONS[t].phase.length).toBeGreaterThan(120)
    }
  })
})

describe("composeInteraction", () => {
  it("compose un texte non vide pour toute paire base/phase", () => {
    for (const b of TYPE_IDS) {
      for (const p of TYPE_IDS) {
        expect(composeInteraction(b, p).length).toBeGreaterThan(80)
      }
    }
  })

  it("produit une variante spécifique quand base === phase", () => {
    const egal = composeInteraction("reveur", "reveur")
    const diff = composeInteraction("reveur", "promoteur")
    expect(egal).not.toBe(diff)
  })
})

describe("IMMEUBLE_INTRO", () => {
  it("est un texte explicatif non vide", () => {
    expect(IMMEUBLE_INTRO.length).toBeGreaterThan(80)
  })
})
```

- [ ] **Step 2: Lancer → échec**

Run: `pnpm test src/content/interactions.test.ts`
Expected: FAIL (modules absents).

- [ ] **Step 3: Écrire `src/content/descriptions.ts` (ULTRATHINK, contenu étoffé original)**

Structure imposée :
```ts
import type { TypeId } from "@/data/types"

export interface Description {
  base: string   // paragraphe étoffé : comment ce type perçoit/fonctionne (trait stable)
  phase: string  // paragraphe étoffé : le besoin du moment quand ce type est en phase
}

export const DESCRIPTIONS: Record<TypeId, Description> = {
  travaillomane: {
    base: "…", // ULTRATHINK : 4–7 phrases, original, dérivé de l'essence base
    phase: "…",
  },
  // … les 6 types : perseverant, empathique, reveur, rebelle, promoteur
}
```
Rédiger les 12 paragraphes. Exigences : étoffés, justes, nuancés (forces + vigilances),
originaux, jamais de matériel propriétaire, tutoiement neutre.

- [ ] **Step 4: Écrire `src/content/interactions.ts` (template paramétré + intro immeuble)**

Structure :
```ts
import { TYPES, type TypeId } from "@/data/types"

export const IMMEUBLE_INTRO =
  "…" // ULTRATHINK : explique comment lire l'immeuble (étages = types classés par score
      // socle, base en bas = structure dominante, étages du haut = ressources plus discrètes)

// Clause originale (un fragment de phrase) caractérisant chaque type côté "base" et côté "phase".
const CLAUSE_BASE: Record<TypeId, string> = { /* 6 fragments originaux */ }
const CLAUSE_PHASE: Record<TypeId, string> = { /* 6 fragments originaux */ }

export function composeInteraction(base: TypeId, phase: TypeId): string {
  if (base === phase) {
    // Variante dédiée : la base et la phase coïncident (situation normale).
    return `Ta base et ta phase se rejoignent sur ${TYPES[base].nom} : ${CLAUSE_BASE[base]} ` +
      `et, en ce moment, ${CLAUSE_PHASE[phase]} Cette cohérence te donne une grande clarté, ` +
      `à condition de veiller à ne pas t'enfermer dans un seul registre.`
  }
  return `Ta base ${TYPES[base].nom} fait que ${CLAUSE_BASE[base]} ` +
    `Mais ces derniers temps, ta phase ${TYPES[phase].nom} demande autre chose : ${CLAUSE_PHASE[phase]} ` +
    `Comprendre cet écart, c'est comprendre ce qui te porte aujourd'hui sans renier qui tu es au fond.`
}
```
Rédiger les 6 `CLAUSE_BASE`, 6 `CLAUSE_PHASE` et `IMMEUBLE_INTRO` (originaux, étoffés).
Veiller à ce que les clauses s'enchaînent grammaticalement dans les deux gabarits.

- [ ] **Step 5: Lancer → succès**

Run: `pnpm test src/content/interactions.test.ts`
Expected: PASS.

- [ ] **Step 6: Auto-revue + lint + build**

Run: `pnpm lint && pnpm build`
Relire : justesse, fluidité, originalité, accents, enchaînement des clauses.

- [ ] **Step 7: Commit**

```bash
git add src/content/
git commit -m "✨ feat: synthèses textuelles originales (descriptions + interactions)"
```

---

## Task 5: Routeur d'écrans + écran d'intro

**Files:** Create `src/features/intro/IntroScreen.tsx`. Modify `src/App.tsx`, `src/App.test.tsx`.

- [ ] **Step 1: Créer l'écran d'intro**

Create `src/features/intro/IntroScreen.tsx`:
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-3xl font-semibold">process gomme</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <p className="text-muted-foreground">
            Un petit inventaire de personnalité inspiré d'une logique en trois couches —
            ta base (ta manière stable de percevoir le monde), ta phase (ce qui te porte
            en ce moment) et ton immeuble (l'agencement de tes six facettes).
          </p>
          <p className="text-muted-foreground">
            36 questions, environ 5 minutes. Tout reste dans ton navigateur :
            aucune réponse n'est envoyée ni enregistrée.
          </p>
          <Button className="w-fit" onClick={onStart}>
            Commencer
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
```

- [ ] **Step 2: Remplacer `src/App.tsx` par le routeur**

Replace ENTIRE `src/App.tsx` with:
```tsx
import { useReducer } from "react"
import { quizReducer, initialState } from "@/features/quiz/quizReducer"
import { IntroScreen } from "@/features/intro/IntroScreen"
import { QuizScreen } from "@/features/quiz/QuizScreen"
import { ResultsScreen } from "@/features/results/ResultsScreen"

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  if (state.screen === "intro") {
    return <IntroScreen onStart={() => dispatch({ type: "start" })} />
  }
  if (state.screen === "quiz") {
    return <QuizScreen state={state} dispatch={dispatch} />
  }
  return <ResultsScreen answers={state.answers} onRestart={() => dispatch({ type: "restart" })} />
}

export default App
```

> Les imports `QuizScreen` et `ResultsScreen` n'existent pas encore (Tasks 6–8). Cette
> tâche ne compilera entièrement qu'après. Pour garder l'étape testable, on crée des stubs
> minimaux maintenant et on les remplit ensuite.

- [ ] **Step 3: Créer des stubs compilables pour QuizScreen et ResultsScreen**

Create `src/features/quiz/QuizScreen.tsx`:
```tsx
import type { QuizState, Action } from "./quizReducer"

export function QuizScreen({ state, dispatch }: { state: QuizState; dispatch: React.Dispatch<Action> }) {
  return (
    <main className="p-6">
      <p>Quiz — question {state.index + 1}</p>
      <button onClick={() => dispatch({ type: "next" })}>Suivant</button>
    </main>
  )
}
```
Create `src/features/results/ResultsScreen.tsx`:
```tsx
import type { Answers } from "@/lib/scoring"

export function ResultsScreen({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  void answers
  return (
    <main className="p-6">
      <p>Résultats</p>
      <button onClick={onRestart}>Recommencer</button>
    </main>
  )
}
```

- [ ] **Step 4: Mettre à jour `src/App.test.tsx`**

Replace ENTIRE `src/App.test.tsx` with:
```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import App from "./App"

describe("App", () => {
  it("affiche l'écran d'intro avec un bouton Commencer", () => {
    render(<App />)
    expect(screen.getByRole("heading", { name: /process gomme/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /commencer/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Tests + build**

Run: `pnpm test src/App.test.tsx && pnpm build`
Expected: PASS + build OK.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/features/intro src/features/quiz/QuizScreen.tsx src/features/results/ResultsScreen.tsx
git commit -m "✨ feat: routeur d'écrans + écran d'intro (stubs quiz/résultats)"
```

---

## Task 6: Écran de quiz (ForcedChoice + LikertScale + QuizScreen)

**Files:** Create `src/features/quiz/ForcedChoice.tsx`, `src/features/quiz/LikertScale.tsx`. Replace `src/features/quiz/QuizScreen.tsx`. Create `src/features/quiz/QuizScreen.test.tsx`.

- [ ] **Step 1: `ForcedChoice.tsx`**

Create `src/features/quiz/ForcedChoice.tsx`:
```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ForcedChoice as ForcedQuestion } from "@/data/questions"
import type { TypeId } from "@/data/types"

export function ForcedChoice({
  question,
  valeur,
  onChange,
}: {
  question: ForcedQuestion
  valeur: TypeId | undefined
  onChange: (cible: TypeId) => void
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-lg font-medium">{question.prompt}</legend>
      <RadioGroup value={valeur ?? ""} onValueChange={(v) => onChange(v as TypeId)}>
        {question.options.map((opt, i) => {
          const id = `${question.id}-${i}`
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent"
            >
              <RadioGroupItem id={id} value={opt.cible} />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </RadioGroup>
    </fieldset>
  )
}
```

- [ ] **Step 2: `LikertScale.tsx`**

Create `src/features/quiz/LikertScale.tsx`:
```tsx
import { Slider } from "@/components/ui/slider"
import type { Likert as LikertQuestion } from "@/data/questions"

export function LikertScale({
  question,
  valeur,
  onChange,
}: {
  question: LikertQuestion
  valeur: number
  onChange: (valeur: 1 | 2 | 3 | 4 | 5) => void
}) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="mb-1 text-lg font-medium">{question.statement}</legend>
      <Slider
        min={1}
        max={5}
        step={1}
        value={[valeur]}
        onValueChange={([v]) => onChange(v as 1 | 2 | 3 | 4 | 5)}
        aria-label="Niveau d'accord de 1 à 5"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Pas du tout</span>
        <span>Tout à fait</span>
      </div>
    </fieldset>
  )
}
```

- [ ] **Step 3: Replace `QuizScreen.tsx` (Progress + transition motion + nav)**

Replace ENTIRE `src/features/quiz/QuizScreen.tsx` with:
```tsx
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QUESTIONS } from "@/data/questions"
import type { QuizState, Action } from "./quizReducer"
import { ForcedChoice } from "./ForcedChoice"
import { LikertScale } from "./LikertScale"

export function QuizScreen({
  state,
  dispatch,
}: {
  state: QuizState
  dispatch: React.Dispatch<Action>
}) {
  const reduce = useReducedMotion()
  const q = QUESTIONS[state.index]
  const reponse = state.answers[q.id]
  const total = QUESTIONS.length
  const forcedManquant = q.kind === "forced" && !reponse

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <Progress value={((state.index + 1) / total) * 100} />
        <p className="text-sm text-muted-foreground">
          Question {state.index + 1} / {total}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          {q.kind === "forced" ? (
            <ForcedChoice
              question={q}
              valeur={reponse?.kind === "forced" ? reponse.cible : undefined}
              onChange={(cible) =>
                dispatch({ type: "answer", id: q.id, answer: { kind: "forced", cible } })
              }
            />
          ) : (
            <LikertScale
              question={q}
              valeur={reponse?.kind === "likert" ? reponse.valeur : 3}
              onChange={(valeur) =>
                dispatch({ type: "answer", id: q.id, answer: { kind: "likert", valeur } })
              }
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "prev" })}
          disabled={state.index === 0}
        >
          Précédent
        </Button>
        <Button onClick={() => dispatch({ type: "next" })} disabled={forcedManquant}>
          {state.index === total - 1 ? "Voir mes résultats" : "Suivant"}
        </Button>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Test composant du quiz**

Create `src/features/quiz/QuizScreen.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { QuizScreen } from "./QuizScreen"
import { QUESTIONS } from "@/data/questions"

const premierForced = QUESTIONS.findIndex((q) => q.kind === "forced")

describe("QuizScreen", () => {
  it("désactive « Suivant » tant qu'un choix forcé n'est pas répondu", async () => {
    const dispatch = vi.fn()
    render(
      <QuizScreen state={{ screen: "quiz", index: premierForced, answers: {} }} dispatch={dispatch} />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeDisabled()
  })

  it("active « Suivant » une fois le choix forcé répondu", () => {
    const q = QUESTIONS[premierForced]
    const dispatch = vi.fn()
    const cible = q.kind === "forced" ? q.options[0].cible : "travaillomane"
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierForced, answers: { [q.id]: { kind: "forced", cible } } }}
        dispatch={dispatch}
      />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeEnabled()
  })

  it("dispatch next au clic sur Suivant (réponse présente)", async () => {
    const user = userEvent.setup()
    const q = QUESTIONS[premierForced]
    const dispatch = vi.fn()
    const cible = q.kind === "forced" ? q.options[0].cible : "travaillomane"
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierForced, answers: { [q.id]: { kind: "forced", cible } } }}
        dispatch={dispatch}
      />,
    )
    await user.click(screen.getByRole("button", { name: /suivant|résultats/i }))
    expect(dispatch).toHaveBeenCalledWith({ type: "next" })
  })
})
```
Install the user-event helper if missing: `pnpm add -D @testing-library/user-event`.

- [ ] **Step 5: Tests + build**

Run: `pnpm test src/features/quiz && pnpm build`
Expected: PASS + build OK.

- [ ] **Step 6: Commit**

```bash
git add src/features/quiz package.json pnpm-lock.yaml
git commit -m "✨ feat: écran de quiz (RadioGroup, Slider, Progress, transitions)"
```

---

## Task 7: Visuels des résultats (Immeuble animé + Radar)

**Files:** Create `src/features/results/Immeuble.tsx`, `src/features/results/RadarProfil.tsx`.

- [ ] **Step 1: `Immeuble.tsx` (pyramide, largeur ∝ score, construction animée)**

Create `src/features/results/Immeuble.tsx`:
```tsx
import { motion, useReducedMotion } from "motion/react"
import { TYPES, type TypeId } from "@/data/types"

export function Immeuble({
  immeuble,
  socle,
  phase,
}: {
  immeuble: TypeId[]
  socle: Record<TypeId, number>
  phase: TypeId
}) {
  const reduce = useReducedMotion()
  const max = Math.max(...immeuble.map((t) => socle[t]), 1)
  // `immeuble` est trié décroissant (index 0 = base, score max). On l'affiche en ascendant
  // pour que la base (score max) se retrouve EN BAS de la pile.
  const ordreAffichage = [...immeuble].reverse() // ascendant : dernier = base, tout en bas
  const n = ordreAffichage.length

  return (
    <div className="flex flex-col items-center gap-1.5" aria-label="Ton immeuble">
      {ordreAffichage.map((t, i) => {
        const largeur = 30 + (socle[t] / max) * 70 // 30%..100%
        const estPhase = t === phase
        // Construction de bas en haut : la base (i = n-1, tout en bas) apparaît en premier.
        const delai = reduce ? 0 : (n - 1 - i) * 0.12
        return (
          <motion.div
            key={t}
            initial={reduce ? false : { width: 0, opacity: 0 }}
            animate={{ width: `${largeur}%`, opacity: 1 }}
            transition={{ delay: delai, duration: 0.4, ease: "easeOut" }}
            className={`flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-primary-foreground ${
              estPhase ? "bg-primary ring-2 ring-offset-2 ring-amber-500" : "bg-muted-foreground"
            }`}
          >
            <span className="truncate">{TYPES[t].nom}</span>
            <span className="tabular-nums opacity-80">{Math.round(socle[t])}%</span>
          </motion.div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: `RadarProfil.tsx` (Recharts)**

Create `src/features/results/RadarProfil.tsx`:
```tsx
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { TYPE_IDS, TYPES, type TypeId } from "@/data/types"

export function RadarProfil({ socle }: { socle: Record<TypeId, number> }) {
  const data = TYPE_IDS.map((t) => ({ type: TYPES[t].nom, score: Math.round(socle[t]) }))
  return (
    <div className="h-64 w-full" aria-label="Radar de ton profil">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="type" tick={{ fontSize: 11 }} />
          <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 3: Build (vérifie Recharts + motion)**

Run: `pnpm build`
Expected: OK. (Les composants ne sont pas encore montés — câblage en Task 8.)

- [ ] **Step 4: Commit**

```bash
git add src/features/results/Immeuble.tsx src/features/results/RadarProfil.tsx
git commit -m "✨ feat: immeuble animé (pyramide) + radar des 6 scores"
```

---

## Task 8: Synthèse + écran de résultats (split) + câblage

**Files:** Create `src/features/results/Synthese.tsx`. Replace `src/features/results/ResultsScreen.tsx`.

- [ ] **Step 1: `Synthese.tsx` (sections titrées)**

Create `src/features/results/Synthese.tsx`:
```tsx
import { TYPES, type TypeId } from "@/data/types"
import { DESCRIPTIONS } from "@/content/descriptions"
import { IMMEUBLE_INTRO, composeInteraction } from "@/content/interactions"
import type { ScoreResult } from "@/lib/scoring"

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">{titre}</h2>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export function Synthese({ result }: { result: ScoreResult }) {
  const { base, phase, immeuble } = result
  return (
    <div className="flex flex-col gap-8">
      <Section titre={`Ta base — ${TYPES[base].nom}`}>{DESCRIPTIONS[base].base}</Section>
      <Section titre={`Ta phase — ${TYPES[phase].nom}`}>{DESCRIPTIONS[phase].phase}</Section>
      <Section titre="Ton immeuble">
        <p>{IMMEUBLE_INTRO}</p>
        <ol className="mt-2 list-decimal pl-5">
          {immeuble.map((t: TypeId) => (
            <li key={t}>
              {TYPES[t].nom} — {Math.round(result.socle[t])}%
            </li>
          ))}
        </ol>
      </Section>
      <Section titre="Interactions base × phase">{composeInteraction(base, phase)}</Section>
    </div>
  )
}
```

- [ ] **Step 2: Replace `ResultsScreen.tsx` (split layout + computeResult)**

Replace ENTIRE `src/features/results/ResultsScreen.tsx` with:
```tsx
import { Button } from "@/components/ui/button"
import { computeResult, type Answers } from "@/lib/scoring"
import { Immeuble } from "./Immeuble"
import { RadarProfil } from "./RadarProfil"
import { Synthese } from "./Synthese"

export function ResultsScreen({
  answers,
  onRestart,
}: {
  answers: Answers
  onRestart: () => void
}) {
  const result = computeResult(answers)
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex w-full flex-col gap-8 md:sticky md:top-6 md:w-[38%]">
          <Immeuble immeuble={result.immeuble} socle={result.socle} phase={result.phase} />
          <RadarProfil socle={result.socle} />
        </div>
        <div className="w-full md:flex-1">
          <Synthese result={result} />
          <Button variant="outline" className="mt-8" onClick={onRestart}>
            Recommencer le test
          </Button>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Tests + lint + build**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: tout vert (App.test rend toujours l'intro ; le reste compile).

- [ ] **Step 4: Commit**

```bash
git add src/features/results
git commit -m "✨ feat: écran de résultats (split immeuble + radar + synthèse)"
```

---

## Task 9: Accessibilité, responsive & reduced-motion — vérification

**Files:** ajustements ponctuels si nécessaire dans les composants de Task 6–8.

- [ ] **Step 1: Vérifier `prefers-reduced-motion`**

`QuizScreen` et `Immeuble` utilisent `useReducedMotion()` : confirmer que sous
`prefers-reduced-motion: reduce`, les transitions sont neutralisées (pas de slide, pas de
montée de largeur animée — apparition directe). Si un composant anime encore, le corriger
pour rendre l'état final immédiatement quand `reduce` est vrai.

- [ ] **Step 2: Focus clavier visible**

Vérifier que les `RadioGroupItem`, le `Slider` et les `Button` exposent un anneau de focus
visible au clavier (les composants shadcn le fournissent par défaut via `focus-visible`).
Naviguer au clavier sur une question forcée et une question Likert.

- [ ] **Step 3: Responsive**

`pnpm dev` puis vérifier en largeur mobile que le split passe en colonne (visuels au-dessus
du texte) et que la pyramide/radar restent lisibles. Ajuster les classes si débordement.

- [ ] **Step 4: Build + commit (si ajustements)**

```bash
pnpm lint && pnpm build
git add -A
git commit -m "💄 a11y: focus clavier, responsive et reduced-motion vérifiés"
```
(Si aucun ajustement nécessaire, ne pas créer de commit vide — passer à la Task 10.)

---

## Task 10: E2E + vérification finale + push

**Files:** Replace `e2e/smoke.spec.ts`.

- [ ] **Step 1: Réécrire le test e2e (parcours complet)**

Replace ENTIRE `e2e/smoke.spec.ts` with:
```ts
import { test, expect } from "@playwright/test"

test("parcours complet : intro → quiz → résultats", async ({ page }) => {
  await page.goto("/process-gomme/")

  // Intro
  await expect(page.getByRole("heading", { name: /process gomme/i })).toBeVisible()
  await page.getByRole("button", { name: /commencer/i }).click()

  // Quiz : répondre aux 36 questions.
  for (let i = 0; i < 36; i++) {
    const suivant = page.getByRole("button", { name: /suivant|résultats/i })
    // Si un choix forcé est présent, sélectionner la 1re option (sinon c'est un Likert, déjà à 3).
    const radios = page.getByRole("radio")
    if (await radios.first().isVisible().catch(() => false)) {
      await radios.first().click()
    }
    await expect(suivant).toBeEnabled()
    await suivant.click()
  }

  // Résultats
  await expect(page.getByRole("heading", { name: /ta base/i })).toBeVisible()
  await expect(page.getByLabel(/ton immeuble/i)).toBeVisible()
  await expect(page.getByRole("button", { name: /recommencer/i })).toBeVisible()
})
```

- [ ] **Step 2: Lancer l'e2e**

Run: `pnpm test:e2e`
Expected: PASS (parcours complet vert). Si un sélecteur ne matche pas, ajuster le test au
DOM réel (ne pas modifier l'app pour faire passer un test mal ciblé).

- [ ] **Step 3: Vérification complète**

```bash
pnpm test && pnpm lint && pnpm build && pnpm test:e2e
```
Expected: tout vert.

- [ ] **Step 4: Commit + push**

```bash
git add e2e/smoke.spec.ts
git commit -m "✅ test: e2e du parcours complet intro → quiz → résultats"
git push origin main
```
Puis suivre la CI : `gh run watch` → workflow vert, déploiement Pages effectué.

- [ ] **Step 5: Vérifier la prod**

Ouvrir `https://owlnext-fr.github.io/process-gomme/` : faire le parcours, vérifier
l'animation de l'immeuble, le radar, la synthèse, le responsive mobile.

- [ ] **Step 6: STOP — bilan avec Adrien**

Le Bloc 3 (et le projet) est terminé. Présenter le résultat en prod pour validation finale.

---

## Notes d'exécution

- **ULTRATHINK** sur la Task 4 : la qualité des synthèses fait l'expérience finale.
- L'animation de l'immeuble est le moment signature — soigner le timing étage par étage ;
  garder le reste sobre.
- `motion` : si `motion/react` ne résout pas, basculer tous les imports sur `framer-motion`
  (même API) et le noter.
- Couleurs : s'appuyer sur les variables du thème shadcn (`--primary`, `--muted-foreground`,
  etc.) ; l'accent « phase » utilise un ring ambré — ajuster si le thème neutre rend mal.
- Ne jamais modifier `src/data/` (contenu validé au Bloc 2) ni les invariants testés.
```
