# Likert en boutons (expérience unifiée) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer les sliders Likert par 5 boutons en liste verticale labellisée, identiques aux choix forcés, et rendre tout le quiz obligatoire — pour une expérience unifiée.

**Architecture:** Extraire un composant présentiel partagé `ChoiceGroup` (legend + `RadioGroup` de cartes-boutons). `ForcedChoice` et `LikertScale` deviennent de fins adaptateurs qui lui passent leurs options. `QuizScreen` bloque « Suivant » tant qu'aucune réponse n'est donnée (forcé comme Likert). Scoring inchangé.

**Tech Stack:** React + TypeScript, shadcn/ui (`RadioGroup` basé sur le package `radix-ui` umbrella), Vitest + Testing Library, Playwright (e2e).

**Référence design :** `docs/superpowers/specs/2026-06-14-likert-boutons-unifies-design.md`

**Rappels projet :** pas de point-virgule, guillemets doubles, alias `@/` → `src/`, TDD pour la logique, commits gitmoji directs sur `main`, `pnpm before_push` avant tout push.

---

### Task 1 : Composant partagé `ChoiceGroup`

**Files:**
- Create: `src/features/quiz/ChoiceGroup.tsx`
- Test: `src/features/quiz/ChoiceGroup.test.tsx`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `src/features/quiz/ChoiceGroup.test.tsx` :

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { ChoiceGroup } from "./ChoiceGroup"

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
]

describe("ChoiceGroup", () => {
  it("rend la légende et un bouton radio par option", () => {
    render(
      <ChoiceGroup legend="Ma question" options={options} value={undefined} onChange={() => {}} idPrefix="q1" />,
    )
    expect(screen.getByText("Ma question")).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("appelle onChange avec la value de l'option cliquée", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ChoiceGroup legend="Ma question" options={options} value={undefined} onChange={onChange} idPrefix="q1" />,
    )
    await user.click(screen.getAllByRole("radio")[1])
    expect(onChange).toHaveBeenCalledWith("b")
  })

  it("reflète la pré-sélection fournie via value", () => {
    render(
      <ChoiceGroup legend="Ma question" options={options} value="c" onChange={() => {}} idPrefix="q1" />,
    )
    expect(screen.getAllByRole("radio")[2]).toHaveAttribute("aria-checked", "true")
  })
})
```

- [ ] **Step 2 : Lancer le test, vérifier qu'il échoue**

Run: `pnpm test -- ChoiceGroup`
Expected: FAIL — `Failed to resolve import "./ChoiceGroup"` (le composant n'existe pas encore).

- [ ] **Step 3 : Écrire le composant minimal**

Créer `src/features/quiz/ChoiceGroup.tsx` (markup repris à l'identique de l'actuel `ForcedChoice`, rendu générique) :

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ChoiceGroup({
  legend,
  options,
  value,
  onChange,
  idPrefix,
}: {
  legend: string
  options: { value: string; label: string }[]
  value: string | undefined
  onChange: (value: string) => void
  idPrefix: string
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-lg font-medium">{legend}</legend>
      <RadioGroup value={value ?? ""} onValueChange={onChange}>
        {options.map((opt, i) => {
          const id = `${idPrefix}-${i}`
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent"
            >
              <RadioGroupItem id={id} value={opt.value} />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </RadioGroup>
    </fieldset>
  )
}
```

- [ ] **Step 4 : Lancer le test, vérifier qu'il passe**

Run: `pnpm test -- ChoiceGroup`
Expected: PASS (3 tests).

- [ ] **Step 5 : Commit**

```bash
git add src/features/quiz/ChoiceGroup.tsx src/features/quiz/ChoiceGroup.test.tsx
git commit -m "✨ feat(quiz): composant partagé ChoiceGroup (cartes-boutons radio)"
```

---

### Task 2 : `ForcedChoice` devient un adaptateur de `ChoiceGroup`

