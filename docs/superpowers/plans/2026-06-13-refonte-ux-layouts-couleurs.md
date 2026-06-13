# Refonte UX (layouts 1/3-2/3 + page résultats C + thème indigo) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Donner structure (layouts 1/3-2/3, page résultats en-tête + bandeau + colonne sticky) et couleur (thème « Indigo & pastels ») aux trois écrans, sans toucher au moteur de scoring ni au contenu du test.

**Architecture :** Recoloration par les tokens CSS (`src/index.css`) + une source unique `TYPE_COLORS` (6 couleurs, une par type) consommée par radar, pyramide et panneau d'explications. Deux nouveaux composants réutilisables (`SplitLayout`, `ProfilExplainer`) ; les trois écrans sont recomposés autour d'eux. La logique (`lib/scoring.ts`, reducer, `data/`) est inchangée.

**Tech Stack :** Vite, React, TypeScript, Tailwind v4, shadcn/ui, Recharts, Framer Motion (`motion`), lucide-react, Vitest, Playwright.

---

## Référence — design validé

Spec : `docs/superpowers/specs/2026-06-13-refonte-ux-layouts-couleurs-design.md`.

**Palette retenue** (les 6 couleurs de types, choisies assez profondes pour passer le contraste AA avec texte blanc dans la pyramide ; elles restent dans la famille indigo/violet/rose/cyan/ambre/émeraude validée) :

| Type | Token | Hex | Sémantique |
|---|---|---|---|
| travaillomane | `--type-1` | `#4f46e5` | pensée / structure (indigo) |
| perseverant | `--type-2` | `#7c3aed` | valeurs / conviction (violet) |
| empathique | `--type-3` | `#be185d` | émotions / lien (rose) |
| reveur | `--type-4` | `#0e7490` | imaginaire / calme (cyan) |
| rebelle | `--type-5` | `#b45309` | plaisir / humour (ambre) |
| promoteur | `--type-6` | `#047857` | action / intensité (émeraude) |

**Accent global** : `--primary` = indigo `#4f46e5`.

## File Structure

| Fichier | Action | Responsabilité |
|---|---|---|
| `src/data/types.ts` | Modifier | Ajouter `TYPE_COLORS: Record<TypeId, string>` (source unique) |
| `src/data/types.test.ts` | Modifier | Invariant : `TYPE_COLORS` couvre les 6 types |
| `src/index.css` | Modifier | Tokens accent indigo + `--type-1..6` + surfaces légèrement teintées |
| `src/content/explainer.ts` | Créer | Titre + 3 sections originales (base / phase / immeuble) |
| `src/content/explainer.test.ts` | Créer | Invariant : 3 sections, textes non vides |
| `src/components/ProfilExplainer.tsx` | Créer | Panneau statique « Comment lire ton profil » |
| `src/components/ProfilExplainer.test.tsx` | Créer | Rend le titre + 3 sections |
| `src/components/SplitLayout.tsx` | Créer | Layout 2 volets 1/3-2/3, responsive |
| `src/components/SplitLayout.test.tsx` | Créer | Rend les 2 volets ; masque le droit si `hideRightOnMobile` |
| `src/features/intro/IntroScreen.tsx` | Modifier | `SplitLayout` (titre+bouton / `ProfilExplainer`) + icône |
| `src/features/quiz/QuizScreen.tsx` | Modifier | `SplitLayout` (quiz / `ProfilExplainer`, desktop-only) + icônes |
| `src/features/results/Immeuble.tsx` | Modifier | Étages colorés via `TYPE_COLORS` |
| `src/features/results/RadarProfil.tsx` | Modifier | Sommets colorés par type via `TYPE_COLORS` |
| `src/features/results/ResultsScreen.tsx` | Modifier | En-tête (titre + reset icône) + bandeau + layout C |
| `e2e/smoke.spec.ts` | Modifier | Assertion sur le titre « Tes résultats » |

---

## Task 1 : `TYPE_COLORS` (source unique des couleurs de types)

