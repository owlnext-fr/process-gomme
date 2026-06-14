# Pack restitution « Pour aller plus loin » — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrichir la fiche de résultats avec 4 sections dérivées (canal, stress, énergie par étage, vigilance) réparties en 2 onglets, sans toucher au questionnaire.

**Architecture:** Tout est dérivé des scores déjà calculés (`socle`, `phase`). Nouveaux modules de contenu 100 % originaux (`canaux`/`energie`/`stress`/`vigilance`), `stress`/`vigilance` en templates assemblés base×phase façon `composeInteraction`. UI : onglets shadcn/Radix ; encadré `ResultSection` extrait et partagé ; onglet 2 dans `PlusLoin.tsx`.

**Tech Stack:** React + TypeScript, Tailwind v4, shadcn/ui (+ `@radix-ui/react-tabs`), lucide-react, Vitest + @testing-library/react, Playwright.

---

## Contexte pour l'implémenteur

- `src/lib/scoring.ts` exporte `DisplayResult = Omit<ScoreResult, "motivation">` (`{ socle, base, phase, immeuble, baseEgalePhase }`).
- `src/data/types.ts` exporte `TYPE_IDS` (ordre canonique), `TypeId`, `TYPES` (avec `nom`, `essenceBase`, `besoinPhase` — à utiliser comme ancrage de ton/contenu).
- `src/content/interactions.ts` montre le **pattern de template assemblé** (`CLAUSE_BASE`/`CLAUSE_PHASE` + `composeInteraction`, avec une branche `base === phase`). Les nouveaux modules `stress`/`vigilance` suivent ce pattern.
- `src/content/descriptions.ts` donne le **ton de référence** (tutoiement, bienveillant, ~150 mots pour les longs, étoffé). Contient déjà une « zone de vigilance » par type → la section Vigilance doit être **courte et différente** (synthèse-action, pas un paragraphe).
- `src/features/results/Synthese.tsx` contient aujourd'hui un composant interne `Section` (encadré : icône lucide + titre `text-primary` + hint + contenu) utilisé 4×. Tâche 1 l'extrait dans `ResultSection`.
- `src/content/sectionHints.ts` : `SECTION_HINTS = { base, phase, immeuble, interactions }` (un test vérifie ces 4 clés exactes → à mettre à jour quand on ajoute 3 clés).
- `@/lib/utils` exporte `cn` (utilisé par les composants shadcn comme `button.tsx`).
- Tests : `pnpm test -- <chemin>` (un fichier), `pnpm test` (tout), `pnpm test:e2e`, `pnpm before_push` (gate complet).

> **CONTRAINTE CONTENU (toutes les tâches de rédaction)** : contenu **100 % original**. On
> reprend uniquement la logique du modèle (quelles dimensions, comment elles dérivent de
> base/phase), **jamais** un texte source ni du jargon de marque. Tutoiement, registre
> bienveillant, cohérent avec `descriptions.ts`.

## File Structure

- **Create** `src/components/ResultSection.tsx` — encadré partagé (extrait de `Synthese`).
- **Create** `src/components/ResultSection.test.tsx`.
- **Create** `src/content/canaux.ts` (+ `.test.ts`) — `CANAUX` (indexé base).
- **Create** `src/content/energie.ts` (+ `.test.ts`) — `ENERGIE` (par type).
- **Create** `src/content/stress.ts` (+ `.test.ts`) — clauses + `composeStress`.
- **Create** `src/content/vigilance.ts` (+ `.test.ts`) — clauses + `composeVigilance`.
- **Create** `src/components/ui/tabs.tsx` — shadcn/Radix Tabs.
- **Create** `src/features/results/PlusLoin.tsx` (+ `.test.tsx`) — onglet 2.
- **Modify** `src/content/sectionHints.ts` (+ son test) — ajout `canal`/`stress`/`vigilance`.
- **Modify** `src/features/results/Synthese.tsx` — utilise `ResultSection` + énergie.
- **Modify** `src/features/results/ResultsScreen.tsx` — onglets.
- **Modify** `e2e/smoke.spec.ts` — clic onglet 2.

