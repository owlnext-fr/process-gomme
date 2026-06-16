# Questionnaires par public (enfant / étudiant / adulte) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Proposer le même inventaire à trois publics (enfant / étudiant / adulte) en n'adaptant que le **contexte des questions**, sans toucher au moteur ni au contenu de résultats.

**Architecture:** Structure des questions unique et partagée (squelette testé) + un calque de texte par public (archi i18n maison, zéro dépendance). Le moteur de scoring ne lit que la structure → le valider une fois couvre les trois publics. Le public est choisi sur l'accueil (3 cartes) et porté par l'état du quiz ; les résultats et le lien de partage sont inchangés.

**Tech Stack:** Vite + React + TypeScript, Vitest (unit), Playwright (e2e), Tailwind v4 + shadcn/ui, lucide-react, tool Workflow (génération de contenu).

**Spec:** `docs/superpowers/specs/2026-06-16-questionnaires-par-public-design.md`

---

## Structure des fichiers

**Créés :**
- `src/data/audiences.ts` — `Audience`, `AudienceMeta`, `AUDIENCES` (id, label, icône lucide).
- `src/data/audiences.test.ts` — invariants des publics.
- `src/content/questions/types.ts` — types de calque (`ForcedText`, `LikertText`, `QuestionText`).
- `src/content/questions/adulte.ts` — calque adulte (migration verbatim de l'actuel).
- `src/content/questions/enfant.ts` — calque enfant (généré en Task 7).
- `src/content/questions/etudiant.ts` — calque étudiant (généré en Task 7).
- `src/content/questions/calques.test.ts` — complétude des 3 calques via le resolver.
- `src/lib/questions.ts` — `getQuestions(audience): Question[]` (resolver pur).
- `src/lib/questions.test.ts` — test du resolver.

**Modifiés :**
- `src/data/questions.ts` — devient le **squelette** (`QUESTION_STRUCTURE`, types struct + types résolus). Plus aucun texte.
- `src/data/questions.test.ts` — réécrit sur le squelette (structure + équilibrage).
- `src/lib/scoring.ts` / `src/lib/scoring.test.ts` — lisent `QUESTION_STRUCTURE`.
- `src/features/quiz/quizReducer.ts` / `.test.ts` — `audience` dans l'état, `start` paramétré.
- `src/features/quiz/QuizScreen.tsx` / `.test.tsx` — résout via `getQuestions(state.audience)`.
- `src/features/intro/IntroScreen.tsx` — 3 cartes de public au lieu de « Commencer ».
- `src/App.tsx` / `src/App.test.tsx` — passe le public à `start`.
- `e2e/smoke.spec.ts` / `e2e/share.spec.ts` — cliquent une carte de public.

---

## Task 1 : Type et données des publics

**Files:**
- Create: `src/data/audiences.ts`
- Test: `src/data/audiences.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/data/audiences.test.ts
import { describe, it, expect } from "vitest"
import { AUDIENCES, type Audience } from "./audiences"

describe("AUDIENCES", () => {
  it("liste exactement les 3 publics, dans l'ordre enfant → étudiant → adulte", () => {
    expect(AUDIENCES.map((a) => a.id)).toEqual<Audience[]>(["enfant", "etudiant", "adulte"])
  })

  it("chaque public a un label non vide et une icône", () => {
    for (const a of AUDIENCES) {
      expect(a.label.length).toBeGreaterThan(0)
      expect(a.icon).toBeTypeOf("function") // composant lucide
    }
  })

  it("ids uniques", () => {
    const ids = AUDIENCES.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/data/audiences.test.ts`
Expected: FAIL — `Cannot find module './audiences'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/data/audiences.ts
import { Briefcase, GraduationCap, ToyBrick, type LucideIcon } from "lucide-react"

export type Audience = "enfant" | "etudiant" | "adulte"

export interface AudienceMeta {
  id: Audience
  /** Label affiché sur la carte de l'accueil. */
  label: string
  icon: LucideIcon
}

export const AUDIENCES: AudienceMeta[] = [
  { id: "enfant", label: "Enfant", icon: ToyBrick },
  { id: "etudiant", label: "Étudiant", icon: GraduationCap },
  { id: "adulte", label: "Adulte", icon: Briefcase },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/data/audiences.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/audiences.ts src/data/audiences.test.ts
git commit -m "✨ feat(audiences): type et données des 3 publics (enfant/étudiant/adulte)"
```

---

## Task 2 : Squelette de structure + calque adulte + resolver

Cette tâche extrait la structure des questions (sans texte), migre le texte actuel dans un calque `adulte`, crée le resolver, et garde l'app verte grâce à un export transitoire `QUESTIONS = getQuestions("adulte")`. Les calques `enfant`/`etudiant` sont d'abord de simples **alias d'`adulte`** (remplacés en Task 7).

**Files:**
- Modify: `src/data/questions.ts` (réécriture complète : squelette)
- Create: `src/content/questions/types.ts`
- Create: `src/content/questions/adulte.ts`
- Create: `src/content/questions/enfant.ts` (alias temporaire)
- Create: `src/content/questions/etudiant.ts` (alias temporaire)
- Create: `src/lib/questions.ts`
- Create: `src/lib/questions.test.ts`
- Modify: `src/data/questions.test.ts` (réécriture sur le squelette)

- [ ] **Step 1: Créer les types de calque**

```ts
// src/content/questions/types.ts
import type { TypeId } from "@/data/types"

/** Texte d'une question forcée : énoncé + label par cible. */
export interface ForcedText {
  prompt: string
  labels: Record<TypeId, string>
}

/** Texte d'une question Likert : l'énoncé. */
export interface LikertText {
  statement: string
}

export type QuestionText = ForcedText | LikertText
```

- [ ] **Step 2: Réécrire `src/data/questions.ts` en squelette**

Remplacer TOUT le contenu de `src/data/questions.ts` par :

```ts
import type { TypeId } from "./types"

export type Famille = "base" | "phase"

interface StructBase {
  id: string
  famille: Famille
}

/** Structure d'un choix forcé : 4 cibles distinctes (l'ordre = l'ordre canonique des options). */
export interface ForcedStruct extends StructBase {
  kind: "forced"
  cibles: [TypeId, TypeId, TypeId, TypeId]
}

export interface LikertStruct extends StructBase {
  kind: "likert"
  cible: TypeId
}

export type QuestionStruct = ForcedStruct | LikertStruct

// ── Types RÉSOLUS (avec texte) produits par getQuestions, consommés par l'UI ──
export interface Option {
  label: string
  cible: TypeId
}
export interface ForcedChoice extends StructBase {
  kind: "forced"
  prompt: string
  options: [Option, Option, Option, Option]
}
export interface Likert extends StructBase {
  kind: "likert"
  statement: string
  cible: TypeId
}
export type Question = ForcedChoice | Likert

export const QUESTION_STRUCTURE: QuestionStruct[] = [
  // ── base : 12 forcés ──
  { id: "b-fc-01", famille: "base", kind: "forced", cibles: ["travaillomane", "rebelle", "perseverant", "promoteur"] },
  { id: "b-fc-02", famille: "base", kind: "forced", cibles: ["travaillomane", "empathique", "reveur", "promoteur"] },
  { id: "b-fc-03", famille: "base", kind: "forced", cibles: ["travaillomane", "promoteur", "perseverant", "rebelle"] },
  { id: "b-fc-04", famille: "base", kind: "forced", cibles: ["travaillomane", "reveur", "empathique", "rebelle"] },
  { id: "b-fc-05", famille: "base", kind: "forced", cibles: ["perseverant", "rebelle", "travaillomane", "empathique"] },
  { id: "b-fc-06", famille: "base", kind: "forced", cibles: ["perseverant", "empathique", "reveur", "promoteur"] },
  { id: "b-fc-07", famille: "base", kind: "forced", cibles: ["perseverant", "promoteur", "travaillomane", "reveur"] },
  { id: "b-fc-08", famille: "base", kind: "forced", cibles: ["perseverant", "reveur", "empathique", "rebelle"] },
  { id: "b-fc-09", famille: "base", kind: "forced", cibles: ["empathique", "reveur", "travaillomane", "rebelle"] },
  { id: "b-fc-10", famille: "base", kind: "forced", cibles: ["empathique", "promoteur", "perseverant", "reveur"] },
  { id: "b-fc-11", famille: "base", kind: "forced", cibles: ["reveur", "rebelle", "travaillomane", "promoteur"] },
  { id: "b-fc-12", famille: "base", kind: "forced", cibles: ["promoteur", "rebelle", "perseverant", "empathique"] },
  // ── base : 6 Likert ──
  { id: "b-lk-01", famille: "base", kind: "likert", cible: "travaillomane" },
  { id: "b-lk-02", famille: "base", kind: "likert", cible: "perseverant" },
  { id: "b-lk-03", famille: "base", kind: "likert", cible: "empathique" },
  { id: "b-lk-04", famille: "base", kind: "likert", cible: "reveur" },
  { id: "b-lk-05", famille: "base", kind: "likert", cible: "rebelle" },
  { id: "b-lk-06", famille: "base", kind: "likert", cible: "promoteur" },
  // ── phase : 12 forcés ──
  { id: "p-fc-01", famille: "phase", kind: "forced", cibles: ["travaillomane", "rebelle", "perseverant", "promoteur"] },
  { id: "p-fc-02", famille: "phase", kind: "forced", cibles: ["travaillomane", "empathique", "reveur", "promoteur"] },
  { id: "p-fc-03", famille: "phase", kind: "forced", cibles: ["travaillomane", "promoteur", "perseverant", "rebelle"] },
  { id: "p-fc-04", famille: "phase", kind: "forced", cibles: ["travaillomane", "reveur", "empathique", "rebelle"] },
  { id: "p-fc-05", famille: "phase", kind: "forced", cibles: ["perseverant", "rebelle", "travaillomane", "empathique"] },
  { id: "p-fc-06", famille: "phase", kind: "forced", cibles: ["perseverant", "empathique", "reveur", "promoteur"] },
  { id: "p-fc-07", famille: "phase", kind: "forced", cibles: ["perseverant", "promoteur", "travaillomane", "reveur"] },
  { id: "p-fc-08", famille: "phase", kind: "forced", cibles: ["perseverant", "reveur", "empathique", "rebelle"] },
  { id: "p-fc-09", famille: "phase", kind: "forced", cibles: ["empathique", "reveur", "travaillomane", "rebelle"] },
  { id: "p-fc-10", famille: "phase", kind: "forced", cibles: ["empathique", "promoteur", "perseverant", "reveur"] },
  { id: "p-fc-11", famille: "phase", kind: "forced", cibles: ["reveur", "rebelle", "travaillomane", "promoteur"] },
  { id: "p-fc-12", famille: "phase", kind: "forced", cibles: ["promoteur", "rebelle", "perseverant", "empathique"] },
  // ── phase : 6 Likert ──
  { id: "p-lk-01", famille: "phase", kind: "likert", cible: "travaillomane" },
  { id: "p-lk-02", famille: "phase", kind: "likert", cible: "perseverant" },
  { id: "p-lk-03", famille: "phase", kind: "likert", cible: "empathique" },
  { id: "p-lk-04", famille: "phase", kind: "likert", cible: "reveur" },
  { id: "p-lk-05", famille: "phase", kind: "likert", cible: "rebelle" },
  { id: "p-lk-06", famille: "phase", kind: "likert", cible: "promoteur" },
]
```

> ⚠️ L'ordre des `cibles` de chaque forcé DOIT reproduire l'ordre actuel des `options` dans
> l'ancien `questions.ts` (le label sera réassocié par cible, mais l'ordre canonique sert au
> shuffle). Les valeurs ci-dessus sont relevées sur le fichier actuel — vérifier au diff git.

