# Bloc 2 — Conception des 36 questions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produire le contenu typé du test — les 6 types et 36 items (18 base + 18 phase, 12 choix forcés + 6 Likert par famille) — équilibrés, discriminants et 100 % originaux, avec des tests de cohérence structurelle qui garantissent les invariants d'équilibrage.

**Architecture:** Données pures, aucune logique de scoring (Bloc 3). Deux fichiers de données (`src/data/types.ts`, `src/data/questions.ts`) + deux fichiers de tests Vitest. Les 36 items sont écrits sur une **ossature d'appariement 4-régulière déjà fixée et prouvée équilibrée** (ci-dessous), pour que l'effort de rédaction porte sur l'originalité, la plausibilité et le pouvoir discriminant — pas sur la combinatoire.

**Tech Stack:** TypeScript, Vitest. Pas d'UI, pas de dépendance nouvelle.

**Spec source :** `docs/superpowers/specs/2026-06-13-bloc2-conception-questions-design.md`

> ⚠️ **Tasks 3 et 4 sont à exécuter en ULTRATHINK** (rédaction des items = cœur créatif/combinatoire, priorité du brief). Utiliser le modèle le plus capable + raisonnement étendu. Contrainte transverse : contenu **original**, jamais de reformulation de matériel propriétaire. Noms officiels des 6 types en façade (décision Adrien), tout le reste maison.

---

## Ossature d'appariement (FIXÉE — ne pas recombiner)

Identique pour les deux familles (base et phase). 12 choix forcés, chaque type en cible
exactement 4 fois. L'assignation A/B (quelle option en premier) est libre, choisie par
plausibilité du scénario.

| id (suffixe) | Type option ① | Type option ② |
|---|---|---|
| fc-01 | travaillomane | rebelle |
| fc-02 | travaillomane | empathique |
| fc-03 | travaillomane | promoteur |
| fc-04 | travaillomane | reveur |
| fc-05 | perseverant | rebelle |
| fc-06 | perseverant | empathique |
| fc-07 | perseverant | promoteur |
| fc-08 | perseverant | reveur |
| fc-09 | empathique | reveur |
| fc-10 | empathique | promoteur |
| fc-11 | reveur | rebelle |
| fc-12 | promoteur | rebelle |

Likert (1 par type, par famille) :

| id (suffixe) | cible |
|---|---|
| lk-01 | travaillomane |
| lk-02 | perseverant |
| lk-03 | empathique |
| lk-04 | reveur |
| lk-05 | rebelle |
| lk-06 | promoteur |

→ par famille, chaque type = 4 (FC) + 1 (Likert) = **5 apparitions-cible**. ids complets :
`b-fc-01`…`b-fc-12`, `b-lk-01`…`b-lk-06`, `p-fc-01`…`p-fc-12`, `p-lk-01`…`p-lk-06`.

---

## File Structure

| Fichier | Responsabilité |
|---|---|
| `src/data/types.ts` | Les 6 types : `TypeId`, `TypeMeta`, `TYPES`, `TYPE_IDS` (contenu original) |
| `src/data/types.test.ts` | Invariants des 6 types (complétude, champs non vides, ordre) |
| `src/data/questions.ts` | `Famille`, `ForcedChoice`, `Likert`, `Question`, `QUESTIONS` (36 items) |
| `src/data/questions.test.ts` | Invariants d'équilibrage et de structure des 36 items |

---

## Task 1: Les 6 types (`src/data/types.ts`)

**Files:**
- Create: `src/data/types.ts`
- Test: `src/data/types.test.ts`

- [ ] **Step 1: Écrire le test des types (échoue : fichier absent)**

Create `src/data/types.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { TYPES, TYPE_IDS, type TypeId } from "./types"

describe("TYPES", () => {
  it("contient exactement les 6 types dans l'ordre canonique", () => {
    expect(TYPE_IDS).toEqual([
      "travaillomane",
      "perseverant",
      "empathique",
      "reveur",
      "rebelle",
      "promoteur",
    ])
  })

  it("chaque type a un nom, une essence base et un besoin phase non vides", () => {
    for (const id of TYPE_IDS) {
      const t = TYPES[id]
      expect(t.id).toBe(id)
      expect(t.nom.length).toBeGreaterThan(0)
      expect(t.essenceBase.length).toBeGreaterThan(20)
      expect(t.besoinPhase.length).toBeGreaterThan(20)
    }
  })

  it("les ids de TYPES correspondent à TYPE_IDS", () => {
    expect(Object.keys(TYPES).sort()).toEqual([...TYPE_IDS].sort())
  })
})
```