**Files:**
- Modify: `src/features/quiz/ForcedChoice.tsx` (remplacement complet)

Pas de test dédié à `ForcedChoice` : sa couverture passe par `QuizScreen.test.tsx` (choix forcés) et l'e2e `smoke`. On vérifie la non-régression via la suite unitaire complète.

- [ ] **Step 1 : Réécrire `ForcedChoice` comme adaptateur**

Remplacer **tout** le contenu de `src/features/quiz/ForcedChoice.tsx` par :

```tsx
import { ChoiceGroup } from "./ChoiceGroup"
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
    <ChoiceGroup
      legend={question.prompt}
      idPrefix={question.id}
      options={question.options.map((opt) => ({ value: opt.cible, label: opt.label }))}
      value={valeur}
      onChange={(v) => onChange(v as TypeId)}
    />
  )
}
```

> Note : le mélange (shuffle) des options reste géré par `QuizScreen` (qui passe `question` déjà mélangée). `ForcedChoice` ne fait que mapper `cible`/`label`.

- [ ] **Step 2 : Lancer la suite unitaire, vérifier que tout passe**

Run: `pnpm test`
Expected: PASS (les tests `QuizScreen` sur les choix forcés restent verts ; même `role="radio"`, mêmes labels).

- [ ] **Step 3 : Commit**

```bash
git add src/features/quiz/ForcedChoice.tsx
git commit -m "♻️ refactor(quiz): ForcedChoice s'appuie sur ChoiceGroup"
```

---

### Task 3 : `LikertScale` en boutons (adaptateur de `ChoiceGroup`)

**Files:**
- Modify: `src/features/quiz/LikertScale.tsx` (remplacement complet)

- [ ] **Step 1 : Réécrire `LikertScale` en boutons**

Remplacer **tout** le contenu de `src/features/quiz/LikertScale.tsx` par :

```tsx
import { ChoiceGroup } from "./ChoiceGroup"
import type { Likert as LikertQuestion } from "@/data/questions"

// Échelle d'accord. value = niveau (5 = tout à fait d'accord). Affichée en ordre DESCENDANT
// (adhésion forte en haut). Le scoring stocke la value, pas la position → ordre purement cosmétique.
const LIKERT_OPTIONS: { value: string; label: string }[] = [
  { value: "5", label: "Tout à fait d'accord" },
  { value: "4", label: "Plutôt d'accord" },
  { value: "3", label: "Mitigé" },
  { value: "2", label: "Plutôt pas d'accord" },
  { value: "1", label: "Pas du tout d'accord" },
]

export function LikertScale({
  question,
  valeur,
  onChange,
}: {
  question: LikertQuestion
  valeur: number | undefined
  onChange: (valeur: 1 | 2 | 3 | 4 | 5) => void
}) {
  return (
    <ChoiceGroup
      legend={question.statement}
      idPrefix={question.id}
      options={LIKERT_OPTIONS}
      value={valeur != null ? String(valeur) : undefined}
      onChange={(v) => onChange(Number(v) as 1 | 2 | 3 | 4 | 5)}
    />
  )
}
```

> Note : le type de la prop `valeur` passe de `number` à `number | undefined` (plus de neutre par défaut). `QuizScreen` est ajusté à la Task 4 pour ne plus passer `3` par défaut.

- [ ] **Step 2 : Vérifier la compilation TypeScript**

Run: `pnpm build`
Expected: PASS — `tsc -b` compile. `QuizScreen` passe encore `valeur={... : 3}` (un `number`, compatible avec `number | undefined`) → pas d'erreur de type à ce stade.

- [ ] **Step 3 : Lancer la suite unitaire**