- [ ] **Step 3: Créer le calque adulte (migration VERBATIM)**

Recopier le texte de l'ancien `questions.ts` dans `adulte.ts`, indexé par id, labels par cible.
Recette mécanique : pour chaque forcé, `prompt` ← l'ancien `prompt` ; `labels[cible]` ← l'ancien
`option.label` de cette cible. Pour chaque Likert, `statement` ← l'ancien `statement`. Exemples :

```ts
// src/content/questions/adulte.ts
import type { QuestionText } from "./types"

export const ADULTE: Record<string, QuestionText> = {
  "b-fc-01": {
    prompt: "Quand je monte un meuble livré en kit, par nature je…",
    labels: {
      travaillomane: "lis la notice du début à la fin et je trie les pièces une à une.",
      rebelle: "laisse la notice de côté et je monte selon mon envie du moment.",
      perseverant: "le monte par principe jusqu'au bout, sans tricher même sur ce qui ne se voit pas.",
      promoteur: "vise le montage entier et je relève le défi sans m'arrêter.",
    },
  },
  // … répéter pour b-fc-02 … p-fc-12 (VERBATIM)
  "b-lk-01": {
    statement:
      "En général, j'ai besoin de comprendre la logique d'une chose et d'avoir les faits avant de me prononcer.",
  },
  // … répéter pour b-lk-02 … p-lk-06 (VERBATIM)
}
```

