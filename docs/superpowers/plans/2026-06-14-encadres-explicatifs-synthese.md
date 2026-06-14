# Encadrés explicatifs des concepts dans la synthèse — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter, sous chaque titre de section de la synthèse de résultats, un encadré fond clair (icône + titre en primary + une phrase d'explication du concept).

**Architecture:** Le contenu textuel des 4 phrases vit dans un nouveau fichier de contenu pur (`src/content/sectionHints.ts`). Le composant interne `Section` de `Synthese.tsx` absorbe son en-tête (titre `<h2>` + phrase) dans un encadré stylé et reçoit une icône `lucide-react`. `explainer.ts`, l'intro et le quiz ne sont pas touchés.

**Tech Stack:** React + TypeScript, Tailwind v4, lucide-react (déjà dépendance), Vitest + @testing-library/react.

---

## Contexte pour l'implémenteur

- Le fichier cible `src/features/results/Synthese.tsx` contient aujourd'hui un composant interne `Section({ titre, children })` appelé 4 fois (base, phase, immeuble, interactions). On lui ajoute deux props : `hint` (texte) et `icon` (composant lucide).
- Le contenu textuel du projet est **100 % original** (contrainte transverse) — ne copier aucune source externe.
- Les phrases ci-dessous sont **définitives** pour ce plan (pas des brouillons). Si tu veux les retoucher, fais-le, mais garde-les courtes (≈ 1 phrase) et sans le préfixe « Ta base, c'est… » (qui ferait doublon avec le titre).
- Lancer les tests unitaires d'un fichier : `pnpm test -- <chemin>` (Vitest). Lancer tout : `pnpm test`.
- Avant tout push : `pnpm before_push` (lint + unit + build + e2e).

## File Structure