---

## Task 1: Extraire l'encadré partagé `ResultSection`

**Files:**
- Create: `src/components/ResultSection.tsx`, `src/components/ResultSection.test.tsx`
- Modify: `src/features/results/Synthese.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ResultSection.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Anchor } from "lucide-react"
import { ResultSection } from "./ResultSection"

describe("ResultSection", () => {
  it("affiche le titre, le hint et le contenu", () => {
    render(
      <ResultSection titre="Mon titre" hint="Mon hint" icon={Anchor}>
        <p>Mon contenu</p>
      </ResultSection>,
    )
    expect(screen.getByRole("heading", { name: /mon titre/i })).toBeInTheDocument()
    expect(screen.getByText("Mon hint")).toBeInTheDocument()
    expect(screen.getByText("Mon contenu")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/components/ResultSection.test.tsx`
Expected: FAIL (`./ResultSection` introuvable).

- [ ] **Step 3: Create `src/components/ResultSection.tsx`**

```tsx
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export function ResultSection({
  titre,
  hint,
  icon: Icon,
  children,
}: {
  titre: string
  hint: string
  icon: LucideIcon
  children: ReactNode
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
```

- [ ] **Step 4: Refactor `Synthese.tsx` to use it**

In `src/features/results/Synthese.tsx`: delete the internal `Section` function, add `import { ResultSection } from "@/components/ResultSection"`, and replace every `<Section ...>` with `<ResultSection ...>` (same props: `titre`, `hint`, `icon`, children). Remove now-unused imports if any (the `LucideIcon` type import stays only if still referenced — it is no longer needed in Synthese, so remove `type LucideIcon` from the lucide import there).

- [ ] **Step 5: Run tests**

Run: `pnpm test -- src/components/ResultSection.test.tsx src/features/results/Synthese.test.tsx`
Expected: PASS (ResultSection + Synthese inchangé fonctionnellement).

- [ ] **Step 6: Commit**

```bash
git add src/components/ResultSection.tsx src/components/ResultSection.test.tsx src/features/results/Synthese.tsx
git commit -m "♻️ refactor: extraire l'encadré ResultSection partagé"
```

---

## Task 2: Contenu `canaux.ts` (ULTRATHINK + jury)

> **Tâche de rédaction à réflexion approfondie.** En exécution subagent-driven : dispatcher avec consigne ultrathink, puis relecture qualité (jury de personas : fidélité au type, absence de redite, équilibre des 6 types). Contenu 100 % original.

**Files:**
- Create: `src/content/canaux.ts`, `src/content/canaux.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/content/canaux.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { CANAUX } from "./canaux"
import { TYPE_IDS } from "@/data/types"

describe("CANAUX", () => {
  it("a un canal étoffé pour chacun des 6 types", () => {
    expect(Object.keys(CANAUX).sort()).toEqual([...TYPE_IDS].sort())
    for (const t of TYPE_IDS) {
      expect(CANAUX[t].length).toBeGreaterThan(60)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/content/canaux.test.ts`
Expected: FAIL (`./canaux` introuvable).

- [ ] **Step 3: Create `src/content/canaux.ts`**

Structure (squelette à remplir avec le contenu rédigé) :

```ts
import type { TypeId } from "@/data/types"

/** « Comment on communique le mieux avec toi » — indexé par la BASE. 100 % original. */
export const CANAUX: Record<TypeId, string> = {
  travaillomane: "…",
  perseverant: "…",
  empathique: "…",
  reveur: "…",
  rebelle: "…",
  promoteur: "…",
}
```

