# Conventions de code

Squelettes et patterns récurrents du projet. À consulter avant de créer un nouveau type de fichier (entité, service, contrôleur, composant, etc.).

Si tu découvres un pattern récurrent : documente-le ici.

---

## Composant d'écran / feature (React) — squelette

```tsx
// src/features/<feature>/<Nom>.tsx
import { Button } from "@/components/ui/button"
import type { TypeId } from "@/data/types"

// Props typées en inline (pas d'interface séparée pour les petits composants).
export function MonComposant({
  valeur,
  onChange,
}: {
  valeur: TypeId | undefined
  onChange: (v: TypeId) => void
}) {
  return (
    <main className="flex flex-col gap-6 p-6">
      {/* … */}
    </main>
  )
}
```

## Logique pure + son test (TDD) — squelette

```ts
// src/lib/<module>.ts — AUCUN import React. Pur, déterministe, testable en isolation.
import { TYPE_IDS, type TypeId } from "@/data/types"

export function maFonction(/* … */): /* … */ {
  // …
}
```

```ts
// src/lib/<module>.test.ts
import { describe, it, expect } from "vitest"
import { maFonction } from "./<module>"

describe("maFonction", () => {
  it("fait X", () => {
    expect(maFonction(/* … */)).toBe(/* … */)
  })
})
```

## Données de contenu — squelette

```ts
// src/data/<...>.ts ou src/content/<...>.ts
import type { TypeId } from "@/data/types"

export const MA_DONNEE: Record<TypeId, string> = {
  travaillomane: "…",
  // … les 6 types dans l'ordre canonique de TYPE_IDS
}
```

## Écran intro/quiz avec `SplitLayout` — squelette

```tsx
// src/features/<feature>/<Nom>Screen.tsx
import { SplitLayout } from "@/components/SplitLayout"
import { ProfilExplainer } from "@/components/ProfilExplainer"

export function MonEcran(/* props */) {
  return (
    <SplitLayout
      hideRightOnMobile           // si le panneau droit doit disparaître en mobile (quiz)
      left={
        // intro : centrer la box → `flex flex-1 flex-col justify-center ... max-md:items-center max-md:text-center`
        // quiz  : `flex flex-1 flex-col gap-8` ; mettre `flex-1` sur la zone centrale
        //         pour pousser la nav en bas (le volet gauche est min-h-svh en mobile)
        <div className="flex flex-1 flex-col gap-8">{/* … */}</div>
      }
      right={<ProfilExplainer />}
    />
  )
}
```

- `SplitLayout` fournit le `<main>` (1/3-2/3 en `md`, empilé en mobile, volet gauche `min-h-svh`/`md:min-h-0`, volet droit indigo `bg-primary` centré).
- `ProfilExplainer` est statique (contenu original dans `src/content/explainer.ts`), déjà cadré (`max-w-lg`) et centré.

### Règles tacites

- **Pas de point-virgule**, **guillemets doubles** (style ESLint/Prettier du repo — suivre l'existant).
- **Alias `@/`** → `src/` partout (imports). Path dans `tsconfig` (`paths`, sans `baseUrl`).
- **TDD** pour toute logique pure (`lib/`, reducers, composition de contenu) : test rouge → impl → vert.
- **Séparation stricte** : `data/` (contenu) · `lib/` (logique pure, sans React) · `content/` (textes) · `features/` (UI). L'UI ne fait qu'afficher la logique.
- **Fichiers focalisés** : une responsabilité par fichier ; si ça grossit, découper.
- **Contenu de personnalité 100 % ORIGINAL** : jamais de reformulation/copie de matériel propriétaire (types, fiches, items). Noms officiels des 6 types tolérés en façade uniquement.
- **Questions à choix forcé = 4 options** de types distincts. Invariant testé : chaque type est cible **8× en forcé** (+1 en Likert) par famille. L'assignation des 4 types par question est **déterministe** (voir le plan 2026-06-14) ; seule la prose est générée. Le scoring reste `+1 au type choisi` (indépendant du nombre d'options).
- **Grammaire de continuation des options** : le `prompt` finit par « …je… » (base) ou « …envie de… / c'est… » (phase). Donc une option **base** commence par un **verbe à la 1re personne SANS « je » en tête** (« lis la notice… », pas « je lis… » → sinon double « je ») ; une option **phase** est à l'**infinitif** ou en **subordonnée** (« mettre de l'ordre… », « qu'on remarque… »).
- **Options non-orientantes (forme parallèle)** : les 4 options d'une même question doivent être **parallèles en forme** (longueur comparable, même structure d'amorce, même registre, même énergie, pas de justification « parce que… » ni de mot « vendeur » sur une seule). Seule la **teneur du type** doit distinguer les réponses, jamais leur formulation (sinon biais de mesure).
- **Français correct** dans tout le contenu UI : accents et ponctuation soignés (« é », « ê », « » si besoin).
- **Composants shadcn** dans `src/components/ui/` : générés par la CLI, non modifiés à la main ; exemptés de la règle ESLint `react-refresh`.
- **a11y plancher** : `aria-label` sur les contrôles/visuels, focus clavier visible, `useReducedMotion()` pour toute animation.
- **Couleurs de types** : toujours via **`TYPE_COLORS`** (`src/data/types.ts`, → tokens `--type-1..6`). Jamais de couleur de type en dur. Source unique partagée par le radar (`RadarProfil`), la pyramide (`Immeuble`) et les pastilles du panneau (`ProfilExplainer`).
- **Icônes sur les boutons** : tout `<Button>` porte une icône **lucide-react** (`className="size-4"`, `aria-hidden`), le label texte reste pour l'a11y.
- **Layouts pleine page** : intro + quiz utilisent `SplitLayout` (1/3-2/3, pleine largeur, padding par volet) ; la page résultats est aussi pleine page. Pas de `mx-auto max-w-*` de cadrage global sur ces écrans.
- **Masquer un volet flex en mobile** : `max-md:hidden` (pas `hidden md:block`, qui casse le `flex`). Voir `QUIRKS.md`.
- **Commits gitmoji** directs sur `main`. **`pnpm before_push`** avant chaque push.