**Files:**
- Modify: `src/data/types.ts`
- Test: `src/data/types.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue**

Ajouter à la fin de `src/data/types.test.ts`, et compléter l'import en tête :

```ts
// en tête : remplacer la ligne d'import existante par
import { TYPES, TYPE_IDS, TYPE_COLORS } from "./types"
```

```ts
describe("TYPE_COLORS", () => {
  it("définit une couleur non vide pour chacun des 6 types", () => {
    expect(Object.keys(TYPE_COLORS).sort()).toEqual([...TYPE_IDS].sort())
    for (const id of TYPE_IDS) {
      expect(TYPE_COLORS[id]).toMatch(/^var\(--type-[1-6]\)$/)
    }
  })

  it("attribue une couleur distincte à chaque type", () => {
    const valeurs = TYPE_IDS.map((id) => TYPE_COLORS[id])
    expect(new Set(valeurs).size).toBe(TYPE_IDS.length)
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `pnpm test -- src/data/types.test.ts`
Expected: FAIL — `TYPE_COLORS` n'existe pas (erreur de compilation/import).

- [ ] **Step 3 : Implémenter `TYPE_COLORS`**

Ajouter à la fin de `src/data/types.ts` :

```ts
/**
 * Couleur d'affichage par type — SOURCE UNIQUE de vérité.
 * Consommée par le radar, la pyramide (immeuble) et le panneau d'explications.
 * Pointe vers les tokens CSS `--type-1..6` définis dans src/index.css.
 */
export const TYPE_COLORS: Record<TypeId, string> = {
  travaillomane: "var(--type-1)",
  perseverant: "var(--type-2)",
  empathique: "var(--type-3)",
  reveur: "var(--type-4)",
  rebelle: "var(--type-5)",
  promoteur: "var(--type-6)",
}
```

- [ ] **Step 4 : Lancer le test pour vérifier qu'il passe**

Run: `pnpm test -- src/data/types.test.ts`
Expected: PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/data/types.ts src/data/types.test.ts
git commit -m "🎨 feat: TYPE_COLORS, source unique des couleurs de types"
```

---

## Task 2 : Tokens de couleur (`src/index.css`)

**Files:**
- Modify: `src/index.css`

Pas de test unitaire (CSS pur) ; vérification par build + écran.

- [ ] **Step 1 : Exposer les tokens `--type-*` dans `@theme inline`**

Dans le bloc `@theme inline { ... }`, juste après la ligne `--color-chart-1: var(--chart-1);`, ajouter :

```css
    --color-type-1: var(--type-1);
    --color-type-2: var(--type-2);
    --color-type-3: var(--type-3);
    --color-type-4: var(--type-4);
    --color-type-5: var(--type-5);
    --color-type-6: var(--type-6);
```

- [ ] **Step 2 : Définir l'accent indigo + les `--type-*` + surfaces teintées dans `:root`**

Dans le bloc `:root { ... }`, remplacer ces lignes existantes :

```css
    --primary: oklch(0.205 0 0);
    --secondary: oklch(0.97 0 0);
    --muted: oklch(0.97 0 0);
    --accent: oklch(0.97 0 0);
    --ring: oklch(0.708 0 0);
```

par :

```css
    --primary: oklch(0.51 0.23 277);
    --secondary: oklch(0.97 0.01 277);
    --muted: oklch(0.97 0.01 277);
    --accent: oklch(0.96 0.02 277);
    --ring: oklch(0.51 0.23 277);
```

Puis, toujours dans `:root`, ajouter les 6 couleurs de types (après la ligne `--ring: ...`) :

```css
    --type-1: #4f46e5;
    --type-2: #7c3aed;
    --type-3: #be185d;
    --type-4: #0e7490;
    --type-5: #b45309;
    --type-6: #047857;
```

- [ ] **Step 3 : Recolorer `.dark` (par propreté, non exposé)**

Dans le bloc `.dark { ... }`, remplacer :

```css
    --primary: oklch(0.922 0 0);
    --ring: oklch(0.556 0 0);
```

par :

```css
    --primary: oklch(0.65 0.20 277);
    --ring: oklch(0.65 0.20 277);
```

Puis ajouter dans `.dark`, après `--ring`, les mêmes 6 types en versions un peu plus claires :

```css
    --type-1: #6366f1;
    --type-2: #8b5cf6;
    --type-3: #ec4899;
    --type-4: #22d3ee;
    --type-5: #f59e0b;
    --type-6: #10b981;
```

- [ ] **Step 4 : Vérifier que le build passe**

Run: `pnpm build`
Expected: build OK, aucune erreur TypeScript/CSS.

- [ ] **Step 5 : Commit**

```bash
git add src/index.css
git commit -m "🎨 feat: thème indigo + tokens --type-1..6"
```

---

## Task 3 : Contenu du panneau d'explications

**Files:**
- Create: `src/content/explainer.ts`
- Test: `src/content/explainer.test.ts`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `src/content/explainer.test.ts` :

```ts
import { describe, it, expect } from "vitest"
import { EXPLAINER_TITRE, EXPLAINER_SECTIONS } from "./explainer"

describe("EXPLAINER", () => {
  it("a un titre non vide", () => {
    expect(EXPLAINER_TITRE.length).toBeGreaterThan(0)
  })

  it("contient exactement 3 sections (base, phase, immeuble) avec textes substantiels", () => {
    expect(EXPLAINER_SECTIONS.map((s) => s.cle)).toEqual(["base", "phase", "immeuble"])
    for (const s of EXPLAINER_SECTIONS) {
      expect(s.titre.length).toBeGreaterThan(0)
      expect(s.texte.length).toBeGreaterThan(40)
      expect(s.couleur).toMatch(/^var\(--type-[1-6]\)$/)
    }
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `pnpm test -- src/content/explainer.test.ts`
Expected: FAIL — module `./explainer` introuvable.

- [ ] **Step 3 : Implémenter le contenu (texte 100 % original)**

Créer `src/content/explainer.ts` :

```ts
export interface ExplainerSection {
  cle: "base" | "phase" | "immeuble"
  titre: string
  texte: string
  /** Pastille : token de couleur (cohérent avec TYPE_COLORS). */
  couleur: string
}

export const EXPLAINER_TITRE = "Comment lire ton profil"

export const EXPLAINER_SECTIONS: ExplainerSection[] = [
  {
    cle: "base",
    titre: "Ta base",
    texte:
      "Ta base, c'est ta façon la plus stable de percevoir le monde — celle qui bouge peu au fil de ta vie. Elle colore d'emblée ce à quoi tu prêtes attention et la manière dont tu entres en relation.",
    couleur: "var(--type-1)",
  },
  {
    cle: "phase",
    titre: "Ta phase",
    texte:
      "Ta phase, c'est ce qui te porte en ce moment : le moteur et les besoins du chapitre que tu traverses. Contrairement à la base, elle peut évoluer avec le temps et les expériences.",
    couleur: "var(--type-3)",
  },
  {
    cle: "immeuble",
    titre: "Ton immeuble",
    texte:
      "Ton immeuble, c'est l'agencement de tes six facettes, empilées de la plus présente à la plus discrète. Aucune n'est absente : c'est leur ordre qui te rend unique.",
    couleur: "var(--type-6)",
  },
]
```

- [ ] **Step 4 : Lancer le test pour vérifier qu'il passe**

Run: `pnpm test -- src/content/explainer.test.ts`
Expected: PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/content/explainer.ts src/content/explainer.test.ts
git commit -m "✨ feat: contenu original du panneau d'explications"
```

---

## Task 4 : Composant `ProfilExplainer`

**Files:**
- Create: `src/components/ProfilExplainer.tsx`
- Test: `src/components/ProfilExplainer.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `src/components/ProfilExplainer.test.tsx` :

```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ProfilExplainer } from "./ProfilExplainer"
import { EXPLAINER_TITRE, EXPLAINER_SECTIONS } from "@/content/explainer"

describe("ProfilExplainer", () => {
  it("affiche le titre et les 3 sections", () => {
    render(<ProfilExplainer />)
    expect(screen.getByRole("heading", { name: EXPLAINER_TITRE })).toBeInTheDocument()
    for (const s of EXPLAINER_SECTIONS) {
      expect(screen.getByText(s.titre)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `pnpm test -- src/components/ProfilExplainer.test.tsx`
Expected: FAIL — module `./ProfilExplainer` introuvable.

- [ ] **Step 3 : Implémenter le composant**

Créer `src/components/ProfilExplainer.tsx` :

```tsx
import { EXPLAINER_TITRE, EXPLAINER_SECTIONS } from "@/content/explainer"

export function ProfilExplainer({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border bg-secondary/40 p-6 ${className}`}
      aria-label={EXPLAINER_TITRE}
    >
      <h2 className="text-lg font-semibold">{EXPLAINER_TITRE}</h2>
      <dl className="mt-4 flex flex-col gap-5">
        {EXPLAINER_SECTIONS.map((s) => (
          <div key={s.cle} className="flex gap-3">
            <span
              className="mt-1.5 size-3 flex-none rounded-full"
              style={{ backgroundColor: s.couleur }}
              aria-hidden
            />
            <div>
              <dt className="font-medium">{s.titre}</dt>
              <dd className="leading-relaxed text-muted-foreground">{s.texte}</dd>
            </div>
          </div>
        ))}
      </dl>
    </aside>
  )
}
```

- [ ] **Step 4 : Lancer le test pour vérifier qu'il passe**

Run: `pnpm test -- src/components/ProfilExplainer.test.tsx`
Expected: PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/components/ProfilExplainer.tsx src/components/ProfilExplainer.test.tsx
git commit -m "✨ feat: composant ProfilExplainer (panneau statique)"
```

---

## Task 5 : Composant `SplitLayout`

**Files:**
- Create: `src/components/SplitLayout.tsx`
- Test: `src/components/SplitLayout.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `src/components/SplitLayout.test.tsx` :

```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { SplitLayout } from "./SplitLayout"

describe("SplitLayout", () => {
  it("rend les deux volets", () => {
    render(<SplitLayout left={<p>GAUCHE</p>} right={<p>DROITE</p>} />)
    expect(screen.getByText("GAUCHE")).toBeInTheDocument()
    expect(screen.getByText("DROITE")).toBeInTheDocument()
  })

  it("masque le volet droit en mobile quand hideRightOnMobile", () => {
    render(<SplitLayout left={<p>G</p>} right={<p>DROITE</p>} hideRightOnMobile />)
    // le wrapper du volet droit porte la classe responsive `hidden md:block`
    const droite = screen.getByText("DROITE").parentElement
    expect(droite?.className).toContain("hidden")
    expect(droite?.className).toContain("md:block")
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `pnpm test -- src/components/SplitLayout.test.tsx`
Expected: FAIL — module `./SplitLayout` introuvable.

- [ ] **Step 3 : Implémenter le composant**

Créer `src/components/SplitLayout.tsx` :

```tsx
export function SplitLayout({
  left,
  right,
  hideRightOnMobile = false,
}: {
  left: React.ReactNode
  right: React.ReactNode
  hideRightOnMobile?: boolean
}) {
  return (
    <main className="mx-auto min-h-svh max-w-6xl p-6 md:grid md:grid-cols-3 md:gap-10">
      <div className="flex flex-col md:col-span-1">{left}</div>
      <div
        className={`mt-8 md:col-span-2 md:mt-0 ${
          hideRightOnMobile ? "hidden md:block" : ""
        }`}
      >
        {right}
      </div>
    </main>
  )
}
```

- [ ] **Step 4 : Lancer le test pour vérifier qu'il passe**

Run: `pnpm test -- src/components/SplitLayout.test.tsx`
Expected: PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/components/SplitLayout.tsx src/components/SplitLayout.test.tsx
git commit -m "✨ feat: composant SplitLayout (1/3-2/3 responsive)"
```

---

## Task 6 : `IntroScreen` — split + icône

**Files:**
- Modify: `src/features/intro/IntroScreen.tsx`
- Test (existant, doit rester vert): `src/App.test.tsx`

- [ ] **Step 1 : Remplacer le contenu de `IntroScreen.tsx`**

```tsx
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SplitLayout } from "@/components/SplitLayout"
import { ProfilExplainer } from "@/components/ProfilExplainer"

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <SplitLayout
      left={
        <div className="flex flex-1 flex-col justify-center gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">process gomme</h1>
            <p className="text-muted-foreground">
              36 questions, environ 5 minutes. Tout reste dans ton navigateur :
              aucune réponse n'est envoyée ni enregistrée.
            </p>
          </div>
          <Button size="lg" className="w-fit" onClick={onStart}>
            Commencer
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      }
      right={<ProfilExplainer />}
    />
  )
}
```

- [ ] **Step 2 : Vérifier que le test d'intro reste vert**

Run: `pnpm test -- src/App.test.tsx`
Expected: PASS (le `<h1>` « process gomme » et le bouton « Commencer » sont conservés).

- [ ] **Step 3 : Commit**

```bash
git add src/features/intro/IntroScreen.tsx
git commit -m "💄 feat: écran d'intro en 1/3-2/3 avec panneau d'explications"
```

---

## Task 7 : `QuizScreen` — split (panneau desktop-only) + icônes

**Files:**
- Modify: `src/features/quiz/QuizScreen.tsx`
- Test (existant, doit rester vert): `src/features/quiz/QuizScreen.test.tsx`

- [ ] **Step 1 : Remplacer le contenu de `QuizScreen.tsx`**

```tsx
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SplitLayout } from "@/components/SplitLayout"
import { ProfilExplainer } from "@/components/ProfilExplainer"
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
  const derniere = state.index === total - 1

  return (
    <SplitLayout
      hideRightOnMobile
      left={
        <div className="flex flex-1 flex-col gap-8">
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
              <ChevronLeft className="size-4" aria-hidden />
              Précédent
            </Button>
            <Button onClick={() => dispatch({ type: "next" })} disabled={forcedManquant}>
              {derniere ? "Voir mes résultats" : "Suivant"}
              {derniere ? (
                <Sparkles className="size-4" aria-hidden />
              ) : (
                <ChevronRight className="size-4" aria-hidden />
              )}
            </Button>
          </div>
        </div>
      }
      right={<ProfilExplainer className="md:sticky md:top-6" />}
    />
  )
}
```

- [ ] **Step 2 : Vérifier que les tests du quiz restent verts**

Run: `pnpm test -- src/features/quiz/QuizScreen.test.tsx`
Expected: PASS (les boutons matchent toujours `/suivant|résultats/i`, le label texte est conservé).

- [ ] **Step 3 : Commit**

```bash
git add src/features/quiz/QuizScreen.tsx
git commit -m "💄 feat: écran de quiz en 1/3-2/3 (panneau desktop) + icônes"
```

---

## Task 8 : `Immeuble` — étages colorés par type

**Files:**
- Modify: `src/features/results/Immeuble.tsx`

- [ ] **Step 1 : Mettre à jour l'import**

Remplacer la ligne 2 :

```tsx
import { TYPES, type TypeId } from "@/data/types"
```

par :

```tsx
import { TYPES, TYPE_COLORS, type TypeId } from "@/data/types"
```

- [ ] **Step 2 : Colorer chaque étage via `TYPE_COLORS` + texte blanc**

Remplacer le bloc `<motion.div ...>` (lignes ~28-39) par :

```tsx
          <motion.div
            key={t}
            initial={reduce ? false : { width: 0, opacity: 0 }}
            animate={{ width: `${largeur}%`, opacity: 1 }}
            transition={{ delay: delai, duration: 0.4, ease: "easeOut" }}
            style={{ backgroundColor: TYPE_COLORS[t] }}
            className={`flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-white ${
              estPhase ? "ring-2 ring-foreground ring-offset-2" : ""
            }`}
          >
            <span className="truncate">{TYPES[t].nom}</span>
            <span className="tabular-nums opacity-80">{Math.round(socle[t])}%</span>
          </motion.div>
```

(La couleur de l'étage = couleur du type ; la phase est mise en évidence par un anneau `ring-foreground` au lieu de l'ancien `ring-amber-500`. Le texte blanc passe le contraste AA sur les 6 teintes choisies.)

- [ ] **Step 3 : Vérifier le build + les tests existants**

Run: `pnpm test && pnpm build`
Expected: PASS (l'`aria-label="Ton immeuble"` est conservé → e2e OK).

- [ ] **Step 4 : Commit**

```bash
git add src/features/results/Immeuble.tsx
git commit -m "🎨 feat: pyramide colorée par type (TYPE_COLORS)"
```

---

## Task 9 : `RadarProfil` — sommets colorés par type

**Files:**
- Modify: `src/features/results/RadarProfil.tsx`

- [ ] **Step 1 : Remplacer le contenu de `RadarProfil.tsx`**

```tsx
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { TYPE_IDS, TYPES, TYPE_COLORS, type TypeId } from "@/data/types"

// Point coloré à chaque sommet du radar : couleur du type correspondant.
// `index` suit l'ordre de `data`, donc l'ordre de TYPE_IDS.
function RadarDot(props: { cx?: number; cy?: number; index?: number }) {
  const { cx, cy, index } = props
  if (cx == null || cy == null || index == null) return <g />
  return (
    <circle cx={cx} cy={cy} r={4} fill={TYPE_COLORS[TYPE_IDS[index]]} stroke="white" strokeWidth={1.5} />
  )
}

export function RadarProfil({ socle }: { socle: Record<TypeId, number> }) {
  const data = TYPE_IDS.map((t) => ({ type: TYPES[t].nom, score: Math.round(socle[t]) }))
  return (
    <div className="h-64 w-full" aria-label="Radar de ton profil">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="type" tick={{ fontSize: 11 }} />
          <Radar
            dataKey="score"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.3}
            dot={RadarDot}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 2 : Vérifier le build + le lint (typage du `dot`)**

Run: `pnpm build && pnpm lint`
Expected: PASS — pas d'erreur de type sur `dot={RadarDot}`, pas de `any`.

- [ ] **Step 3 : Commit**

```bash
git add src/features/results/RadarProfil.tsx
git commit -m "🎨 feat: radar avec sommets colorés par type"
```

---

## Task 10 : `ResultsScreen` — en-tête + bandeau + layout C

**Files:**
- Modify: `src/features/results/ResultsScreen.tsx`

- [ ] **Step 1 : Remplacer le contenu de `ResultsScreen.tsx`**

```tsx
import { lazy, Suspense } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { computeResult, type Answers } from "@/lib/scoring"
import { TYPES } from "@/data/types"
import { Immeuble } from "./Immeuble"
import { Synthese } from "./Synthese"

// Recharts est lourd et n'est utilisé que sur cet écran : on le charge à la demande
// (chunk séparé) pour alléger le bundle initial (intro + quiz).
const RadarProfil = lazy(() =>
  import("./RadarProfil").then((m) => ({ default: m.RadarProfil })),
)

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
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Tes résultats</h1>
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden />
          Recommencer
        </Button>
      </header>

      <div className="mt-6 rounded-xl border bg-secondary/50 p-5">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Ta base · ta phase
        </p>
        <p className="mt-1 text-xl font-semibold text-primary">
          {TYPES[result.base].nom} · {TYPES[result.phase].nom}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex w-full flex-col gap-8 md:sticky md:top-6 md:w-[38%]">
          <Immeuble immeuble={result.immeuble} socle={result.socle} phase={result.phase} />
          <Suspense fallback={<div className="h-64 w-full" aria-label="Radar de ton profil" />}>
            <RadarProfil socle={result.socle} />
          </Suspense>
        </div>
        <div className="w-full md:flex-1">
          <Synthese result={result} />
        </div>
      </div>
    </main>
  )
}
```

(Le bouton reset passe en haut à droite avec l'icône ↺ ; le bandeau résume base·phase ; la colonne pyramide+radar reste sticky. `Synthese` est inchangé : il conserve son `<h2>` « Ta base — … » utilisé par l'e2e.)

- [ ] **Step 2 : Vérifier le build + les tests**

Run: `pnpm test && pnpm build`
Expected: PASS.

- [ ] **Step 3 : Commit**

```bash
git add src/features/results/ResultsScreen.tsx
git commit -m "💄 feat: page de résultats (en-tête + bandeau + layout C)"
```

---

## Task 11 : e2e + gate complet

**Files:**
- Modify: `e2e/smoke.spec.ts`

- [ ] **Step 1 : Ajouter l'assertion sur le nouveau titre**

Dans `e2e/smoke.spec.ts`, dans le bloc `// Résultats` (après la ligne `await expect(page.getByRole("heading", { name: /ta base/i })).toBeVisible()`), ajouter :

```ts
  await expect(page.getByRole("heading", { name: /tes résultats/i })).toBeVisible()
```

(Le reste du test est inchangé : `/recommencer/i` matche toujours le bouton, `/ton immeuble/i` et `/ta base/i` sont conservés.)

- [ ] **Step 2 : Lancer le gate CI complet en local**

Run: `pnpm before_push`
Expected: les 4 étapes passent — `lint` ✓, `test` ✓ (tests unitaires, dont les nouveaux), `build` ✓, `test:e2e` ✓ (parcours complet).

- [ ] **Step 3 : Vérifier visuellement les 3 écrans (desktop + mobile)**

Run: `pnpm dev` puis ouvrir l'app.
Vérifier :
- Intro : split 1/3-2/3, bouton « Commencer » + flèche, panneau à droite.
- Quiz : split 1/3-2/3 en desktop ; en viewport étroit, panneau masqué (colonne simple).
- Résultats : titre « Tes résultats » + reset ↺ en haut à droite, bandeau base·phase, pyramide + radar colorés, colonne sticky.
- Contraste : texte blanc lisible sur chaque étage de la pyramide. Si une teinte passe trop juste, assombrir le token `--type-*` correspondant dans `src/index.css` (baisser le L oklch / choisir un hex plus foncé) puis recommit Task 2.

- [ ] **Step 4 : Commit**

```bash
git add e2e/smoke.spec.ts
git commit -m "✅ test: e2e — assertion titre 'Tes résultats'"
```

---

## Task 12 : Mise à jour de la mémoire projet (règle de fin d'implémentation)

**Files:**
- Modify: `docs/INDEX.md`, `docs/HANDOFF.md`, `docs/QUIRKS.md`, `docs/CONVENTIONS.md`

- [ ] **Step 1 : `docs/INDEX.md`** — ajouter une ligne dans la table « Features » :

```
| Refonte UX — layouts 1/3-2/3 + page résultats C + thème indigo | 2026-06-13 | [spec](superpowers/specs/2026-06-13-refonte-ux-layouts-couleurs-design.md) | [plan](superpowers/plans/2026-06-13-refonte-ux-layouts-couleurs.md) | ✅ Livré | SplitLayout + ProfilExplainer ; TYPE_COLORS (radar+pyramide+pastilles) ; icônes lucide sur tous les boutons |
```

- [ ] **Step 2 : `docs/CONVENTIONS.md`** — ajouter une note : couleurs de types = toujours via `TYPE_COLORS` (jamais en dur) ; tout bouton porte une icône lucide (`size-4`, `aria-hidden`).

- [ ] **Step 3 : `docs/QUIRKS.md`** — si un piège est apparu (ex. typage `dot` de Recharts, contraste texte/étage), l'ajouter avec date.

- [ ] **Step 4 : `docs/HANDOFF.md`** — ajouter une entrée datée en haut (Dernière chose faite / Trucs en suspens / Prochaine chose à creuser / Notes pour future Claude).

- [ ] **Step 5 : Commit**

```bash
git add docs/
git commit -m "📝 docs: mémoire projet à jour (refonte UX)"
```

---

## Self-Review (rempli pendant l'écriture du plan)

- **Couverture du spec** : tokens couleur (T2), TYPE_COLORS source unique (T1, consommé T8/T9, pastilles T3/T4), SplitLayout (T5), ProfilExplainer statique + contenu original (T3/T4), intro split (T6), quiz split desktop-only (T7), résultats layout C + en-tête + bandeau + reset haut-droite (T10), icônes sur tous les boutons (T6/T7/T10), responsive (T5 + classes), préservation Framer Motion/lazy/a11y (T7/T9/T10), tests e2e + invariants (T1/T11). ✅
- **Placeholders** : aucun — chaque step porte le code/commande exacts.
- **Cohérence des types** : `TYPE_COLORS` (Record<TypeId,string>) défini en T1, importé identiquement en T8/T9 ; `ExplainerSection`/`EXPLAINER_SECTIONS` définis en T3, consommés en T4 ; `SplitLayout` props (`left`/`right`/`hideRightOnMobile`) cohérents T5→T6/T7.
- **Périmètre** : un seul plan cohérent, aucune logique métier touchée.
