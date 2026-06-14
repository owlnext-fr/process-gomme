# Partage de la page de résultats par URL — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettre de partager son profil via une URL `?r=<code>` (bouton « Partager » qui copie le lien + feedback), et reconstruire la page de résultats à l'ouverture d'un tel lien.

**Architecture:** On encode `socle` (6 scores arrondis) + `phase` en base64url. `App` décide de la source du résultat (réponses locales via `computeResult`, ou décodage de l'URL) et passe un `DisplayResult = Omit<ScoreResult, "motivation">` à `ResultsScreen`, qui ne calcule plus. `base`/`immeuble` sont redérivés de `socle` via un helper partagé `deriveFromSocle`. Zéro nouvelle dépendance.

**Tech Stack:** React + TypeScript, Vite (`import.meta.env.BASE_URL`), Clipboard API + `URLSearchParams`/`history` natifs, lucide-react, Vitest + @testing-library/react.

---

## Contexte pour l'implémenteur

- `src/lib/scoring.ts` contient `computeResult(answers): ScoreResult` (lignes 38-62) avec, à la fin, la dérivation `base = argmax(socle)` et le tri `immeuble`. On extrait cette dérivation dans `deriveFromSocle` pour la réutiliser au décodage.
- `ScoreResult` = `{ socle, motivation: Record<TypeId, number>; base, phase: TypeId; immeuble: TypeId[]; baseEgalePhase: boolean }`. `motivation` n'est **jamais affiché** (vérifié : seul `scoring.ts` et les tests le lisent).
- `TYPE_IDS` (ordre canonique des 6 types) est exporté par `src/data/types.ts`.
- `ResultsScreen` reçoit aujourd'hui `answers` et appelle `computeResult` lui-même (`src/features/results/ResultsScreen.tsx:22`). On déplace ce calcul dans `App`.
- `RadarProfil` est chargé en lazy + `Suspense` dans `ResultsScreen` — ne pas y toucher.
- Tests : `pnpm test -- <chemin>` (un fichier), `pnpm test` (tout). Gate complet : `pnpm before_push`.
- Les tests existants utilisent `render`/`screen`/`fireEvent` de `@testing-library/react` et les matchers jest-dom (`toBeInTheDocument`) — setup déjà en place.

## File Structure

- **Modify:** `src/lib/scoring.ts` — ajoute `export type DisplayResult` + `export function deriveFromSocle`; `computeResult` réutilise le helper.
- **Create:** `src/lib/shareCode.ts` — `encodeResult`, `decodeResult`, `readSharedFromLocation` (encodage/URL).
- **Create:** `src/lib/shareCode.test.ts` — round-trip + validation.
- **Create:** `src/components/ShareButton.tsx` — bouton copie + état « copié ».
- **Create:** `src/components/ShareButton.test.tsx`.
- **Modify:** `src/features/results/Synthese.tsx` — type `DisplayResult`.
- **Modify:** `src/features/results/ResultsScreen.tsx` — props `result`/`shared`, `ShareButton`, bandeau.
- **Modify:** `src/App.tsx` — calcule/décode le résultat, route le mode partagé.
- **Modify:** `src/App.test.tsx` — cas `?r=` valide/invalide.

---

## Task 1: `DisplayResult` + helper `deriveFromSocle` (refactor scoring)

**Files:**
- Modify: `src/lib/scoring.ts`
- Test: `src/lib/scoring.test.ts`

- [ ] **Step 1: Write the failing test**

Ajoute ce bloc à la fin de `src/lib/scoring.test.ts` (garde les imports existants ; ajoute `deriveFromSocle` et `TYPE_IDS`/`TypeId` aux imports si absents) :

```ts
import { deriveFromSocle } from "./scoring"
import { TYPE_IDS, type TypeId } from "@/data/types"

describe("deriveFromSocle", () => {
  it("dérive base = max et immeuble = tri décroissant (tie-break canonique)", () => {
    const socle: Record<TypeId, number> = {
      travaillomane: 30,
      perseverant: 30,
      empathique: 20,
      reveur: 10,
      rebelle: 6,
      promoteur: 4,
    }
    const { base, immeuble } = deriveFromSocle(socle)
    expect(base).toBe("travaillomane")
    expect(immeuble).toEqual([
      "travaillomane",
      "perseverant",
      "empathique",
      "reveur",
      "rebelle",
      "promoteur",
    ])
    // tie-break : travaillomane (index 0) passe avant perseverant à score égal
    expect(TYPE_IDS.indexOf(base)).toBeLessThan(TYPE_IDS.indexOf("perseverant"))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/lib/scoring.test.ts`
Expected: FAIL (`deriveFromSocle` n'existe pas / import non résolu).

- [ ] **Step 3: Modify `scoring.ts`**

Ajoute le type `DisplayResult` après l'interface `ScoreResult` :

```ts
export type DisplayResult = Omit<ScoreResult, "motivation">
```

Ajoute le helper (après `argmax`, avant `computeResult`) :

```ts
export function deriveFromSocle(socle: Record<TypeId, number>): {
  base: TypeId
  immeuble: TypeId[]
} {
  const base = argmax(socle)
  const immeuble = [...TYPE_IDS].sort(
    (a, b) => socle[b] - socle[a] || TYPE_IDS.indexOf(a) - TYPE_IDS.indexOf(b),
  )
  return { base, immeuble }
}
```

Remplace dans `computeResult` les lignes qui calculent `base` et `immeuble` :

```ts
  const socle = normaliser(socleRaw)
  const motivation = normaliser(motivationRaw)
  const { base, immeuble } = deriveFromSocle(socle)
  const phase = argmax(motivation)

  return { socle, motivation, base, phase, immeuble, baseEgalePhase: base === phase }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- src/lib/scoring.test.ts`
Expected: PASS (anciens tests `computeResult` + nouveau `deriveFromSocle`).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring.ts src/lib/scoring.test.ts
git commit -m "♻️ refactor: extraire deriveFromSocle + type DisplayResult"
```

---

## Task 2: Encodage / décodage de l'URL (`shareCode.ts`)

**Files:**
- Create: `src/lib/shareCode.ts`
- Test: `src/lib/shareCode.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/shareCode.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { encodeResult, decodeResult } from "./shareCode"
import type { DisplayResult } from "./scoring"
import type { TypeId } from "@/data/types"

const socle: Record<TypeId, number> = {
  travaillomane: 34,
  perseverant: 22,
  empathique: 18,
  reveur: 12,
  rebelle: 8,
  promoteur: 6,
}

const result: DisplayResult = {
  socle,
  base: "travaillomane",
  phase: "empathique",
  immeuble: [
    "travaillomane",
    "perseverant",
    "empathique",
    "reveur",
    "rebelle",
    "promoteur",
  ],
  baseEgalePhase: false,
}

describe("shareCode", () => {
  it("round-trip : decode(encode(x)) reconstruit socle, phase, base et immeuble", () => {
    const decoded = decodeResult(encodeResult(result))
    expect(decoded).not.toBeNull()
    expect(decoded!.socle).toEqual(socle)
    expect(decoded!.phase).toBe("empathique")
    expect(decoded!.base).toBe("travaillomane")
    expect(decoded!.immeuble).toEqual(result.immeuble)
    expect(decoded!.baseEgalePhase).toBe(false)
  })

  it("produit un code URL-safe (pas de + / =)", () => {
    expect(encodeResult(result)).not.toMatch(/[+/=]/)
  })

  it("renvoie null sur un code invalide", () => {
    expect(decodeResult("")).toBeNull()
    expect(decodeResult("!!!pas-du-base64!!!")).toBeNull()
    expect(decodeResult(btoa(JSON.stringify({ s: [1, 2, 3], p: 0 })))).toBeNull() // mauvaise taille
    expect(decodeResult(btoa(JSON.stringify({ s: [0, 0, 0, 0, 0, 0], p: 9 })))).toBeNull() // p hors borne
    expect(
      decodeResult(btoa(JSON.stringify({ s: [0, 0, 0, 0, 0, 200], p: 0 }))),
    ).toBeNull() // score hors borne
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/lib/shareCode.test.ts`
Expected: FAIL (`./shareCode` introuvable).

- [ ] **Step 3: Write `shareCode.ts`**

Create `src/lib/shareCode.ts`:

```ts
import { TYPE_IDS, type TypeId } from "@/data/types"
import { deriveFromSocle, type DisplayResult } from "./scoring"

/** Encode un résultat en code URL-safe (base64url d'un JSON { s, p }). */
export function encodeResult(result: DisplayResult): string {
  const s = TYPE_IDS.map((t) => Math.round(result.socle[t]))
  const p = TYPE_IDS.indexOf(result.phase)
  const json = JSON.stringify({ s, p })
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/** Décode + valide strictement un code ; null si invalide. */
export function decodeResult(code: string): DisplayResult | null {
  if (!code) return null
  try {
    let b64 = code.replace(/-/g, "+").replace(/_/g, "/")
    while (b64.length % 4) b64 += "=" // ré-ajoute le padding retiré à l'encodage
    const obj = JSON.parse(atob(b64)) as unknown
    if (typeof obj !== "object" || obj === null) return null
    const { s, p } = obj as { s?: unknown; p?: unknown }
    if (!Array.isArray(s) || s.length !== 6) return null
    if (!Number.isInteger(p) || (p as number) < 0 || (p as number) > 5) return null
    for (const n of s) {
      if (!Number.isInteger(n) || n < 0 || n > 100) return null
    }
    const socle = {} as Record<TypeId, number>
    TYPE_IDS.forEach((t, i) => {
      socle[t] = s[i] as number
    })
    const phase = TYPE_IDS[p as number]
    const { base, immeuble } = deriveFromSocle(socle)
    return { socle, base, phase, immeuble, baseEgalePhase: base === phase }
  } catch {
    return null
  }
}

/** Lit le param `?r=` de l'URL courante ; null si absent ou invalide. */
export function readSharedFromLocation(): DisplayResult | null {
  const code = new URLSearchParams(window.location.search).get("r")
  return code ? decodeResult(code) : null
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/lib/shareCode.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/shareCode.ts src/lib/shareCode.test.ts
git commit -m "✨ feat: encodage/décodage du profil dans l'URL (shareCode)"
```

---

## Task 3: Bouton « Partager » (`ShareButton`)

**Files:**
- Create: `src/components/ShareButton.tsx`
- Test: `src/components/ShareButton.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ShareButton.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ShareButton } from "./ShareButton"
import { encodeResult } from "@/lib/shareCode"
import type { DisplayResult } from "@/lib/scoring"
import type { TypeId } from "@/data/types"

const socle: Record<TypeId, number> = {
  travaillomane: 34,
  perseverant: 22,
  empathique: 18,
  reveur: 12,
  rebelle: 8,
  promoteur: 6,
}
const result: DisplayResult = {
  socle,
  base: "travaillomane",
  phase: "empathique",
  immeuble: [
    "travaillomane",
    "perseverant",
    "empathique",
    "reveur",
    "rebelle",
    "promoteur",
  ],
  baseEgalePhase: false,
}

const writeText = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  writeText.mockClear()
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  })
})

describe("ShareButton", () => {
  it("copie l'URL contenant le code et affiche « Lien copié »", async () => {
    render(<ShareButton result={result} />)
    fireEvent.click(screen.getByRole("button", { name: /partager/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1)
    })
    const url = writeText.mock.calls[0][0] as string
    expect(url).toContain("?r=" + encodeResult(result))
    expect(await screen.findByText(/lien copié/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/components/ShareButton.test.tsx`
Expected: FAIL (`./ShareButton` introuvable).

- [ ] **Step 3: Write `ShareButton.tsx`**

Create `src/components/ShareButton.tsx`:

```tsx
import { useEffect, useRef, useState } from "react"
import { Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { encodeResult } from "@/lib/shareCode"
import type { DisplayResult } from "@/lib/scoring"

type Status = "idle" | "copied" | "error"

export function ShareButton({ result }: { result: DisplayResult }) {
  const [status, setStatus] = useState<Status>("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function handleShare() {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin)
    url.search = "?r=" + encodeResult(result)
    try {
      await navigator.clipboard.writeText(url.toString())
      setStatus("copied")
    } catch {
      setStatus("error")
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus("idle"), 2000)
  }

  const label =
    status === "copied"
      ? "Lien copié"
      : status === "error"
        ? "Copie impossible"
        : "Partager"

  return (
    <Button variant="outline" onClick={handleShare} aria-live="polite">
      {status === "copied" ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Share2 className="size-4" aria-hidden />
      )}
      {label}
    </Button>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/components/ShareButton.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/ShareButton.tsx src/components/ShareButton.test.tsx
git commit -m "✨ feat: bouton Partager (copie l'URL + feedback)"
```

---

## Task 4: Brancher l'affichage sur `DisplayResult` (Synthese, ResultsScreen, App flux normal)

**Files:**
- Modify: `src/features/results/Synthese.tsx`
- Modify: `src/features/results/ResultsScreen.tsx`
- Modify: `src/App.tsx`

> Refactor de types + câblage UI. Vérifié par `pnpm build` (tsc) + tests existants. Le flux URL est ajouté en Task 5.

- [ ] **Step 1: Passer `Synthese` à `DisplayResult`**

Dans `src/features/results/Synthese.tsx`, change l'import de type et la signature :

```tsx
import type { DisplayResult } from "@/lib/scoring"
```

```tsx
export function Synthese({ result }: { result: DisplayResult }) {
```

(Le reste du composant est inchangé : il n'utilise que `base`/`phase`/`immeuble`/`socle`.)

- [ ] **Step 2: Refondre `ResultsScreen`**

Remplace l'intégralité de `src/features/results/ResultsScreen.tsx` par :

```tsx
import { lazy, Suspense } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ShareButton"
import type { DisplayResult } from "@/lib/scoring"
import { TYPES } from "@/data/types"
import { Immeuble } from "./Immeuble"
import { Synthese } from "./Synthese"

const RadarProfil = lazy(() =>
  import("./RadarProfil").then((m) => ({ default: m.RadarProfil })),
)

export function ResultsScreen({
  result,
  shared = false,
  onRestart,
}: {
  result: DisplayResult
  shared?: boolean
  onRestart: () => void
}) {
  return (
    <main className="min-h-svh w-full p-6 md:p-10">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Tes résultats</h1>
        <div className="flex gap-2">
          <ShareButton result={result} />
          {!shared && (
            <Button variant="outline" onClick={onRestart}>
              <RotateCcw className="size-4" aria-hidden />
              Recommencer
            </Button>
          )}
        </div>
      </header>

      {shared && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm text-muted-foreground">
            Tu regardes un profil partagé.
          </p>
          <Button onClick={onRestart}>Faire mon test</Button>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-100 p-5">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Ta base · ta phase
        </p>
        <p className="mt-1 text-xl font-semibold text-primary">
          {TYPES[result.base].nom} · {TYPES[result.phase].nom}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex w-full flex-col gap-8 md:sticky md:top-6 md:w-[38%]">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Ton immeuble</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Tes six facettes empilées de la plus marquée (en bas) à la plus discrète.
              La largeur reflète l'intensité ; l'étage encadré est ta phase actuelle.
            </p>
            <Immeuble immeuble={result.immeuble} socle={result.socle} phase={result.phase} />
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Ton profil en relief</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              La même information vue d'ensemble : plus une branche s'étire, plus la
              facette correspondante pèse dans ta manière de fonctionner.
            </p>
            <Suspense fallback={<div className="h-80 w-full" aria-label="Radar de ton profil" />}>
              <RadarProfil socle={result.socle} />
            </Suspense>
          </section>
        </div>
        <div className="w-full md:flex-1">
          <div className="rounded-xl border bg-card p-6 md:p-8">
            <Synthese result={result} />
          </div>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Mettre à jour `App.tsx` (flux normal)**

Dans `src/App.tsx`, importe `computeResult` et passe un `result` calculé :

```tsx
import { useReducer } from "react"
import { quizReducer, initialState } from "@/features/quiz/quizReducer"
import { computeResult } from "@/lib/scoring"
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
  return (
    <ResultsScreen
      result={computeResult(state.answers)}
      onRestart={() => dispatch({ type: "restart" })}
    />
  )
}

export default App
```

- [ ] **Step 4: Vérifier build + tests**

Run: `pnpm build && pnpm test`
Expected: build OK (types cohérents) ; tous les tests passent (dont `Synthese.test.tsx`, `App.test.tsx`).

- [ ] **Step 5: Commit**

```bash
git add src/features/results/Synthese.tsx src/features/results/ResultsScreen.tsx src/App.tsx
git commit -m "♻️ refactor: ResultsScreen reçoit un DisplayResult + bouton Partager + bandeau"
```

---

## Task 5: Routing du mode partagé (`App` lit `?r=`)

**Files:**
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing test**

Remplace `src/App.test.tsx` par :

```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect, afterEach } from "vitest"
import App from "./App"
import { encodeResult } from "@/lib/shareCode"
import type { DisplayResult } from "@/lib/scoring"
import type { TypeId } from "@/data/types"

const socle: Record<TypeId, number> = {
  travaillomane: 34,
  perseverant: 22,
  empathique: 18,
  reveur: 12,
  rebelle: 8,
  promoteur: 6,
}
const result: DisplayResult = {
  socle,
  base: "travaillomane",
  phase: "empathique",
  immeuble: [
    "travaillomane",
    "perseverant",
    "empathique",
    "reveur",
    "rebelle",
    "promoteur",
  ],
  baseEgalePhase: false,
}

afterEach(() => {
  window.history.replaceState({}, "", "/")
})

describe("App", () => {
  it("affiche l'écran d'intro avec un bouton Commencer", () => {
    render(<App />)
    expect(screen.getByRole("heading", { name: /process gomme/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /commencer/i })).toBeInTheDocument()
  })

  it("ouvre directement les résultats partagés quand ?r= est valide", () => {
    window.history.pushState({}, "", "?r=" + encodeResult(result))
    render(<App />)
    expect(screen.getByRole("heading", { name: /tes résultats/i })).toBeInTheDocument()
    expect(screen.getByText(/profil partagé/i)).toBeInTheDocument()
  })

  it("ignore un ?r= invalide et affiche l'intro", () => {
    window.history.pushState({}, "", "?r=corrompu!!!")
    render(<App />)
    expect(screen.getByRole("button", { name: /commencer/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/App.test.tsx`
Expected: FAIL (le cas « ?r= valide » ne trouve pas « Tes résultats » : App ne lit pas encore l'URL).

- [ ] **Step 3: Modify `App.tsx`**

Remplace `src/App.tsx` par :

```tsx
import { useReducer, useState } from "react"
import { quizReducer, initialState } from "@/features/quiz/quizReducer"
import { computeResult } from "@/lib/scoring"
import { readSharedFromLocation } from "@/lib/shareCode"
import { IntroScreen } from "@/features/intro/IntroScreen"
import { QuizScreen } from "@/features/quiz/QuizScreen"
import { ResultsScreen } from "@/features/results/ResultsScreen"

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState)
  const [shared, setShared] = useState(() => readSharedFromLocation())

  if (shared) {
    return (
      <ResultsScreen
        result={shared}
        shared
        onRestart={() => {
          window.history.replaceState({}, "", import.meta.env.BASE_URL)
          setShared(null)
        }}
      />
    )
  }

  if (state.screen === "intro") {
    return <IntroScreen onStart={() => dispatch({ type: "start" })} />
  }
  if (state.screen === "quiz") {
    return <QuizScreen state={state} dispatch={dispatch} />
  }
  return (
    <ResultsScreen
      result={computeResult(state.answers)}
      onRestart={() => dispatch({ type: "restart" })}
    />
  )
}

export default App
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/App.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "✨ feat: ouverture directe d'un profil partagé via ?r="
```

---

## Task 6: Vérification globale + documentation mémoire

**Files:**
- Modify: `docs/QUIRKS.md`, `docs/INDEX.md`, `docs/HANDOFF.md`, `docs/ENVIRONMENT.md`

- [ ] **Step 1: Gate complet**

Run: `pnpm before_push`
Expected: lint + unit + build + e2e tous verts.

- [ ] **Step 2: Vérification manuelle rapide (optionnel mais recommandé)**

Run: `pnpm dev`, finir un test, cliquer « Partager », coller l'URL dans un nouvel onglet → la page de résultats s'ouvre avec le bandeau « profil partagé », même pyramide/radar.

- [ ] **Step 3: Documenter dans QUIRKS**

Ajoute dans `docs/QUIRKS.md` : « Le partage encode uniquement `socle` + `phase` dans `?r=` (base64url). `base`/`immeuble` sont redérivés via `deriveFromSocle` ; `motivation` n'est pas dans le lien (jamais affiché). Construire l'URL avec `import.meta.env.BASE_URL` (base path GH Pages `/process-gomme/`), sinon le lien casse en prod. »

- [ ] **Step 4: Mettre à jour INDEX, HANDOFF, ENVIRONMENT**

- `docs/INDEX.md` : ligne feature « Partage de la page de résultats par URL » avec liens spec/plan.
- `docs/HANDOFF.md` : entrée datée 2026-06-14 (Dernière chose faite / Trucs en suspens / Prochaine chose à creuser / Notes pour future Claude).
- `docs/ENVIRONMENT.md` : noter le param d'URL `?r=<code>` comme surface publique de l'app.

- [ ] **Step 5: Commit + push**

```bash
git add docs/
git commit -m "📝 docs: mémoire à jour (partage de résultats par URL)"
git push
```

---

## Notes de revue

- **DRY** : le tri `socle → {base, immeuble}` vit dans `deriveFromSocle`, utilisé par `computeResult` ET `decodeResult` (zéro duplication, profil partagé garanti identique).
- **YAGNI** : pas d'Open Graph, pas de `navigator.share`, pas de versionnement du code, pas de fallback `execCommand`.
- **Robustesse** : `decodeResult` valide strictement (taille, bornes) → code corrompu = intro. URL construite avec `BASE_URL` pour GH Pages.
- **Accessibilité** : `ShareButton` a `aria-live="polite"` ; icônes `aria-hidden`.