Run: `pnpm test`
Expected: PASS (aucun test n'asserte le rendu interne du Likert ; `ChoiceGroup.test` couvre les boutons).

- [ ] **Step 4 : Commit**

```bash
git add src/features/quiz/LikertScale.tsx
git commit -m "✨ feat(quiz): Likert en 5 boutons (Tout à fait d'accord en haut) via ChoiceGroup"
```

---

### Task 4 : `QuizScreen` — obligation partout + plus de neutre par défaut

**Files:**
- Modify: `src/features/quiz/QuizScreen.tsx`
- Test: `src/features/quiz/QuizScreen.test.tsx`

- [ ] **Step 1 : Écrire les tests Likert qui échouent**

Dans `src/features/quiz/QuizScreen.test.tsx`, ajouter sous la ligne existante `const premierForced = ...` :

```tsx
const premierLikert = QUESTIONS.findIndex((q) => q.kind === "likert")
```

Puis ajouter ces deux tests **à l'intérieur** du `describe("QuizScreen", () => { ... })`, après les tests existants :

```tsx
  it("désactive « Suivant » tant qu'un Likert n'est pas répondu", () => {
    const dispatch = vi.fn()
    render(
      <QuizScreen state={{ screen: "quiz", index: premierLikert, answers: {} }} dispatch={dispatch} />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeDisabled()
  })

  it("active « Suivant » une fois le Likert répondu", () => {
    const q = QUESTIONS[premierLikert]
    const dispatch = vi.fn()
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierLikert, answers: { [q.id]: { kind: "likert", valeur: 4 } } }}
        dispatch={dispatch}
      />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeEnabled()
  })
```

- [ ] **Step 2 : Lancer ces tests, vérifier qu'ils échouent**

Run: `pnpm test -- QuizScreen`
Expected: FAIL sur « désactive « Suivant » tant qu'un Likert n'est pas répondu » — actuellement `forcedManquant` ne bloque que les forcés, donc le bouton est `enabled` à tort.

- [ ] **Step 3 : Rendre l'obligation universelle**

Dans `src/features/quiz/QuizScreen.tsx`, remplacer :

```tsx
  const forcedManquant = q.kind === "forced" && !reponse
```

par :

```tsx
  const reponseManquante = !reponse
```

Puis, sur le bouton « Suivant », remplacer `disabled={forcedManquant}` par `disabled={reponseManquante}` :

```tsx
            <Button onClick={() => dispatch({ type: "next" })} disabled={reponseManquante}>
```

- [ ] **Step 4 : Supprimer le neutre par défaut passé au Likert**

Toujours dans `src/features/quiz/QuizScreen.tsx`, remplacer la prop `valeur` du `<LikertScale>` :

```tsx
                  valeur={reponse?.kind === "likert" ? reponse.valeur : 3}
```

par :

```tsx
                  valeur={reponse?.kind === "likert" ? reponse.valeur : undefined}
```

- [ ] **Step 5 : Lancer les tests `QuizScreen`, vérifier qu'ils passent**

Run: `pnpm test -- QuizScreen`
Expected: PASS (tests forcés existants + 2 nouveaux tests Likert).

- [ ] **Step 6 : Commit**

```bash
git add src/features/quiz/QuizScreen.tsx src/features/quiz/QuizScreen.test.tsx
git commit -m "✨ feat(quiz): réponse obligatoire sur Likert (plus de neutre par défaut)"
```

---

### Task 5 : Nettoyage (slider) + e2e + gate complet

**Files:**
- Delete: `src/components/ui/slider.tsx`
- Modify: `e2e/smoke.spec.ts`

- [ ] **Step 1 : Confirmer que le slider n'est plus importé nulle part**

Run: `grep -rn "ui/slider" src/`
Expected: aucune occurrence (l'unique import était dans `LikertScale.tsx`, réécrit à la Task 3).

- [ ] **Step 2 : Supprimer le composant slider inutilisé**

```bash
git rm src/components/ui/slider.tsx
```

> Ne pas toucher `package.json` : `RadioGroup` et les autres primitives utilisent le package umbrella `radix-ui`, qui reste nécessaire.

- [ ] **Step 3 : Corriger le commentaire trompeur de l'e2e**

Dans `e2e/smoke.spec.ts`, remplacer ces deux lignes de commentaire :

```tsx
    // Si un choix forcé est présent, sélectionner la 1re option.
    // (Les Likert ont une valeur par défaut à 3 — pas besoin d'interaction.)
```

par :

```tsx
    // Toutes les questions (forcés ET Likert) sont désormais des boutons radio et exigent
    // une réponse. On sélectionne la 1re option pour pouvoir avancer.
```

Le code en dessous (`const radios = page.getByRole("radio")` puis le clic conditionnel) reste **inchangé** : il couvre déjà les pages Likert (mêmes `role="radio"`).

- [ ] **Step 4 : Lancer le gate complet**

Run: `pnpm before_push`
Expected: PASS de bout en bout — `lint` → `test` (unitaires, dont `ChoiceGroup` + `QuizScreen`) → `build` → `test:e2e` (parcours complet : les 36 questions sont répondues au clic).

- [ ] **Step 5 : Commit**

```bash
git add -A
git commit -m "🔥 chore(quiz): retire le slider inutilisé + ajuste le commentaire e2e"
```

---

### Task 6 : Vérification visuelle + mise à jour mémoire projet

**Files:**
- Modify: `docs/INDEX.md`, `docs/HANDOFF.md`, `docs/QUIRKS.md` (si pertinent)

- [ ] **Step 1 : Vérif visuelle desktop + mobile**

Lancer `pnpm dev` (sert sur `http://localhost:5173/process-gomme/`, ou 5174 si occupé). Via le MCP Playwright : naviguer, cliquer « Commencer », atteindre une question Likert, capturer en **1440×900** et **390×844**. Vérifier : 5 cartes-boutons identiques aux forcés, « Tout à fait d'accord » en haut, rien de présélectionné, « Suivant » désactivé tant qu'aucun choix.

- [ ] **Step 2 : Mettre à jour `docs/INDEX.md`**

Ajouter une ligne dans la table « Features » :

```markdown
| Likert en boutons (expérience unifiée) | 2026-06-14 | [spec](superpowers/specs/2026-06-14-likert-boutons-unifies-design.md) | [plan](superpowers/plans/2026-06-14-likert-boutons-unifies.md) | ✅ Livré | Sliders Likert → 5 boutons en liste verticale (ordre descendant, « Tout à fait d'accord » en haut), identiques aux forcés. Composant partagé `ChoiceGroup` ; `ForcedChoice`/`LikertScale` = adaptateurs. Likert désormais **obligatoire** (plus de neutre par défaut). Slider shadcn retiré. Scoring inchangé |
```

- [ ] **Step 3 : Mettre à jour `docs/HANDOFF.md`**

Ajouter une entrée datée en haut (sous le titre H1) : `Dernière chose faite`, `Trucs en suspens`, `Prochaine chose à creuser`, `Notes pour future Claude`. Mentionner notamment : le fallback défensif `valeur ?? 3` conservé dans `scoring.ts` mais désormais inatteignable (tout est répondu avant les résultats).

- [ ] **Step 4 : (Si pertinent) `docs/QUIRKS.md`**

Si un piège a été rencontré (ex. comportement `aria-checked` de Radix dans les tests, label vs radio au clic), l'ajouter. Sinon, ne rien ajouter.

- [ ] **Step 5 : Commit**

```bash
git add docs/
git commit -m "📝 docs: mémoire à jour (Likert en boutons unifiés)"
```

---

## Notes de fin

- **Push** : une fois le gate vert et la mémoire à jour, `git push origin main` déclenche le déploiement GH Pages (`test → build → deploy`).
- **Scoring strictement inchangé** : aucune modif de `src/lib/scoring.ts`. Le fallback `valeur ?? 3` reste en place par défense (inatteignable en pratique). Le format de partage URL (`shareCode.ts`) n'est pas touché.
