# Likert en boutons — expérience unifiée (design)

**Date** : 2026-06-14
**Statut** : validé, prêt pour le plan d'implémentation

## Problème

Le quiz mélange deux interactions hétérogènes : les **choix forcés** sont des cartes-boutons
cliquables (`RadioGroup`), les **Likert** sont des **sliders** (1→5). Deux gestes différents,
deux rendus différents — l'expérience n'est pas unifiée. De plus, le slider démarre sur « 3 »
(neutre), ce qui crée un **« neutre par défaut » implicite** : un Likert non touché compte quand
même comme neutre, et « Suivant » n'est jamais bloqué sur un Likert (alors qu'il l'est sur un
forcé). Comportement asymétrique et silencieux.

## Objectif

Remplacer les sliders Likert par **5 boutons** disposés en **liste verticale labellisée**,
**identique aux choix forcés**, pour une expérience de quiz totalement unifiée — même geste,
même visuel, même règle d'obligation partout.

## Décisions (verrouillées en brainstorming)

1. **Disposition** : liste verticale de 5 cartes-boutons, exactement comme les choix forcés
   (pas de rangée horizontale ni de pastilles).
2. **Obligation** : un Likert devient **obligatoire** au même titre qu'un forcé. « Suivant » reste
   bloqué tant qu'aucun bouton n'est choisi. **Plus de neutre par défaut** : chaque réponse est un
   vrai choix.
3. **Structure code** : extraire un **composant partagé** `ChoiceGroup` rendant les cartes-boutons ;
   `ForcedChoice` et `LikertScale` deviennent de fins adaptateurs. L'unification est ainsi garantie
   structurellement (un seul code rend les deux), pas seulement par convention.

## Conception

### 1. Composant partagé `ChoiceGroup` (présentiel, sans logique métier)

Nouveau `src/features/quiz/ChoiceGroup.tsx`. Markup des cartes-boutons extrait de `ForcedChoice`,
rendu générique :

```tsx
export function ChoiceGroup({
  legend,
  options,        // { value: string; label: string }[]
  value,          // string | undefined
  onChange,       // (value: string) => void
  idPrefix,       // pour les id des <label htmlFor>
}: {
  legend: string
  options: { value: string; label: string }[]
  value: string | undefined
  onChange: (value: string) => void
  idPrefix: string
}) {
  // <fieldset><legend>…</legend>
  //   <RadioGroup value={value ?? ""} onValueChange={onChange}>
  //     {options.map(...)} → <label> bordé + <RadioGroupItem> (identique à l'actuel ForcedChoice)
}
```

- **`ForcedChoice`** → adaptateur : `options.map(opt => ({ value: opt.cible, label: opt.label }))`,
  `value = valeur`, `onChange = v => onChange(v as TypeId)`. Comportement inchangé ; il reçoit déjà
  les options **pré-mélangées** depuis `QuizScreen` (le shuffle reste côté `QuizScreen`).
- **`LikertScale`** → adaptateur : 5 options fixes `{ value: "1".."5", label }`,
  `value = valeur != null ? String(valeur) : undefined`, `onChange = v => onChange(Number(v) as 1|2|3|4|5)`.
  **Pas de shuffle** : l'ordre 1→5 est sémantique (`QuizScreen` ne mélange déjà que les `forced`).

→ Le visuel des deux types de question est rendu par **un seul fichier**. Divergence impossible.

### 2. Labels Likert (échelle d'accord)

Constante dans `LikertScale.tsx`. La `value` garde sa sémantique (`5 = Tout à fait d'accord`),
mais l'**ordre d'affichage** est **descendant** : l'adhésion forte est en **haut**.

| Ordre affiché (haut → bas) | valeur | label |
|---|---|---|
| 1ᵉʳ | 5 | Tout à fait d'accord |
| 2ᵉ | 4 | Plutôt d'accord |
| 3ᵉ | 3 | Mitigé |
| 4ᵉ | 2 | Plutôt pas d'accord |
| 5ᵉ | 1 | Pas du tout d'accord |

L'ordre d'affichage est **purement cosmétique** : le scoring stocke la `value` (pas la position),
donc il est strictement inchangé. Les énoncés Likert sont tous des auto-descriptions à la 1re
personne (« j'ai besoin de… », « je perçois… ») → l'échelle d'accord colle à tous.

Les libellés d'extrémités sous le slider (« Pas du tout » / « Tout à fait ») **disparaissent**
(chaque ligne est désormais labellisée). Le slider shadcn (`src/components/ui/slider.tsx`) n'est
plus utilisé → **le retirer** après vérification qu'il n'est importé nulle part ailleurs.

### 3. Comportement — obligatoire partout

Dans `QuizScreen.tsx`, remplacer :

```ts
const forcedManquant = q.kind === "forced" && !reponse
```

par :

```ts
const reponseManquante = !reponse
```

Le bouton « Suivant / Voir mes résultats » est `disabled={reponseManquante}`. Un Likert non répondu
a `reponse` undefined → bloqué, exactement comme un forcé. Plus aucun « neutre par défaut » : on
ne passe plus de valeur de repli `3` au composant ; `RadioGroup value=""` au départ (rien de
présélectionné).

### 4. Impact scoring

`computeResult` (`src/lib/scoring.ts`) **garde** son fallback `valeur ?? 3` par **défense** — il ne
se déclenchera plus en pratique puisque tout est répondu avant d'atteindre les résultats. Aucune
autre modification : le scoring reste `(valeur - 1) / 4`. Le format de partage URL (`shareCode.ts`)
est inchangé (il encode le `socle` déjà calculé).

### 5. Tests

- **`ChoiceGroup.test.tsx`** (nouveau) : rend N boutons ; le clic appelle `onChange` avec la bonne
  `value` ; la pré-sélection (`value` fournie) est reflétée.
- **`QuizScreen.test.tsx`** : ajouter le cas **Likert** → « Suivant » désactivé sans réponse, activé
  après réponse (symétrique des tests forcés existants, qui restent valides).
- **e2e `smoke.spec.ts`** : `radios.first().click()` couvre déjà les pages Likert (mêmes
  `role="radio"`) ; corriger le commentaire trompeur (« valeur par défaut à 3 ») ; garder le
  `waitForTimeout(350)` pour les animations Framer Motion.
- `quizReducer.test.ts` / `scoring.test.ts` : **inchangés** (forme de l'action `answer` identique).

### 6. A11y & mobile

Sémantique `fieldset` / `legend` + `RadioGroup` conservée (focus clavier visible, navigation au
clavier native de Radio). Liste verticale pleine largeur → identique aux forcés sur mobile, pas de
cas étroit à gérer.

## Hors périmètre (YAGNI)

- Pas de changement du moteur de scoring ni du format de partage.
- Pas de re-mélange de l'ordre des Likert (l'échelle reste 1→5).
- Pas de migration de données (état uniquement en mémoire, rien de persisté).

## Fichiers touchés

- **Nouveau** : `src/features/quiz/ChoiceGroup.tsx`, `src/features/quiz/ChoiceGroup.test.tsx`
- **Modifiés** : `src/features/quiz/ForcedChoice.tsx`, `src/features/quiz/LikertScale.tsx`,
  `src/features/quiz/QuizScreen.tsx`, `src/features/quiz/QuizScreen.test.tsx`, `e2e/smoke.spec.ts`
- **Supprimé** : `src/components/ui/slider.tsx` (si plus aucun import)
- **Inchangés** : `src/lib/scoring.ts` (fallback défensif conservé), `quizReducer.ts`, `shareCode.ts`