**Brief de rédaction (ultrathink)** : pour chaque base, 2-3 phrases (≈ 60-110 mots) décrivant le canal de communication qui passe le mieux avec cette personne — la façon de s'adresser à elle qu'elle reçoit le plus naturellement. Ancrer sur `TYPES[t].essenceBase` :
- travaillomane → registre informatif/structuré (données, logique, questions précises) ;
- perseverant → registre des convictions/opinions (on sollicite son avis, on respecte ses valeurs) ;
- empathique → registre chaleureux/relationnel (on prend soin de la personne, ton bienveillant) ;
- reveur → registre directif-respectueux du calme (consignes claires, on laisse de l'espace) ;
- rebelle → registre ludique/spontané (humour, légèreté, réactions « j'aime/j'aime pas ») ;
- promoteur → registre direct/action (droit au but, enjeu concret, pas de détours).
Tutoiement, original, sans jargon de marque.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/content/canaux.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/canaux.ts src/content/canaux.test.ts
git commit -m "✨ content: canaux de communication par base (ultrathink)"
```

---

## Task 3: Contenu `energie.ts` + intégration immeuble (ULTRATHINK + jury)

> **Tâche de rédaction à réflexion approfondie** (idem Task 2).

**Files:**
- Create: `src/content/energie.ts`, `src/content/energie.test.ts`
- Modify: `src/features/results/Synthese.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/content/energie.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { ENERGIE } from "./energie"
import { TYPE_IDS } from "@/data/types"

describe("ENERGIE", () => {
  it("a une phrase pour chacun des 6 types", () => {
    expect(Object.keys(ENERGIE).sort()).toEqual([...TYPE_IDS].sort())
    for (const t of TYPE_IDS) {
      expect(ENERGIE[t].length).toBeGreaterThan(20)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/content/energie.test.ts`
Expected: FAIL (`./energie` introuvable).

- [ ] **Step 3: Create `src/content/energie.ts`**

```ts
import type { TypeId } from "@/data/types"

/** « Ce que tu puises à cet étage » — une phrase courte par type. 100 % original. */
export const ENERGIE: Record<TypeId, string> = {
  travaillomane: "…",
  perseverant: "…",
  empathique: "…",
  reveur: "…",
  rebelle: "…",
  promoteur: "…",
}
```

**Brief de rédaction (ultrathink)** : pour chaque type, **une** phrase courte (≈ 20-40 mots) décrivant la ressource que cette personne mobilise quand elle « monte » à cet étage de son immeuble (ce qu'elle peut y puiser, à quel coût d'énergie). Ancrer sur `essenceBase`. Formulation qui se lit bien **à la suite de** « Type — X% — ». Tutoiement, original.

- [ ] **Step 4: Intégrer dans la liste « Ton immeuble » de `Synthese.tsx`**

Add `import { ENERGIE } from "@/content/energie"`. Replace the immeuble list items so each line montre la phrase d'énergie :

```tsx
        <ol className="mt-2 flex flex-col gap-1.5 list-decimal pl-5">
          {immeuble.map((t: TypeId) => (
            <li key={t}>
              <span className="font-medium text-foreground">
                {TYPES[t].nom} — {Math.round(result.socle[t])}%
              </span>{" "}
              — {ENERGIE[t]}
            </li>
          ))}
        </ol>
```

- [ ] **Step 5: Run tests**

Run: `pnpm test -- src/content/energie.test.ts src/features/results/Synthese.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/energie.ts src/content/energie.test.ts src/features/results/Synthese.tsx
git commit -m "✨ content: énergie par étage + intégration immeuble (ultrathink)"
```

---

## Task 4: Contenu `stress.ts` (template base × phase) (ULTRATHINK + jury)

> **Tâche de rédaction à réflexion approfondie** (idem Task 2). C'est la plus délicate : les clauses doivent s'assembler en phrases grammaticalement correctes pour les 36 paires.

**Files:**
- Create: `src/content/stress.ts`, `src/content/stress.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/content/stress.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import {
  STRESS_DECLENCHEUR,
  STRESS_REFLEXE,
  STRESS_RETOUR,
  composeStress,
} from "./stress"
import { TYPE_IDS } from "@/data/types"

describe("stress", () => {
  it("a des clauses non vides pour chaque type", () => {
    for (const t of TYPE_IDS) {
      expect(STRESS_DECLENCHEUR[t].length).toBeGreaterThan(0)
      expect(STRESS_REFLEXE[t].length).toBeGreaterThan(0)
      expect(STRESS_RETOUR[t].length).toBeGreaterThan(0)
    }
  })

  it("compose un texte substantiel pour toute paire base × phase", () => {
    for (const base of TYPE_IDS) {
      for (const phase of TYPE_IDS) {
        expect(composeStress(base, phase).length).toBeGreaterThan(60)
      }
    }
  })

  it("produit une variante spécifique quand base === phase", () => {
    const same = composeStress("empathique", "empathique")
    const diff = composeStress("travaillomane", "empathique")
    expect(same).not.toBe(diff)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/content/stress.test.ts`
Expected: FAIL (`./stress` introuvable).

- [ ] **Step 3: Create `src/content/stress.ts`**

```ts
import type { TypeId } from "@/data/types"

/**
 * « Toi sous stress » — template assemblé base × phase (modèle composeInteraction).
 * 100 % original. Les clauses sont écrites pour s'assembler dans les phrases de
 * `composeStress` ci-dessous (respecter les contrats grammaticaux décrits dans le brief).
 */

// Indexé PHASE — complète « Quand … » (minuscule, pas de point final).
export const STRESS_DECLENCHEUR: Record<TypeId, string> = {
  travaillomane: "…",
  perseverant: "…",
  empathique: "…",
  reveur: "…",
  rebelle: "…",
  promoteur: "…",
}

// Indexé BASE — complète « ton premier réflexe : … » (minuscule initiale, point final).
export const STRESS_REFLEXE: Record<TypeId, string> = {
  travaillomane: "…",
  perseverant: "…",
  empathique: "…",
  reveur: "…",
  rebelle: "…",
  promoteur: "…",
}

// Indexé PHASE — complète « Pour revenir à l'équilibre : … » (minuscule initiale, point final).
export const STRESS_RETOUR: Record<TypeId, string> = {
  travaillomane: "…",
  perseverant: "…",
  empathique: "…",
  reveur: "…",
  rebelle: "…",
  promoteur: "…",
}

export function composeStress(base: TypeId, phase: TypeId): string {
  if (base === phase) {
    return (
      `Quand ${STRESS_DECLENCHEUR[phase]}, la tension monte d'autant plus que c'est aussi ton terrain de fond : ` +
      `ton premier réflexe : ${STRESS_REFLEXE[base]} ` +
      `Pour revenir à l'équilibre : ${STRESS_RETOUR[phase]}`
    )
  }
  return (
    `Quand ${STRESS_DECLENCHEUR[phase]}, ton premier réflexe : ${STRESS_REFLEXE[base]} ` +
    `Pour revenir à l'équilibre : ${STRESS_RETOUR[phase]}`
  )
}
```

**Brief de rédaction (ultrathink)** — respecter les **contrats grammaticaux** pour que l'assemblage soit toujours correct :
- `STRESS_DECLENCHEUR[phase]` : groupe verbal au présent qui complète « Quand … » — décrit le besoin de phase **non nourri**. Minuscule initiale, **pas** de point final. Ex. de forme (à réécrire) : « ton besoin de chaleur et de reconnaissance reste sans réponse ». Ancrer sur `TYPES[phase].besoinPhase`.
- `STRESS_REFLEXE[base]` : phrase complète décrivant le **premier réflexe automatique** sous tension, propre à la base. Minuscule initiale (vient après « : »), **point final**. Ancrer sur `essenceBase` (ex. travaillomane → sur-contrôle/surcharge de détails ; empathique → s'oublie pour faire plaisir ; rebelle → se braque/résiste ; promoteur → force le passage ; perseverant → se durcit sur ses principes ; reveur → se retire/se coupe).
- `STRESS_RETOUR[phase]` : groupe nominal/infinitif décrivant comment **re-nourrir le besoin de phase**. Minuscule initiale, **point final**. Ancrer sur `besoinPhase`.
- Vérifier mentalement la lecture des 2 gabarits (base≠phase et base===phase) pour 2-3 paires avant de figer.
Tutoiement, ton bienveillant non dramatisant, original.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/content/stress.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/content/stress.ts src/content/stress.test.ts
git commit -m "✨ content: section « toi sous stress » (base × phase, ultrathink)"
```

---

## Task 5: Contenu `vigilance.ts` (synthèse base + phase) (ULTRATHINK + jury)

> **Tâche de rédaction à réflexion approfondie** (idem Task 2). Doit rester **court** (synthèse-action), distinct de la « zone de vigilance » longue de `descriptions.ts`.

**Files:**
- Create: `src/content/vigilance.ts`, `src/content/vigilance.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/content/vigilance.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { VIGILANCE_BASE, VIGILANCE_PHASE, composeVigilance } from "./vigilance"
import { TYPE_IDS } from "@/data/types"

describe("vigilance", () => {
  it("a des punchlines non vides pour chaque type", () => {
    for (const t of TYPE_IDS) {
      expect(VIGILANCE_BASE[t].length).toBeGreaterThan(10)
      expect(VIGILANCE_PHASE[t].length).toBeGreaterThan(10)
    }
  })

  it("composeVigilance retourne 2 puces non vides pour toute paire", () => {
    for (const base of TYPE_IDS) {
      for (const phase of TYPE_IDS) {
        const v = composeVigilance(base, phase)
        expect(v.base.length).toBeGreaterThan(10)
        expect(v.phase.length).toBeGreaterThan(10)
      }
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/content/vigilance.test.ts`
Expected: FAIL (`./vigilance` introuvable).

- [ ] **Step 3: Create `src/content/vigilance.ts`**

```ts
import type { TypeId } from "@/data/types"

/**
 * Points de vigilance — synthèse COURTE et actionnable (1 punchline par axe),
 * volontairement distincte de la « zone de vigilance » longue de descriptions.ts.
 * 100 % original.
 */

// « Ce qui peut coincer » — trait de fond, indexé BASE. Phrase brève et concrète.
export const VIGILANCE_BASE: Record<TypeId, string> = {
  travaillomane: "…",
  perseverant: "…",
  empathique: "…",
  reveur: "…",
  rebelle: "…",
  promoteur: "…",
}

// « En ce moment » — point d'attention lié à la PHASE. Phrase brève et concrète.
export const VIGILANCE_PHASE: Record<TypeId, string> = {
  travaillomane: "…",
  perseverant: "…",
  empathique: "…",
  reveur: "…",
  rebelle: "…",
  promoteur: "…",
}

export function composeVigilance(
  base: TypeId,
  phase: TypeId,
): { base: string; phase: string } {
  return { base: VIGILANCE_BASE[base], phase: VIGILANCE_PHASE[phase] }
}
```

**Brief de rédaction (ultrathink)** : pour chaque type, **une** phrase courte (≈ 15-30 mots), concrète et actionnable.
- `VIGILANCE_BASE[t]` : le piège récurrent du trait de fond + l'amorce d'antidote (ex. travaillomane → « ne pas confondre tout maîtriser et bien décider : ose trancher avec une info imparfaite »).
- `VIGILANCE_PHASE[t]` : le point d'attention du moment, lié au besoin de phase (ex. empathique → « attention à ne pas t'effacer pour préserver le lien : tes besoins comptent aussi »).
Distinct du contenu long de `descriptions.ts` (ici : punchy, pas explicatif). Tutoiement, original.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/content/vigilance.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/content/vigilance.ts src/content/vigilance.test.ts
git commit -m "✨ content: points de vigilance synthétiques (base + phase, ultrathink)"
```

---

## Task 6: Hints + onglet 2 `PlusLoin`

**Files:**
- Modify: `src/content/sectionHints.ts`, `src/content/sectionHints.test.ts`
- Create: `src/features/results/PlusLoin.tsx`, `src/features/results/PlusLoin.test.tsx`

- [ ] **Step 1: Mettre à jour `sectionHints.ts` (+ test)**

In `src/content/sectionHints.ts`, add three keys to the object (after `interactions`):

```ts
  canal:
    "Le registre de communication qui passe le plus naturellement avec toi.",
  stress:
    "Comment la tension tend à se manifester quand tes besoins du moment ne sont pas nourris — et comment revenir à l'équilibre.",
  vigilance:
    "Deux points d'attention : un lié à ton fond, un lié à ton moment présent.",
```

In `src/content/sectionHints.test.ts`, update the expected keys array to:

```ts
    expect(Object.keys(SECTION_HINTS)).toEqual([
      "base",
      "phase",
      "immeuble",
      "interactions",
      "canal",
      "stress",
      "vigilance",
    ])
```

- [ ] **Step 2: Run the hints test**

Run: `pnpm test -- src/content/sectionHints.test.ts`
Expected: PASS (clés à jour, phrases non vides).

- [ ] **Step 3: Write the failing PlusLoin test**

Create `src/features/results/PlusLoin.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { PlusLoin } from "./PlusLoin"
import { CANAUX } from "@/content/canaux"
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

describe("PlusLoin", () => {
  it("affiche les 3 sections et le canal de la base", () => {
    render(<PlusLoin result={result} />)
    expect(screen.getByRole("heading", { name: /canal de communication/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /toi sous stress/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /points de vigilance/i })).toBeInTheDocument()
    expect(screen.getByText(CANAUX[result.base])).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm test -- src/features/results/PlusLoin.test.tsx`
Expected: FAIL (`./PlusLoin` introuvable).

- [ ] **Step 5: Create `src/features/results/PlusLoin.tsx`**

```tsx
import { CloudRain, Eye, MessageCircle } from "lucide-react"
import { ResultSection } from "@/components/ResultSection"
import { CANAUX } from "@/content/canaux"
import { composeStress } from "@/content/stress"
import { composeVigilance } from "@/content/vigilance"
import { SECTION_HINTS } from "@/content/sectionHints"
import type { DisplayResult } from "@/lib/scoring"

export function PlusLoin({ result }: { result: DisplayResult }) {
  const { base, phase } = result
  const vigilance = composeVigilance(base, phase)
  return (
    <div className="flex flex-col gap-8">
      <ResultSection titre="Ton canal de communication" hint={SECTION_HINTS.canal} icon={MessageCircle}>
        {CANAUX[base]}
      </ResultSection>
      <ResultSection titre="Toi sous stress" hint={SECTION_HINTS.stress} icon={CloudRain}>
        {composeStress(base, phase)}
      </ResultSection>
      <ResultSection titre="Points de vigilance" hint={SECTION_HINTS.vigilance} icon={Eye}>
        <ul className="flex flex-col gap-1.5 list-disc pl-5">
          <li>{vigilance.base}</li>
          <li>{vigilance.phase}</li>
        </ul>
      </ResultSection>
    </div>
  )
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test -- src/features/results/PlusLoin.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content/sectionHints.ts src/content/sectionHints.test.ts src/features/results/PlusLoin.tsx src/features/results/PlusLoin.test.tsx
git commit -m "✨ feat: onglet « pour aller plus loin » (canal/stress/vigilance)"
```

---

## Task 7: Onglets shadcn dans `ResultsScreen` + e2e

**Files:**
- Create: `src/components/ui/tabs.tsx`
- Modify: `src/features/results/ResultsScreen.tsx`, `e2e/smoke.spec.ts`
- Dependency: `@radix-ui/react-tabs`

- [ ] **Step 1: Installer la dépendance Radix**

Run: `pnpm add @radix-ui/react-tabs`
Expected: ajout dans `package.json` (dependencies).

- [ ] **Step 2: Create `src/components/ui/tabs.tsx`**

> Confirme d'abord que `@/lib/utils` exporte `cn` (utilisé par `src/components/ui/button.tsx`). Si le chemin diffère, adapte l'import.

```tsx
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:ring-ring/50 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

- [ ] **Step 3: Modifier `ResultsScreen.tsx` — envelopper le contenu dans les onglets**

Add imports:
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusLoin } from "./PlusLoin"
```
Replace the content block that currently starts with `<div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start">` … `</div>` (the immeuble/radar + Synthese split) by wrapping it in tabs. The split markup goes **unchanged** inside the first `TabsContent` (just drop the `mt-8` from the inner div since `Tabs` carries the spacing) :

```tsx
      <Tabs defaultValue="profil" className="mt-8">
        <TabsList>
          <TabsTrigger value="profil">Ton profil</TabsTrigger>
          <TabsTrigger value="plus">Pour aller plus loin</TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* ... contenu existant inchangé : colonne gauche (Immeuble + RadarProfil) et colonne droite (Synthese) ... */}
          </div>
        </TabsContent>

        <TabsContent value="plus">
          <div className="rounded-xl border bg-card p-6 md:p-8">
            <PlusLoin result={result} />
          </div>
        </TabsContent>
      </Tabs>
```

> Conserver tel quel l'intérieur de la colonne gauche (section immeuble + section radar avec `Suspense`/`RadarProfil`) et la colonne droite (`<Synthese result={result} />`). Seuls le `<div>` wrapper perd `mt-8` (porté par `<Tabs>`).

- [ ] **Step 4: Vérifier build + tests**

Run: `pnpm build && pnpm test`
Expected: build OK, tous les tests passent.

- [ ] **Step 5: Étendre l'e2e `e2e/smoke.spec.ts`**

À la fin du test (après les assertions de résultats), ajouter :

```ts
  // Onglet « Pour aller plus loin »
  await page.getByRole("tab", { name: /pour aller plus loin/i }).click()
  await expect(page.getByRole("heading", { name: /toi sous stress/i })).toBeVisible()
```

- [ ] **Step 6: Lancer l'e2e**

Run: `pnpm test:e2e`
Expected: 2 tests verts (smoke étendu + share).

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/ui/tabs.tsx src/features/results/ResultsScreen.tsx e2e/smoke.spec.ts
git commit -m "✨ feat: onglets « Ton profil » / « Pour aller plus loin » dans les résultats"
```

---

## Task 8: Vérification globale + documentation mémoire

**Files:**
- Modify: `docs/INDEX.md`, `docs/HANDOFF.md`, `docs/CONVENTIONS.md`, `docs/QUIRKS.md`

- [ ] **Step 1: Gate complet**

Run: `pnpm before_push`
Expected: lint + unit + build + e2e tous verts.

- [ ] **Step 2: Vérification visuelle rapide (recommandé)**

Run `pnpm dev`, finir un test, vérifier les 2 onglets (profil / pour aller plus loin), lire stress/canal/vigilance et l'énergie dans la liste immeuble. Vérifier aussi via un lien partagé `?r=` que l'onglet 2 se reconstruit.

- [ ] **Step 3: Mettre à jour la mémoire**

- `docs/INDEX.md` : ligne feature « Pack restitution Pour aller plus loin » (spec + plan).
- `docs/CONVENTIONS.md` : noter le pattern « encadré de section = `ResultSection` partagé » + « contenu dérivé base/phase via template assemblé (`composeInteraction`/`composeStress`/`composeVigilance`) ».
- `docs/QUIRKS.md` : si un piège est apparu (ex. clés exactes de `SECTION_HINTS` testées → penser à mettre à jour le test en ajoutant une clé).
- `docs/HANDOFF.md` : entrée datée (Dernière chose faite / Trucs en suspens / Prochaine chose à creuser / Notes pour future Claude).

- [ ] **Step 4: Commit + push**

```bash
git add docs/
git commit -m "📝 docs: mémoire à jour (pack restitution « pour aller plus loin »)"
git push
```

---

## Notes de revue

- **DRY** : `ResultSection` est l'unique encadré de section (profil + plus-loin) ; les contenus dérivés réutilisent le pattern `compose*` (pas de 36 textes à la main).
- **Anti-redite** : `vigilance.ts` est court/action, distinct de la « zone de vigilance » longue de `descriptions.ts`.
- **YAGNI** : pas de « motivation actuelle », pas d'onglet dans l'URL, pas de nouvelle question.
- **Partage** : inchangé — onglet 2 entièrement dérivé de `socle`+`phase`.
- **Contenu** : 100 % original, ancré sur `essenceBase`/`besoinPhase`, tâches de rédaction en ultrathink + relecture jury.
```