- [ ] **Step 2: Lancer le test → échec (module introuvable)**

Run: `pnpm test src/data/types.test.ts`
Expected: FAIL (`Cannot find module './types'`).

- [ ] **Step 3: Écrire `src/data/types.ts` (contenu ORIGINAL)**

Create `src/data/types.ts`:
```ts
export type TypeId =
  | "travaillomane"
  | "perseverant"
  | "empathique"
  | "reveur"
  | "rebelle"
  | "promoteur"

export interface TypeMeta {
  id: TypeId
  nom: string
  /** Filtre perceptuel stable (base) — formulation originale. */
  essenceBase: string
  /** Besoin psychologique du moment (phase) — formulation originale. */
  besoinPhase: string
}

export const TYPE_IDS: TypeId[] = [
  "travaillomane",
  "perseverant",
  "empathique",
  "reveur",
  "rebelle",
  "promoteur",
]

export const TYPES: Record<TypeId, TypeMeta> = {
  travaillomane: {
    id: "travaillomane",
    nom: "Travaillomane",
    essenceBase:
      "Lit le monde en pensées et en structures : il trie, planifie et cherche la logique et les faits avant d'avancer.",
    besoinPhase:
      "A besoin que la qualité de son travail soit reconnue et de disposer de repères de temps clairs.",
  },
  perseverant: {
    id: "perseverant",
    nom: "Persévérant",
    essenceBase:
      "Lit le monde en valeurs et en opinions : il jauge ce qui est juste, fiable et digne d'engagement.",
    besoinPhase:
      "A besoin que ses convictions et son engagement soient reconnus et respectés.",
  },
  empathique: {
    id: "empathique",
    nom: "Empathique",
    essenceBase:
      "Lit le monde en émotions et en liens : il ressent l'ambiance et prend soin de la relation.",
    besoinPhase:
      "A besoin d'être reconnu en tant que personne, avec de la chaleur et un contact bienveillant.",
  },
  reveur: {
    id: "reveur",
    nom: "Rêveur",
    essenceBase:
      "Lit le monde en images et en réflexions intérieures : il observe, imagine et prend du recul avant d'agir.",
    besoinPhase:
      "A besoin d'espaces de solitude et de calme pour laisser vivre son imaginaire.",
  },
  rebelle: {
    id: "rebelle",
    nom: "Rebelle",
    essenceBase:
      "Lit le monde en réactions « j'aime / j'aime pas » : spontané et créatif, il carbure au plaisir et à l'humour.",
    besoinPhase:
      "A besoin de contact ludique, de jeu et de légèreté dans son quotidien.",
  },
  promoteur: {
    id: "promoteur",
    nom: "Promoteur",
    essenceBase:
      "Lit le monde en actions et en opportunités : direct et charmeur, il fonce et s'adapte vite.",
    besoinPhase:
      "A besoin d'action, de défi et d'intensité vécue dans l'instant présent.",
  },
}
```

- [ ] **Step 4: Lancer le test → succès**

Run: `pnpm test src/data/types.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/types.ts src/data/types.test.ts
git commit -m "✨ feat: modèle des 6 types (contenu original)"
```

---

## Task 2: Squelette `questions.ts` + suite d'invariants (tests d'abord)