- **Create:** `src/content/sectionHints.ts` — objet `SECTION_HINTS` (4 phrases d'explication, texte pur).
- **Create:** `src/content/sectionHints.test.ts` — test de contenu (4 clés, phrases non vides).
- **Modify:** `src/features/results/Synthese.tsx` — `Section` gagne `hint` + `icon`, en-tête en encadré, 4 appels mis à jour.
- **Create:** `src/features/results/Synthese.test.tsx` — test de rendu (les 4 phrases s'affichent).

---

## Task 1: Contenu des phrases d'explication (`SECTION_HINTS`)

**Files:**
- Create: `src/content/sectionHints.ts`
- Test: `src/content/sectionHints.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/content/sectionHints.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { SECTION_HINTS } from "./sectionHints"

describe("SECTION_HINTS", () => {
  it("contient exactement les 4 clés attendues", () => {
    expect(Object.keys(SECTION_HINTS)).toEqual([
      "base",
      "phase",
      "immeuble",
      "interactions",
    ])
  })

  it("a une phrase substantielle pour chaque clé", () => {
    for (const phrase of Object.values(SECTION_HINTS)) {
      expect(phrase.length).toBeGreaterThan(40)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/content/sectionHints.test.ts`
Expected: FAIL (`Failed to resolve import "./sectionHints"` ou module introuvable).

- [ ] **Step 3: Write minimal implementation**

Create `src/content/sectionHints.ts`:

```ts
/**
 * Phrases courtes rappelant à quoi correspond chaque concept, affichées dans
 * l'en-tête des sections de la synthèse de résultats. Volontairement distinctes
 * des textes de `explainer.ts` (registre « rappel contextuel », pas « glossaire
 * autonome ») : pas de préfixe « Ta base, c'est… » qui ferait doublon avec le titre.
 * Contenu 100 % original.
 */
export const SECTION_HINTS = {
  base: "Ta façon la plus stable de percevoir le monde, celle qui bouge peu au fil de ta vie.",
  phase:
    "Ce qui te porte en ce moment : le moteur et les besoins du chapitre que tu traverses.",
  immeuble:
    "L'agencement de tes six facettes, empilées de la plus présente à la plus discrète.",
  interactions:
    "Comment ta base et ta phase dialoguent au quotidien — parfois en accord, parfois en tension.",
} as const
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/content/sectionHints.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/content/sectionHints.ts src/content/sectionHints.test.ts
git commit -m "✨ content: phrases d'explication des concepts pour la synthèse"
```

---

## Task 2: Encadrés (icône + titre primary + phrase) dans `Synthese`

**Files:**
- Modify: `src/features/results/Synthese.tsx`
- Test: `src/features/results/Synthese.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/features/results/Synthese.test.tsx`. On construit un `ScoreResult` minimal et on vérifie que les 4 phrases d'explication apparaissent.

```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Synthese } from "./Synthese"
import { SECTION_HINTS } from "@/content/sectionHints"
import type { ScoreResult } from "@/lib/scoring"
import type { TypeId } from "@/data/types"

const socle: Record<TypeId, number> = {
  travaillomane: 90,
  perseverant: 70,
  empathique: 60,
  reveur: 50,
  rebelle: 40,
  promoteur: 30,
}

const result: ScoreResult = {
  socle,
  motivation: socle,
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

describe("Synthese", () => {
  it("affiche la phrase d'explication de chaque section", () => {
    render(<Synthese result={result} />)
    expect(screen.getByText(SECTION_HINTS.base)).toBeInTheDocument()
    expect(screen.getByText(SECTION_HINTS.phase)).toBeInTheDocument()
    expect(screen.getByText(SECTION_HINTS.immeuble)).toBeInTheDocument()
    expect(screen.getByText(SECTION_HINTS.interactions)).toBeInTheDocument()
  })
})
```

> `ScoreResult` (vérifié dans `src/lib/scoring.ts`) = `{ socle, motivation: Record<TypeId, number>; base, phase: TypeId; immeuble: TypeId[]; baseEgalePhase: boolean }`. L'objet ci-dessus est complet et typé. `Synthese` n'utilise que `base`, `phase`, `immeuble`, `socle` — `motivation`/`baseEgalePhase` sont là pour satisfaire le type.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/features/results/Synthese.test.tsx`
Expected: FAIL — les phrases ne sont pas encore rendues (`Unable to find an element with the text…`).

- [ ] **Step 3: Modify `Synthese.tsx`**

Remplace l'intégralité de `src/features/results/Synthese.tsx` par :

```tsx
import { Anchor, ArrowLeftRight, Building2, Compass, type LucideIcon } from "lucide-react"
import { TYPES, type TypeId } from "@/data/types"
import { DESCRIPTIONS } from "@/content/descriptions"
import { IMMEUBLE_INTRO, composeInteraction } from "@/content/interactions"
import { SECTION_HINTS } from "@/content/sectionHints"
import type { ScoreResult } from "@/lib/scoring"

function Section({
  titre,
  hint,
  icon: Icon,
  children,
}: {
  titre: string
  hint: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Icon className="size-5 flex-none" aria-hidden />
          {titre}
        </h2>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export function Synthese({ result }: { result: ScoreResult }) {
  const { base, phase, immeuble } = result
  return (
    <div className="flex flex-col gap-8">
      <Section titre={`Ta base — ${TYPES[base].nom}`} hint={SECTION_HINTS.base} icon={Anchor}>
        {DESCRIPTIONS[base].base}
      </Section>
      <Section titre={`Ta phase — ${TYPES[phase].nom}`} hint={SECTION_HINTS.phase} icon={Compass}>
        {DESCRIPTIONS[phase].phase}
      </Section>
      <Section titre="Ton immeuble" hint={SECTION_HINTS.immeuble} icon={Building2}>
        <p>{IMMEUBLE_INTRO}</p>
        <ol className="mt-2 list-decimal pl-5">
          {immeuble.map((t: TypeId) => (
            <li key={t}>
              {TYPES[t].nom} — {Math.round(result.socle[t])}%
            </li>
          ))}
        </ol>
      </Section>
      <Section
        titre="Interactions base × phase"
        hint={SECTION_HINTS.interactions}
        icon={ArrowLeftRight}
      >
        {composeInteraction(base, phase)}
      </Section>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/features/results/Synthese.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/features/results/Synthese.tsx src/features/results/Synthese.test.tsx
git commit -m "✨ feat: encadrés explicatifs (icône + concept) dans la synthèse"
```

---

## Task 3: Vérification globale + documentation mémoire

**Files:**
- Modify: `docs/QUIRKS.md`, `docs/INDEX.md`, `docs/HANDOFF.md`

- [ ] **Step 1: Gate complet**

Run: `pnpm before_push`
Expected: lint + unit + build + e2e tous verts. Si l'e2e de la page de résultats casse à cause d'un sélecteur de titre, vérifier qu'il ne s'appuie pas sur la couleur/structure du `<h2>` (le texte du titre est inchangé, seul le style change).

- [ ] **Step 2: Documenter le quirk des deux formulations**

Ajouter dans `docs/QUIRKS.md` une entrée : « Deux jeux de définitions des concepts coexistent volontairement — `explainer.ts` (glossaire autonome, préfixé « Ta base, c'est… », utilisé intro/quiz) et `sectionHints.ts` (rappel contextuel court, utilisé dans la synthèse de résultats). Modifier l'un n'entraîne PAS l'autre. »

- [ ] **Step 3: Mettre à jour INDEX et HANDOFF**

- `docs/INDEX.md` : ajouter une ligne pour la feature « Encadrés explicatifs des concepts dans la synthèse » avec liens spec/plan.
- `docs/HANDOFF.md` : entrée datée 2026-06-14 (Dernière chose faite / Trucs en suspens / Prochaine chose à creuser / Notes pour future Claude).

- [ ] **Step 4: Commit**

```bash
git add docs/
git commit -m "📝 docs: mémoire à jour (encadrés explicatifs synthèse + quirk double définition)"
```

- [ ] **Step 5: Push**

```bash
git push
```

---

## Notes de revue

- **DRY** : `sectionHints.ts` est l'unique source des 4 phrases ; le composant et les tests la référencent, jamais de littéral dupliqué.
- **YAGNI** : pas de pastille de couleur par type, pas d'animation, pas de repli sur `explainer.ts`, aucune touche à l'intro/quiz.
- **Accessibilité** : le `<h2>` reste un vrai `<h2>` ; les icônes sont `aria-hidden`.