> Les 36 textes existent déjà dans l'ancien `questions.ts` (récupérable via `git show HEAD:src/data/questions.ts`).
> Copier le texte **tel quel**, sans le retoucher. La complétude est vérifiée par les tests (Steps 7-8).

- [ ] **Step 4: Créer les calques enfant/étudiant en alias temporaire**

```ts
// src/content/questions/enfant.ts
// TEMPORAIRE — remplacé par du contenu dérivé en Task 7.
export { ADULTE as ENFANT } from "./adulte"
```

```ts
// src/content/questions/etudiant.ts
// TEMPORAIRE — remplacé par du contenu dérivé en Task 7.
export { ADULTE as ETUDIANT } from "./adulte"
```

- [ ] **Step 5: Écrire le test du resolver (échoue)**

```ts
// src/lib/questions.test.ts
import { describe, it, expect } from "vitest"
import { getQuestions } from "./questions"
import { QUESTION_STRUCTURE } from "@/data/questions"

describe("getQuestions", () => {
  it("rend 36 questions pour adulte, alignées sur la structure", () => {
    const qs = getQuestions("adulte")
    expect(qs).toHaveLength(QUESTION_STRUCTURE.length)
    qs.forEach((q, i) => {
      const s = QUESTION_STRUCTURE[i]
      expect(q.id).toBe(s.id)
      expect(q.kind).toBe(s.kind)
      expect(q.famille).toBe(s.famille)
    })
  })

  it("réassocie chaque label à sa cible, dans l'ordre canonique de la structure", () => {
    const qs = getQuestions("adulte")
    const q = qs.find((x) => x.id === "b-fc-01")
    expect(q?.kind).toBe("forced")
    if (q?.kind === "forced") {
      expect(q.options.map((o) => o.cible)).toEqual(["travaillomane", "rebelle", "perseverant", "promoteur"])
      expect(q.options[0].label.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 6: Implémenter le resolver**

```ts
// src/lib/questions.ts
import { QUESTION_STRUCTURE, type Option, type Question } from "@/data/questions"
import type { Audience } from "@/data/audiences"
import type { ForcedText, LikertText, QuestionText } from "@/content/questions/types"
import { ADULTE } from "@/content/questions/adulte"
import { ENFANT } from "@/content/questions/enfant"
import { ETUDIANT } from "@/content/questions/etudiant"

const CALQUES: Record<Audience, Record<string, QuestionText>> = {
  adulte: ADULTE,
  enfant: ENFANT,
  etudiant: ETUDIANT,
}