**Files:**
- Create: `src/data/questions.ts` (types + `QUESTIONS` vide pour l'instant)
- Test: `src/data/questions.test.ts` (la suite complète d'invariants)

- [ ] **Step 1: Créer le squelette typé avec un tableau VIDE**

Create `src/data/questions.ts`:
```ts
import type { TypeId } from "./types"

export type Famille = "base" | "phase"

interface QuestionBase {
  id: string
  famille: Famille
}

export interface Option {
  label: string
  cible: TypeId
}

export interface ForcedChoice extends QuestionBase {
  kind: "forced"
  prompt: string
  options: [Option, Option]
}

export interface Likert extends QuestionBase {
  kind: "likert"
  statement: string
  cible: TypeId
}

export type Question = ForcedChoice | Likert

// Rempli aux Tasks 3 (base) et 4 (phase).
export const QUESTIONS: Question[] = []
```

- [ ] **Step 2: Écrire la suite complète d'invariants**

Create `src/data/questions.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { QUESTIONS, type Famille, type ForcedChoice, type Likert } from "./questions"
import { TYPE_IDS, type TypeId } from "./types"

const FAMILLES: Famille[] = ["base", "phase"]

const forced = QUESTIONS.filter((q): q is ForcedChoice => q.kind === "forced")
const likert = QUESTIONS.filter((q): q is Likert => q.kind === "likert")

function byFamille<T extends { famille: Famille }>(arr: T[], f: Famille) {
  return arr.filter((q) => q.famille === f)
}

describe("QUESTIONS — structure globale", () => {
  it("contient exactement 36 items", () => {
    expect(QUESTIONS).toHaveLength(36)
  })

  it("18 base et 18 phase", () => {
    expect(byFamille(QUESTIONS, "base")).toHaveLength(18)
    expect(byFamille(QUESTIONS, "phase")).toHaveLength(18)
  })

  it("par famille : 12 choix forcés + 6 Likert", () => {
    for (const f of FAMILLES) {
      expect(byFamille(forced, f)).toHaveLength(12)
      expect(byFamille(likert, f)).toHaveLength(6)
    }
  })

  it("ids uniques", () => {
    const ids = QUESTIONS.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe("QUESTIONS — choix forcés", () => {
  it("chaque forcé a exactement 2 options de types distincts et valides", () => {
    for (const q of forced) {
      expect(q.options).toHaveLength(2)
      const [a, b] = q.options
      expect(a.cible).not.toBe(b.cible)
      expect(TYPE_IDS).toContain(a.cible)
      expect(TYPE_IDS).toContain(b.cible)
      expect(a.label.length).toBeGreaterThan(0)
      expect(b.label.length).toBeGreaterThan(0)
      expect(q.prompt.length).toBeGreaterThan(0)
    }
  })
})

describe("QUESTIONS — Likert", () => {
  it("chaque Likert cible un type valide et a un énoncé non vide", () => {
    for (const q of likert) {
      expect(TYPE_IDS).toContain(q.cible)
      expect(q.statement.length).toBeGreaterThan(0)
    }
  })
})

describe("QUESTIONS — équilibrage (5 apparitions-cible par type et par famille)", () => {
  function comptageCibles(f: Famille): Record<TypeId, { fc: number; lk: number }> {
    const init = Object.fromEntries(
      TYPE_IDS.map((t) => [t, { fc: 0, lk: 0 }]),
    ) as Record<TypeId, { fc: number; lk: number }>
    for (const q of byFamille(forced, f)) {
      for (const opt of q.options) init[opt.cible].fc += 1
    }
    for (const q of byFamille(likert, f)) {
      init[q.cible].lk += 1
    }
    return init
  }

  it("chaque type est cible 4× en forcé et 1× en Likert, dans chaque famille", () => {
    for (const f of FAMILLES) {
      const c = comptageCibles(f)
      for (const t of TYPE_IDS) {
        expect(c[t].fc, `${t} forcé en ${f}`).toBe(4)
        expect(c[t].lk, `${t} likert en ${f}`).toBe(1)
      }
    }
  })
})
```

- [ ] **Step 3: Lancer la suite → échec (tableau vide)**

Run: `pnpm test src/data/questions.test.ts`
Expected: FAIL — plusieurs invariants cassent (longueur 0 ≠ 36, comptages à 0).

- [ ] **Step 4: Commit (tests rouges = contrat figé)**

```bash
git add src/data/questions.ts src/data/questions.test.ts
git commit -m "✅ test: invariants d'équilibrage des 36 items (rouge, contrat figé)"
```

---

## Task 3: Rédaction des 18 items BASE — **ULTRATHINK**

**Files:**
- Modify: `src/data/questions.ts` (remplir les 18 items base dans `QUESTIONS`)

> **Mode ULTRATHINK.** Suivre l'ossature d'appariement fixée. Famille = `base` →
> ancrage temporel « en général / par nature / depuis toujours ». FC = micro-scénario
> situationnel (2 options également plausibles, AUCUNE bonne réponse) opposant les deux
> types de l'arête. Likert = énoncé introspectif de trait stable. « Je » 1ʳᵉ personne,
> ton neutre, français correct (accents). **Contenu 100 % original.**

**Règles de qualité (à respecter pour CHAQUE item) :**
1. Les deux options d'un forcé doivent être désirables/neutres — pas une caricature vs un idéal.
2. Chaque option doit incarner le **filtre perceptuel** du type cible (cf. `TYPES[*].essenceBase`), pas un cliché.
3. Varier les contextes des scénarios (travail, loisir, relation, imprévu, décision, groupe…), pas 12 fois le même décor.
4. Les Likert base portent sur un trait stable du type (pas un besoin du moment — ça c'est la phase).

**Exemples d'ancrage (style à suivre, à NE PAS recopier tels quels) :**
```ts
// b-fc-01 (travaillomane × rebelle)
{
  id: "b-fc-01",
  famille: "base",
  kind: "forced",
  prompt: "Devant une tâche nouvelle et un peu floue, par nature je…",
  options: [
    { label: "pose d'abord un plan clair, étape par étape.", cible: "travaillomane" },
    { label: "me lance et j'ajuste en chemin selon ce qui m'amuse.", cible: "rebelle" },
  ],
}
// b-lk-03 (empathique)
{
  id: "b-lk-03",
  famille: "base",
  kind: "likert",
  statement: "En général, je sens vite l'ambiance d'un groupe et l'humeur des gens autour de moi.",
  cible: "empathique",
}
```

- [ ] **Step 1: Rédiger les 12 forcés base**

Remplir `QUESTIONS` avec `b-fc-01` … `b-fc-12`, en respectant STRICTEMENT les paires de
l'ossature (Task 2 du document : fc-01 travaillomane×rebelle, … fc-12 promoteur×rebelle).
Chaque `cible` d'option doit correspondre aux deux types de l'arête.

- [ ] **Step 2: Rédiger les 6 Likert base**

Ajouter `b-lk-01` (travaillomane) … `b-lk-06` (promoteur), un par type, dans l'ordre
canonique des `TYPE_IDS`. Trait stable, ancrage « en général ».

- [ ] **Step 3: Lancer les tests d'équilibrage (partiel base)**

Run: `pnpm test src/data/questions.test.ts`
Expected: les invariants « base » passent (12 FC + 6 LK base, 4+1 par type en base) ;
les invariants globaux (36 items, phase) restent ROUGES tant que la phase n'est pas écrite.

- [ ] **Step 4: Auto-revue de la famille base**

Relire les 18 items : ancrage temporel base correct partout, options plausibles,
contextes variés, pas de doublon de scénario, accents corrects, aucune reformulation de
matériel propriétaire. Corriger sur place.

- [ ] **Step 5: Commit**

```bash
git add src/data/questions.ts
git commit -m "✨ feat: 18 items de la famille base (12 forcés + 6 Likert)"
```

---

## Task 4: Rédaction des 18 items PHASE — **ULTRATHINK**

**Files:**
- Modify: `src/data/questions.ts` (ajouter les 18 items phase)

> **Mode ULTRATHINK.** Même ossature d'appariement. Famille = `phase` → ancrage
> « ces derniers temps / en ce moment » et angle **besoins psychologiques** (ce qui
> nourrit ou frustre MAINTENANT), pas trait stable. FC oppose deux besoins ; Likert =
> intensité d'un besoin actuel. Contenu original.

**Règle anti-confusion base/phase :** un item phase doit pouvoir varier dans le temps
(« en ce moment, j'ai surtout besoin de… »). S'il décrit une manière d'être permanente,
il appartient à la base — le reformuler.

**Exemples d'ancrage (style, à NE PAS recopier) :**
```ts
// p-fc-12 (promoteur × rebelle)
{
  id: "p-fc-12",
  famille: "phase",
  kind: "forced",
  prompt: "Ces derniers temps, ce qui me ferait le plus de bien, ce serait…",
  options: [
    { label: "relever un vrai défi avec de l'enjeu et de l'adrénaline.", cible: "promoteur" },
    { label: "souffler, déconner et faire des trucs juste pour le plaisir.", cible: "rebelle" },
  ],
}
// p-lk-02 (perseverant)
{
  id: "p-lk-02",
  famille: "phase",
  kind: "likert",
  statement: "En ce moment, j'ai particulièrement besoin qu'on reconnaisse mes convictions et ce que je défends.",
  cible: "perseverant",
}
```

- [ ] **Step 1: Rédiger les 12 forcés phase**

Ajouter `p-fc-01` … `p-fc-12` sur la même ossature d'appariement (mêmes paires de types
que la base, mais formulés en besoins du moment et contextes différents de la base).

- [ ] **Step 2: Rédiger les 6 Likert phase**

Ajouter `p-lk-01` (travaillomane) … `p-lk-06` (promoteur), un par type. Intensité d'un
besoin actuel, ancrage « en ce moment / ces derniers temps », dérivé de `TYPES[*].besoinPhase`.

- [ ] **Step 3: Lancer TOUTE la suite → vert**

Run: `pnpm test src/data/questions.test.ts`
Expected: PASS — 36 items, 18/18, 12+6 par famille, 4+1 par type par famille, ids uniques.

- [ ] **Step 4: Auto-revue famille phase + différenciation base/phase**

Vérifier que chaque item phase est bien « du moment » (pas un trait stable déguisé), que
les scénarios phase diffèrent de leurs homologues base, accents et plausibilité OK.

- [ ] **Step 5: Commit**

```bash
git add src/data/questions.ts
git commit -m "✨ feat: 18 items de la famille phase (12 forcés + 6 Likert)"
```

---

## Task 5: Vérification finale + intégration + push

**Files:** aucun fichier de données modifié (vérification only ; `eslint`/`build` peuvent ne rien changer)

- [ ] **Step 1: Suite complète + lint + build**

```bash
pnpm test
pnpm lint
pnpm build
```
Expected: tout vert. (`build` prouve que les nouveaux fichiers `.ts` compilent ; ils ne
sont pas encore importés par l'UI — c'est attendu, le câblage est au Bloc 3.)

- [ ] **Step 2: Garde-fou TS — fichiers data inclus dans la compilation**

Vérifier qu'`src/data/*.ts` est bien couvert par `tsconfig.app.json` (les `.ts` sous
`src/` le sont par défaut). Si `tsc -b` ne les voit pas (aucune erreur car non importés),
ce n'est pas bloquant : les tests Vitest les compilent déjà. Noter si une incohérence
apparaît.

- [ ] **Step 3: Push (déclenche la CI : les tests d'invariants tournent aussi en CI)**

```bash
git push origin main
```
Puis suivre : `gh run watch` → workflow vert.

- [ ] **Step 4: STOP — relecture des questions avec Adrien**

Conformément au brief (« STOP. Relire les questions avec moi avant le bloc 3 »),
présenter les 36 items à Adrien pour relecture du **fond rédactionnel** (les tests ne
valident que la structure, pas la qualité/justesse des formulations). Ne pas enchaîner
sur le Bloc 3 sans validation.

---

## Notes d'exécution

- **Ultrathink** : Tasks 3 & 4 portent toute la valeur. Ne pas bâcler la plausibilité des
  options ni l'ancrage temporel — c'est là que se joue la justesse du test.
- Les tests de cohérence sont un **filet structurel**, pas un juge de qualité. La
  relecture humaine (Step final) reste indispensable.
- Aucun secret / aucune donnée externe ; tout est statique et en mémoire.
- Si un invariant d'équilibrage casse, c'est presque toujours une `cible` d'option qui ne
  respecte pas l'arête de l'ossature — comparer au tableau d'appariement.
