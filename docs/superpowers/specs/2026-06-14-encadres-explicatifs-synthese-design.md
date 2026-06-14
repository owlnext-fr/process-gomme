# Encadrés explicatifs dans la synthèse — design

**Date** : 2026-06-14
**Statut** : validé (brainstorming), à implémenter

## Problème

Sur la fiche de résultats, les sections de la synthèse (« Ta base — … », « Ta phase — … »,
« Ton immeuble », « Interactions base × phase ») affichent le contenu personnalisé sans
jamais rappeler **à quoi correspond le concept** lui-même. Un·e utilisateur·ice qui découvre
le test ne sait pas forcément ce que « base » ou « phase » veut dire à ce stade.

Une explication des concepts existe déjà (`ProfilExplainer`, basé sur `explainer.ts`), mais
elle n'est montrée que sur l'**intro** et le **quiz** — pas sur la fiche de résultats.

## Objectif

Sous chaque titre de section de la synthèse, intégrer une **phrase d'explication du concept**
dans un encadré sur fond clair, de sorte que le sens de « base / phase / immeuble /
interactions » soit rappelé au moment précis où l'utilisateur·ice lit ses résultats.

## Décisions de design (issues du brainstorming)

- **Nouveau composant dédié** — pas de réutilisation de `ProfilExplainer` (qui reste réservé
  à l'intro et au quiz, intact).
- **Un encadré par section** — chaque section de la synthèse a son propre encadré, accolé au
  contenu qu'il décrit (pas un glossaire unique regroupé).
- **L'encadré absorbe l'en-tête de section** : le titre `<h2>` existant (ex. « Ta base —
  Travailleur ») passe **dans** l'encadré, coloré en `text-primary`, suivi de la phrase
  d'explication. Le paragraphe descriptif personnalisé reste **dessous**, hors encadré.
  → Un seul niveau de titre par section (pas de doublon « Ta base » / « Ta base »).
- **Couleur du titre** : `text-primary` (uniforme sur les 4 encadrés).
- **Icône par concept** : une icône `lucide-react` (en `text-primary`) à gauche du titre,
  une par section — `Anchor` (base), `Compass` (phase), `Building2` (immeuble),
  `ArrowLeftRight` (interactions). `lucide-react` est déjà une dépendance du projet
  (utilisée dans `ResultsScreen`).
- **Fond** : `bg-indigo-50` + `border-indigo-200` — même famille que le bandeau du haut et
  `ProfilExplainer` (`bg-indigo-100`), mais un cran plus clair pour distinguer « aide à la
  lecture » de « ton résultat » sans rivaliser visuellement avec le bandeau principal.
- **Portée** : les **4 sections**, y compris « Interactions base × phase » (qui nécessite une
  phrase d'explication originale, absente de `explainer.ts`).

## Contenu

Nouveau fichier `src/content/sectionHints.ts` exposant `SECTION_HINTS`, un objet à 4 clés.
Phrases **concises et contextuelles** (pas le préfixe « Ta base, c'est… » de `explainer.ts`,
qui ferait doublon avec le titre juste au-dessus). Brouillons à affiner à l'implémentation :

| clé | phrase (brouillon) |
|---|---|
| `base` | « Ta façon la plus stable de percevoir le monde, celle qui bouge peu au fil de ta vie. » |
| `phase` | « Ce qui te porte en ce moment : le moteur et les besoins du chapitre que tu traverses. » |
| `immeuble` | « L'agencement de tes six facettes, de la plus présente à la plus discrète. » |
| `interactions` | « Comment ta base et ta phase dialoguent — parfois en accord, parfois en tension — au quotidien. » |

Contraintes de contenu :
- 100 % original (contrainte transverse du projet).
- `explainer.ts` reste **inchangé** → intro et quiz non impactés.
- Conséquence assumée : deux formulations des définitions coexistent (glossaire autonome vs
  rappel contextuel court). À documenter dans `docs/QUIRKS.md`.

## Rendu (mockup)

```
┌───────────────────────────────────────┐
│ ⚓ Ta base — Travailleur                 │  ← icône (Anchor) + <h2>, text-primary
│ Ta façon la plus stable de percevoir    │  ← phrase (text-muted-foreground)
│ le monde, celle qui bouge peu…          │     fond indigo-50, bordure indigo-200
└───────────────────────────────────────┘
[paragraphe de description personnalisé]   ← contenu existant, inchangé
```

Icônes par section : `Anchor` (base), `Compass` (phase), `Building2` (immeuble),
`ArrowLeftRight` (interactions).

## Implémentation

### `src/content/sectionHints.ts` (nouveau)

```ts
export const SECTION_HINTS = {
  base: "…",
  phase: "…",
  immeuble: "…",
  interactions: "…",
} as const
```

### `src/features/results/Synthese.tsx` (modifié)

Le composant interne `Section` reçoit deux nouvelles props : `hint: string` et
`icon: LucideIcon`. Son en-tête est re-stylé en encadré, avec l'icône à gauche du titre :

```tsx
import { Anchor, ArrowLeftRight, Building2, Compass, type LucideIcon } from "lucide-react"

function Section({ titre, hint, icon: Icon, children }: {
  titre: string; hint: string; icon: LucideIcon; children: React.ReactNode
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

Les 4 appels passent le `hint` (depuis `SECTION_HINTS`) et l'`icon` correspondants :
`Anchor` (base), `Compass` (phase), `Building2` (immeuble), `ArrowLeftRight`
(interactions). Aucun changement de scoring ni du contenu personnalisé existant.

> Les icônes sont des composants React : elles vivent dans `Synthese.tsx` (mapping
> concept → composant), pas dans `sectionHints.ts` qui reste du **contenu textuel pur**.

## Tests

- **`src/content/sectionHints.test.ts`** (nouveau) : les 4 clés (`base`, `phase`, `immeuble`,
  `interactions`) existent et leurs phrases sont non vides.
- **Rendu `Synthese`** : ajouter un test vérifiant que les 4 phrases d'explication
  apparaissent à l'écran (`Synthese` n'a pas de test de rendu aujourd'hui).
- **`pnpm before_push`** complet (lint + unit + build + e2e) avant push ; vérifier que l'e2e
  qui traverse la page de résultats passe toujours.

## Hors scope (YAGNI)

- Pas de repli ni de réutilisation de `explainer.ts` / `ProfilExplainer`.
- Pas de pastille de couleur par type, ni d'animation sur les encadrés.
- Aucune modification de l'intro ni du quiz.