/** Fusionne le squelette avec le calque du public → questions résolues prêtes pour l'UI. */
export function getQuestions(audience: Audience): Question[] {
  const calque = CALQUES[audience]
  return QUESTION_STRUCTURE.map((s): Question => {
    const t = calque[s.id]
    if (s.kind === "forced") {
      const ft = t as ForcedText
      const options = s.cibles.map((c) => ({ cible: c, label: ft.labels[c] })) as [
        Option,
        Option,
        Option,
        Option,
      ]
      return { id: s.id, famille: s.famille, kind: "forced", prompt: ft.prompt, options }
    }
    return { id: s.id, famille: s.famille, kind: "likert", cible: s.cible, statement: (t as LikertText).statement }
  })
}
```

- [ ] **Step 7: Réécrire `src/data/questions.test.ts` sur le squelette + ajouter l'export transitoire**

D'abord, ajouter en bas de `src/data/questions.ts` l'export transitoire (sera retiré en Task 5).
⚠️ Ne PAS importer `getQuestions` ici (cela créerait un cycle `data/questions ↔ lib/questions`
→ TDZ sur `CALQUES`). Faire une fusion **locale** (volontairement dupliquée, supprimée en Task 5) :

```ts
// TRANSITOIRE — maintient les consommateurs existants verts jusqu'à leur migration (Task 3-5).
// Fusion locale (PAS d'import de lib/questions → pas de cycle). Retiré en Task 5.
import { ADULTE } from "@/content/questions/adulte"
import type { ForcedText, LikertText } from "@/content/questions/types"
export const QUESTIONS: Question[] = QUESTION_STRUCTURE.map((s): Question => {
  const t = ADULTE[s.id]
  if (s.kind === "forced") {
    const ft = t as ForcedText
    const options = s.cibles.map((c) => ({ cible: c, label: ft.labels[c] })) as [
      Option,
      Option,
      Option,
      Option,
    ]
    return { id: s.id, famille: s.famille, kind: "forced", prompt: ft.prompt, options }
  }
  return { id: s.id, famille: s.famille, kind: "likert", cible: s.cible, statement: (t as LikertText).statement }
})
```

Puis remplacer `src/data/questions.test.ts` par :

```ts
import { describe, it, expect } from "vitest"
import { QUESTION_STRUCTURE, type Famille, type ForcedStruct, type LikertStruct } from "./questions"
import { TYPE_IDS, type TypeId } from "./types"

const FAMILLES: Famille[] = ["base", "phase"]
const forced = QUESTION_STRUCTURE.filter((q): q is ForcedStruct => q.kind === "forced")
const likert = QUESTION_STRUCTURE.filter((q): q is LikertStruct => q.kind === "likert")

function byFamille<T extends { famille: Famille }>(arr: T[], f: Famille) {
  return arr.filter((q) => q.famille === f)
}

describe("QUESTION_STRUCTURE — structure globale", () => {
  it("contient exactement 36 items", () => {
    expect(QUESTION_STRUCTURE).toHaveLength(36)
  })
  it("18 base et 18 phase", () => {
    expect(byFamille(QUESTION_STRUCTURE, "base")).toHaveLength(18)
    expect(byFamille(QUESTION_STRUCTURE, "phase")).toHaveLength(18)
  })
  it("par famille : 12 choix forcés + 6 Likert", () => {
    for (const f of FAMILLES) {
      expect(byFamille(forced, f)).toHaveLength(12)
      expect(byFamille(likert, f)).toHaveLength(6)
    }
  })
  it("ids uniques", () => {
    const ids = QUESTION_STRUCTURE.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe("QUESTION_STRUCTURE — choix forcés", () => {
  it("chaque forcé a 4 cibles distinctes et valides", () => {
    for (const q of forced) {
      expect(q.cibles).toHaveLength(4)
      expect(new Set(q.cibles).size).toBe(4)
      for (const c of q.cibles) expect(TYPE_IDS).toContain(c)
    }
  })
})

describe("QUESTION_STRUCTURE — Likert", () => {
  it("chaque Likert cible un type valide", () => {
    for (const q of likert) expect(TYPE_IDS).toContain(q.cible)
  })
})

describe("QUESTION_STRUCTURE — équilibrage (8× forcé + 1× Likert par type et famille)", () => {
  function comptage(f: Famille): Record<TypeId, { fc: number; lk: number }> {
    const init = Object.fromEntries(TYPE_IDS.map((t) => [t, { fc: 0, lk: 0 }])) as Record<
      TypeId,
      { fc: number; lk: number }
    >
    for (const q of byFamille(forced, f)) for (const c of q.cibles) init[c].fc += 1
    for (const q of byFamille(likert, f)) init[q.cible].lk += 1
    return init
  }
  it("chaque type est cible 8× en forcé et 1× en Likert, dans chaque famille", () => {
    for (const f of FAMILLES) {
      const c = comptage(f)
      for (const t of TYPE_IDS) {
        expect(c[t].fc, `${t} forcé en ${f}`).toBe(8)
        expect(c[t].lk, `${t} likert en ${f}`).toBe(1)
      }
    }
  })
})
```

- [ ] **Step 8: Lancer toute la suite et vérifier la parité**

Run: `pnpm test`
Expected: PASS. En particulier `questions.test.ts`, `questions` (resolver), et — grâce à l'export transitoire `QUESTIONS` — `scoring.test.ts`, `quizReducer.test.ts`, `QuizScreen.test.tsx` restent verts **sans modification**.

Si l'équilibrage échoue (`8×`), c'est qu'une ligne `cibles` ne reproduit pas l'ordre/les types de l'ancien fichier : comparer avec `git show HEAD:src/data/questions.ts`.

- [ ] **Step 9: Commit**

```bash
git add src/data/questions.ts src/data/questions.test.ts src/content/questions/ src/lib/questions.ts src/lib/questions.test.ts
git commit -m "♻️ refactor(questions): squelette de structure + calque adulte + resolver getQuestions"
```

---

## Task 3 : Brancher le scoring sur le squelette

Le moteur ne lit que la structure : on le fait pointer sur `QUESTION_STRUCTURE` (et son test aussi), ce qui prouve que le scoring est indépendant du public.

**Files:**
- Modify: `src/lib/scoring.ts:1` (import) et la boucle de `computeResult`
- Modify: `src/lib/scoring.test.ts` (`answersFavorisant` sur le squelette)

- [ ] **Step 1: Adapter le test du moteur au squelette**

Dans `src/lib/scoring.test.ts`, remplacer l'import et le helper :

```ts
import { QUESTION_STRUCTURE } from "@/data/questions"
// …
function answersFavorisant(cibleBase: TypeId, ciblePhase: TypeId): Answers {
  const a: Answers = {}
  for (const q of QUESTION_STRUCTURE) {
    const cible = q.famille === "base" ? cibleBase : ciblePhase
    if (q.kind === "forced") {
      const choix = q.cibles.includes(cible) ? cible : q.cibles[0]
      a[q.id] = { kind: "forced", cible: choix }
    } else {
      a[q.id] = { kind: "likert", valeur: q.cible === cible ? 5 : 1 }
    }
  }
  return a
}
```

(Le reste du fichier — les `it(...)` — est inchangé.)

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/lib/scoring.test.ts`
Expected: FAIL — `q.cibles`/`QUESTION_STRUCTURE` n'existent pas encore côté import du test tant que… (en réalité ils existent depuis Task 2 ; le test doit déjà PASSER ici car le helper est équivalent). Si PASS d'emblée, c'est attendu — passer au Step 3.

- [ ] **Step 3: Brancher `computeResult` sur le squelette**

Dans `src/lib/scoring.ts`, ligne 1 :

```ts
import { QUESTION_STRUCTURE } from "@/data/questions"
```

Et dans `computeResult`, remplacer `for (const q of QUESTIONS)` par `for (const q of QUESTION_STRUCTURE)`. Le corps de la boucle est inchangé (il lit `q.famille`, `q.kind`, `q.id`, et `q.cible` pour le Likert — tous présents dans le squelette).

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- src/lib/scoring.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring.ts src/lib/scoring.test.ts
git commit -m "♻️ refactor(scoring): lit la structure des questions (indépendant du public)"
```

---

## Task 4 : Public dans l'état du quiz + action `start` paramétrée

**Files:**
- Modify: `src/features/quiz/quizReducer.ts`
- Modify: `src/features/quiz/quizReducer.test.ts`

- [ ] **Step 1: Écrire/adapter les tests du reducer (échouent)**

Dans `src/features/quiz/quizReducer.test.ts`, remplacer l'import `QUESTIONS` et le test `start` :

```ts
import { quizReducer, initialState, type QuizState } from "./quizReducer"
import { QUESTION_STRUCTURE } from "@/data/questions"

const DERNIER = QUESTION_STRUCTURE.length - 1
```

```ts
  it("démarre sur l'intro sans public choisi", () => {
    expect(initialState.screen).toBe("intro")
    expect(initialState.index).toBe(0)
    expect(initialState.audience).toBeNull()
  })

  it("start passe au quiz à l'index 0 et mémorise le public", () => {
    const s = quizReducer(initialState, { type: "start", audience: "enfant" })
    expect(s.screen).toBe("quiz")
    expect(s.index).toBe(0)
    expect(s.audience).toBe("enfant")
  })
```

Dans les autres `it(...)`, les états littéraux `{ screen, index, answers }` doivent inclure `audience` (ex. `{ screen: "quiz", index: 0, answers: {}, audience: "adulte" }`) pour satisfaire le type `QuizState`.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/features/quiz/quizReducer.test.ts`
Expected: FAIL — `initialState.audience` n'existe pas / `start` n'accepte pas `audience`.

- [ ] **Step 3: Implémenter dans le reducer**

```ts
// src/features/quiz/quizReducer.ts
import type { Answer, Answers } from "@/lib/scoring"
import { QUESTION_STRUCTURE } from "@/data/questions"
import type { Audience } from "@/data/audiences"

export type Screen = "intro" | "quiz" | "results"

export interface QuizState {
  screen: Screen
  index: number
  answers: Answers
  audience: Audience | null
}

export const initialState: QuizState = { screen: "intro", index: 0, answers: {}, audience: null }

export type Action =
  | { type: "start"; audience: Audience }
  | { type: "answer"; id: string; answer: Answer }
  | { type: "next" }
  | { type: "prev" }
  | { type: "restart" }

export function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "start":
      return { ...state, screen: "quiz", index: 0, audience: action.audience }
    case "answer":
      return { ...state, answers: { ...state.answers, [action.id]: action.answer } }
    case "next":
      if (state.index >= QUESTION_STRUCTURE.length - 1) return { ...state, screen: "results" }
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

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- src/features/quiz/quizReducer.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/quiz/quizReducer.ts src/features/quiz/quizReducer.test.ts
git commit -m "✨ feat(quiz): public (audience) dans l'état, action start paramétrée"
```

---

## Task 5 : QuizScreen résout les questions selon le public + retrait de l'export transitoire

**Files:**
- Modify: `src/features/quiz/QuizScreen.tsx`
- Modify: `src/features/quiz/QuizScreen.test.tsx`
- Modify: `src/data/questions.ts` (retrait de l'export transitoire `QUESTIONS`)

- [ ] **Step 1: Adapter le test de QuizScreen (échoue)**

Dans `src/features/quiz/QuizScreen.test.tsx`, remplacer l'import et la dérivation des index, et ajouter `audience` aux états :

```ts
import { getQuestions } from "@/lib/questions"

const questions = getQuestions("adulte")
const premierForced = questions.findIndex((q) => q.kind === "forced")
const premierLikert = questions.findIndex((q) => q.kind === "likert")
```

Puis dans chaque `render(<QuizScreen state={{ … }} … />)`, ajouter `audience: "adulte"` à l'objet `state`, et remplacer `QUESTIONS[...]` par `questions[...]`. Exemple pour le 2ᵉ test :

```ts
const q = questions[premierForced]
const cible = q.kind === "forced" ? q.options[0].cible : "travaillomane"
render(
  <QuizScreen
    state={{ screen: "quiz", index: premierForced, answers: { [q.id]: { kind: "forced", cible } }, audience: "adulte" }}
    dispatch={dispatch}
  />,
)
```

(Appliquer le même ajout `audience: "adulte"` aux 5 `render` du fichier.)

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/features/quiz/QuizScreen.test.tsx`
Expected: FAIL — `state` sans `audience` n'est plus assignable, ou `questions` indéfini tant que QuizScreen n'est pas adapté.

- [ ] **Step 3: Adapter QuizScreen**

Dans `src/features/quiz/QuizScreen.tsx` :

```ts
// remplacer l'import des données
import { type Option } from "@/data/questions"
import { getQuestions } from "@/lib/questions"
```

Et au début du composant, remplacer l'usage de `QUESTIONS` :

```ts
  const reduce = useReducedMotion()
  const questions = useMemo(() => getQuestions(state.audience ?? "adulte"), [state.audience])
  const q = questions[state.index]
  const reponse = state.answers[q.id]
  const total = questions.length
  const reponseManquante = !reponse
  const derniere = state.index === total - 1

  const ordres = useMemo(
    () =>
      Object.fromEntries(
        questions.map((qq) => [
          qq.id,
          qq.kind === "forced" ? shuffledIndices(qq.options.length) : [],
        ]),
      ) as Record<string, number[]>,
    [questions],
  )
```

(Le `?? "adulte"` est une garde : le quiz n'est atteint qu'après `start`, qui fixe toujours `audience`. Le reste du JSX est inchangé.)

- [ ] **Step 4: Retirer l'export transitoire `QUESTIONS`**

Dans `src/data/questions.ts`, supprimer le bloc transitoire ajouté en Task 2 Step 7 (les lignes `import { getQuestions } …` et `export const QUESTIONS …`).

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS sur toute la suite. Si une erreur `QUESTIONS is not exported` apparaît, c'est qu'un consommateur n'a pas été migré — vérifier par `grep -rn "QUESTIONS" src/` (ne doivent rester que `QUESTION_STRUCTURE` et `getQuestions`).

- [ ] **Step 6: Commit**

```bash
git add src/features/quiz/QuizScreen.tsx src/features/quiz/QuizScreen.test.tsx src/data/questions.ts
git commit -m "♻️ refactor(quiz): QuizScreen résout les questions via getQuestions(audience)"
```

---

## Task 6 : Accueil — 3 cartes de public + câblage App + e2e

**Files:**
- Modify: `src/features/intro/IntroScreen.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `e2e/smoke.spec.ts`
- Modify: `e2e/share.spec.ts`

- [ ] **Step 1: Adapter `App.test.tsx` (échoue)**

Remplacer les 2 assertions qui cherchent le bouton « Commencer » :

```ts
  it("affiche l'écran d'intro avec les 3 cartes de public", () => {
    render(<App />)
    expect(screen.getByRole("heading", { name: /process gomme/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /enfant/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /étudiant/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /adulte/i })).toBeInTheDocument()
  })
```

```ts
  it("ignore un ?r= invalide et affiche l'intro", () => {
    window.history.pushState({}, "", "?r=corrompu!!!")
    render(<App />)
    expect(screen.getByRole("button", { name: /enfant/i })).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/App.test.tsx`
Expected: FAIL — pas de bouton « enfant » (l'intro a encore « Commencer »).

- [ ] **Step 3: Réécrire `IntroScreen.tsx` avec les 3 cartes**

```tsx
// src/features/intro/IntroScreen.tsx
import { AUDIENCES, type Audience } from "@/data/audiences"
import { SplitLayout } from "@/components/SplitLayout"
import { ProfilExplainer } from "@/components/ProfilExplainer"

export function IntroScreen({ onStart }: { onStart: (audience: Audience) => void }) {
  return (
    <SplitLayout
      hideRightOnMobile
      left={
        <div className="flex flex-1 flex-col justify-center gap-6 max-md:items-center max-md:text-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">process gomme</h1>
            <p className="text-muted-foreground">
              36 questions, environ 5 minutes. Tout reste dans ton navigateur :
              aucune réponse n'est envoyée ni enregistrée.
            </p>
          </div>
          <div className="flex flex-col gap-3 max-md:w-full">
            <p className="text-sm font-medium">Pour qui ?</p>
            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
              {AUDIENCES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onStart(id)}
                  className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center transition hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-md:flex-row max-md:justify-center"
                >
                  <Icon className="size-8 text-primary" aria-hidden />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      right={<ProfilExplainer />}
    />
  )
}
```

- [ ] **Step 4: Câbler le public dans `App.tsx`**

Remplacer le bloc intro de `src/App.tsx` :

```tsx
  if (state.screen === "intro") {
    return <IntroScreen onStart={(audience) => dispatch({ type: "start", audience })} />
  }
```

- [ ] **Step 5: Adapter les e2e (point d'entrée = carte de public)**

Dans `e2e/smoke.spec.ts`, remplacer le clic « commencer » par le public **enfant** (couvre un public non-adulte) :

```ts
  await expect(page.getByRole("heading", { name: /process gomme/i })).toBeVisible()
  await page.getByRole("button", { name: /enfant/i }).click()
```

Dans `e2e/share.spec.ts`, remplacer le clic « commencer » par :

```ts
  await page.getByRole("button", { name: /adulte/i }).click()
```

(Le reste des deux specs est inchangé : ni l'une ni l'autre n'assertent le texte des questions.)

- [ ] **Step 6: Run unit tests**

Run: `pnpm test`
Expected: PASS (App + le reste).

- [ ] **Step 7: Run e2e**

Run: `pnpm test:e2e`
Expected: PASS (2 specs). À ce stade, le public enfant affiche encore le texte adulte (alias) — l'e2e n'y touche pas, il passe.

- [ ] **Step 8: Commit**

```bash
git add src/features/intro/IntroScreen.tsx src/App.tsx src/App.test.tsx e2e/smoke.spec.ts e2e/share.spec.ts
git commit -m "✨ feat(intro): choix du public en 3 cartes sur l'accueil"
```

---

## Task 7 : Génération du contenu enfant + étudiant (Workflow jury)

Remplace les alias par du vrai contenu dérivé. **Cette tâche est générative** : la validation
automatique porte sur la **complétude/forme** des calques (Step 4) ; la qualité est validée par
le conseil de personas pendant la génération + relecture humaine.

> ⚠️ Pré-requis : le tool **Workflow** s'invoque depuis la boucle principale (pas un sous-agent).
> Voir `docs/QUIRKS.md` (« Tool Workflow ») : inliner les données dans le script, script résilient
> aux `null`, possibilité de fusionner le jury en 1 agent multi-angles si rate-limit, reprise via
> `resumeFromRunId`.

- [ ] **Step 1: Préparer l'entrée**

Construire, pour chaque cible (`enfant`, `etudiant`), la liste des 36 questions adultes de
référence sous forme `{ id, kind, famille, prompt?, statement?, labels?: {cible: texte} }`
en lisant `src/content/questions/adulte.ts` + `QUESTION_STRUCTURE`. Inliner ces données dans
le script Workflow (ne pas les passer via `args`).

- [ ] **Step 2: Écrire et lancer le Workflow de génération**

Squelette du script (à adapter ; itération **par question**, conseil de **5 personas**, ultrathink) :

```js
export const meta = {
  name: 'derive-questions-public',
  description: 'Dérive le texte des questions adultes vers enfant/étudiant (contexte, pas sens)',
  phases: [{ title: 'Dériver' }, { title: 'Conseil' }],
}

// Données inlinées (cf. Step 1)
const ADULTE = [ /* { id, kind, famille, prompt, statement, labels } × 36 */ ]
const CIBLE = args && args.audience ? args.audience : 'enfant'  // lancer une fois par public

const CONTRAT = `
Dérive le CONTEXTE, jamais le SENS. Le label d'une cible doit toujours exprimer la tendance
de ce type. Public = ${CIBLE} (enfant = école primaire ; etudiant = lycée/études sup).
Contrats de continuation : base = verbe 1re pers. SANS « je » en tête ; phase = infinitif/subordonnée.
Forme parallèle non-orientante (longueur/structure/registre comparables). Français correct, accents.
100% original. Ex enfant : « meuble en kit » → « boîte de Lego ».`

const SCHEMA = { /* { id, prompt?, statement?, labels?: {<cible>: string} } */ }

const results = await pipeline(
  ADULTE,
  (q) => agent(
    `${CONTRAT}\nRé-habille cette question pour ${CIBLE}, en gardant les cibles :\n${JSON.stringify(q)}`,
    { label: `derive:${q.id}`, phase: 'Dériver', schema: SCHEMA, effort: 'high' },
  ),
  // Conseil de 5 personas fusionné en 1 agent multi-angles (anti rate-limit, cf. QUIRKS) :
  (draft, q) => agent(
    `Tu es un conseil de 5 voix qui jugent ce ré-habillage pour ${CIBLE} :
     ① Gardien du sens (cible préservée ?) ② Spécialiste du public (instituteur/conseiller : crédible ?)
     ③ Styliste (forme parallèle non-orientante) ④ Grammairien (continuation + accents)
     ⑤ Le public lui-même (« ça me parle ? »).
     Question d'origine: ${JSON.stringify(q)}\nProposition: ${JSON.stringify(draft)}
     Corrige si ≥2 voix tiquent, renvoie la version finale validée.`,
    { label: `conseil:${q.id}`, phase: 'Conseil', schema: SCHEMA, effort: 'high' },
  ),
)
return results.filter(Boolean)
```

Lancer **une fois par public** (`args: { audience: "enfant" }` puis `{ audience: "etudiant" }`).
En cas de rate-limit, relancer avec `resumeFromRunId` pour réutiliser le cache.

- [ ] **Step 3: Écrire les calques générés + l'artefact de provenance**

À partir des objets retournés, écrire :
- `src/content/questions/enfant.ts` : `export const ENFANT: Record<string, QuestionText> = { … }` (forme identique à `adulte.ts`, labels indexés par cible).
- `src/content/questions/etudiant.ts` : `export const ETUDIANT: Record<string, QuestionText> = { … }`.
- `docs/superpowers/artifacts/2026-06-16-questions-publics.json` : sortie brute du Workflow (brouillons + versions validées).

Remettre les imports du resolver tels quels (ils importent déjà `ENFANT`/`ETUDIANT` — qui ne sont plus des alias).

- [ ] **Step 4: Écrire le test de complétude des calques**

```ts
// src/content/questions/calques.test.ts
import { describe, it, expect } from "vitest"
import { AUDIENCES } from "@/data/audiences"
import { getQuestions } from "@/lib/questions"

describe("calques de questions — complétude par public", () => {
  for (const { id: audience } of AUDIENCES) {
    it(`${audience} : 36 questions, textes non vides, cibles préservées`, () => {
      const qs = getQuestions(audience)
      expect(qs).toHaveLength(36)
      for (const q of qs) {
        if (q.kind === "forced") {
          expect(q.prompt.trim().length).toBeGreaterThan(0)
          expect(q.options).toHaveLength(4)
          expect(new Set(q.options.map((o) => o.cible)).size).toBe(4)
          for (const o of q.options) expect(o.label.trim().length).toBeGreaterThan(0)
        } else {
          expect(q.statement.trim().length).toBeGreaterThan(0)
        }
      }
    })
  }

  it("enfant et étudiant diffèrent d'adulte sur la majorité des énoncés", () => {
    const a = getQuestions("adulte")
    const e = getQuestions("enfant")
    const diff = a.filter((q, i) => {
      const t1 = q.kind === "forced" ? q.prompt : q.statement
      const o = e[i]
      const t2 = o.kind === "forced" ? o.prompt : o.statement
      return t1 !== t2
    }).length
    expect(diff).toBeGreaterThan(a.length / 2)
  })
})
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm test -- src/content/questions/calques.test.ts`
Expected: PASS (les 3 publics complets ; enfant ≠ adulte majoritairement).

- [ ] **Step 6: Relecture humaine**

Lire `enfant.ts` et `etudiant.ts` à l'œil : contexte crédible pour le public, sens préservé,
forme parallèle, français correct. Retoucher à la main si besoin (les tests restent verts).

- [ ] **Step 7: Commit**

```bash
git add src/content/questions/enfant.ts src/content/questions/etudiant.ts src/content/questions/calques.test.ts docs/superpowers/artifacts/2026-06-16-questions-publics.json
git commit -m "✨ feat(content): questions dérivées pour enfant et étudiant (conseil 5 personas)"
```

---

## Task 8 : Gate complet + mémoire projet

**Files:**
- Modify: `docs/INDEX.md`, `docs/HANDOFF.md`, `docs/QUIRKS.md`, `CLAUDE.md` (si règle), `docs/CONVENTIONS.md` (si pattern)

- [ ] **Step 1: Gate CI complet en local**

Run: `pnpm before_push`
Expected: PASS — `lint` + `test` (unit) + `build` + `test:e2e`. Corriger toute erreur avant de continuer.

- [ ] **Step 2: Mettre à jour la mémoire projet** (règle non-négociable du `CLAUDE.md`)

- `docs/INDEX.md` : ajouter une ligne « Questionnaires par public (enfant/étudiant/adulte) » avec liens spec/plan.
- `docs/HANDOFF.md` : entrée datée 2026-06-16 (dernière chose faite / en suspens / notes future Claude).
- `docs/QUIRKS.md` : ajouter le quirk « squelette `QUESTION_STRUCTURE` (data) vs calques de texte (content) ; le scoring lit le squelette, le public n'affecte que le texte » + « labels de calque indexés par cible (l'unicité des 4 cibles garantit l'absence de désalignement) ».
- `docs/CONVENTIONS.md` : pattern « nouvelle question = ajouter au squelette + un texte dans CHAQUE calque (adulte/enfant/etudiant) ; sinon le test de complétude casse ».
- `CLAUDE.md` : si une règle permanente émerge (ex. « tout ajout de question touche les 3 calques »).

- [ ] **Step 3: Commit**

```bash
git add docs/ CLAUDE.md
git commit -m "📝 docs: mémoire à jour (questionnaires par public)"
```

- [ ] **Step 4: Push**

```bash
git push origin main
```

---

## Notes de revue (auto-check)

- **Couverture spec** : modèle de données (Task 2), resolver (Task 2), scoring sur squelette (Task 3), public dans l'état (Task 4), QuizScreen (Task 5), 3 cartes accueil (Task 6), génération enfant/étudiant via jury (Task 7), tests calques/resolver/intro/reducer + e2e (Tasks 2,5,6,7), partage inchangé (aucune tâche ne le modifie — voulu). ✅
- **Non-goals respectés** : zéro dépendance i18n, pas d'autres langues, contenu de résultats commun, public non encodé dans `?r=`, pas de sélecteur en cours de quiz. ✅
- **Cohérence des types** : `QUESTION_STRUCTURE`/`QuestionStruct`/`ForcedStruct`/`LikertStruct` (data) ; `Question`/`Option`/`ForcedChoice`/`Likert` (résolus, data) ; `QuestionText`/`ForcedText`/`LikertText` (content) ; `getQuestions(audience)` (lib) ; `Audience`/`AUDIENCES` (data). Noms identiques d'une tâche à l'autre. ✅
- **Verts à chaque commit** : l'export transitoire `QUESTIONS = getQuestions("adulte")` (Task 2) puis son retrait (Task 5) garantissent que chaque commit compile et passe les tests ; les alias enfant/étudiant (Task 2) gardent le resolver typé jusqu'à la génération (Task 7). ✅
