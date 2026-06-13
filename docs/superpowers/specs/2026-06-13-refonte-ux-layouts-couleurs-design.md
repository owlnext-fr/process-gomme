# Refonte UX — layouts 1/3-2/3, page de résultats, couleur

**Date** : 2026-06-13
**Statut** : design validé visuellement (compagnon visuel), en attente de relecture du spec
**Type** : amélioration UX (layout + thème de couleur), pas de changement de logique métier

## Objectif

Donner de la structure et de la couleur aux trois écrans, sans toucher au moteur de
scoring ni au contenu du test. Trois changements de mise en page (intro, quiz, résultats)
et l'introduction d'un thème **« Indigo & pastels »** sur une base aujourd'hui 100 % neutre.

## Décisions validées

| Sujet | Décision |
|---|---|
| Layout intro | Split 1/3 (titre + gros bouton « Commencer ») · 2/3 (panneau d'explications) |
| Layout quiz | Split 1/3 (quiz) · 2/3 (panneau d'explications) |
| Layout résultats | **Option C** : en-tête (titre + reset haut-droite) → bandeau base·phase → split colonne latérale sticky (pyramide + radar) / corps (Synthèse) |
| Panneau d'explications | **Statique** : même contenu base/phase/immeuble sur intro et quiz (pas contextuel → zéro biais sur le test) |
| Responsive intro | Explications + bouton **empilés** (panneau visible) |
| Responsive quiz | Panneau **desktop only** (`md:`) → mobile = colonne simple, **comme aujourd'hui** |
| Responsive résultats | Tout s'empile |
| Palette | **Indigo & pastels** — accent indigo `#4f46e5`, 6 pastels pour les types |
| Tokens des 6 types | **Tokens dédiés `--type-1..6`** + mapping TS `TYPE_COLORS` (source unique) |
| Contenu du panneau | 3 courts paragraphes **originaux** (base / phase / immeuble) |
| Boutons | **Icônes sur tous les boutons** (lucide-react, déjà installé) |
| Label reset | « Recommencer » + icône ↺ (raccourci ; e2e ajusté) |

## Système de couleurs

Recoloration **par les tokens** dans `src/index.css` (`:root` et `.dark`) — aucun
composant shadcn modifié.

- `--primary` → indigo `#4f46e5` ; `--ring` aligné sur l'accent. Impacte boutons, barre
  de progression, focus, valeur du bandeau.
- `--secondary` / `--muted` / `--accent` : légère teinte indigo froide (panneaux, bandeau)
  au lieu du gris pur.
- **6 tokens `--type-1..--type-6`** (pastels) exposés dans `@theme inline`, **plus** un
  mapping TypeScript source unique de vérité :

```ts
// src/data/types.ts (ou src/content/) — couleur par type, ordre canonique de TYPE_IDS
export const TYPE_COLORS: Record<TypeId, string> = {
  travaillomane: "var(--type-1)", // indigo  #6366f1 — pensée / structure
  perseverant:   "var(--type-2)", // violet  #8b5cf6 — valeurs / conviction
  empathique:    "var(--type-3)", // rose    #ec4899 — émotions / lien
  reveur:        "var(--type-4)", // cyan    #06b6d4 — imaginaire / calme
  rebelle:       "var(--type-5)", // ambre   #f59e0b — plaisir / humour
  promoteur:     "var(--type-6)", // émeraude#10b981 — action / intensité
}
```

(Le mapping type→teinte est ajustable ; ci-dessus une association sémantique de départ.)

- **Radar** (`RadarProfil.tsx`) : passe de `--chart-*` à `TYPE_COLORS` → chaque axe/série
  prend la couleur de son type.
- **Pyramide** (`Immeuble.tsx`) : chaque étage prend `TYPE_COLORS[type]`.
- **Panneau d'explications** : pastille de chaque section colorée (cohérence visuelle avec
  radar + pyramide).

> Cohérence garantie : pyramide ↔ radar ↔ pastilles tirent tous de `TYPE_COLORS`.

## Composants

### `SplitLayout` (nouveau — `src/components/SplitLayout.tsx`)

Layout deux volets réutilisable (intro + quiz).

- **Rôle** : disposer un volet gauche (1/3) et un volet droit (2/3) en desktop ;
  empiler en mobile.
- **API** :

```tsx
function SplitLayout({
  left,
  right,
  hideRightOnMobile = false, // quiz: true ; intro: false
}: {
  left: React.ReactNode
  right: React.ReactNode
  hideRightOnMobile?: boolean
}): React.ReactElement
```

- **Desktop** (`md:`) : `grid-cols-3`, gauche `col-span-1`, droite `col-span-2`,
  `min-h-svh`, gap et padding cohérents avec l'existant.
- **Mobile** : empilé (`flex-col`) ; si `hideRightOnMobile`, le volet droit est masqué
  (`hidden md:block`).
- **Dépend de** : rien (pur agencement). Testable visuellement.

### `ProfilExplainer` (nouveau — `src/components/ProfilExplainer.tsx`)

Panneau statique « Comment lire ton profil ».

- **Rôle** : afficher l'explication base / phase / immeuble (3 sections, chacune avec une
  pastille colorée et un court paragraphe original).
- **API** : aucun prop (contenu statique) — ou `className?` pour ajustements.
- **Contenu** : 3 paragraphes **originaux** stockés dans `src/content/` (ex.
  `explainer.ts`), pas en dur dans le composant.
- **Dépend de** : le contenu textuel + (optionnel) `TYPE_COLORS` pour les pastilles.

### Écrans

- **`IntroScreen`** : `SplitLayout` ; gauche = titre « process gomme » + sous-titre court +
  gros bouton « Commencer » (icône) centré verticalement ; droite = `ProfilExplainer`.
  `hideRightOnMobile=false`.
- **`QuizScreen`** : `SplitLayout` ; gauche = bloc actuel (progress, question animée, choix,
  nav) ; droite = `ProfilExplainer`. `hideRightOnMobile=true` → mobile inchangé.
- **`ResultsScreen`** (layout C) :
  - `<header>` : `<h1>` « Tes résultats » + bouton « Recommencer » (icône ↺) **en haut à
    droite** (`flex justify-between items-center`).
  - **Bandeau** : carte teintée (accent) « Ta base · ta phase » avec les deux valeurs en
    évidence.
  - **Split** : colonne latérale `md:sticky md:top-6 md:w-[38%]` (Immeuble + RadarProfil,
    lazy) / corps `md:flex-1` (Synthese). Mobile : empilé.

## Boutons & icônes (lucide-react)

| Bouton | Écran | Icône (proposition) |
|---|---|---|
| Commencer | intro | `ArrowRight` |
| Précédent | quiz | `ChevronLeft` |
| Suivant | quiz | `ChevronRight` |
| Voir mes résultats | quiz (dernière question) | `Sparkles` |
| Recommencer | résultats | `RotateCcw` |

Icônes en `size-4`, placées via `<Icon className="..." />` à l'intérieur du `<Button>`
(gap géré par shadcn). `aria-hidden` sur l'icône, le label texte reste pour l'a11y.

## Préservation (ne pas casser)

- Transition Framer Motion entre questions + `useReducedMotion`.
- `aria-label` existants (radar, contrôles).
- Lazy-load de Recharts sur l'écran de résultats.
- Aucun changement : `lib/scoring.ts`, `data/questions.ts`, reducer, flux `App.tsx`.

## Impact tests

- **e2e** (`e2e/smoke.spec.ts`) : le bouton reset passe de « Recommencer le test » à
  « Recommencer » → ajuster le sélecteur. Le `waitForTimeout(350)` pour l'animation reste
  valable. Vérifier que le panneau desktop-only ne perturbe pas les clics (le test tourne
  en viewport par défaut, desktop).
- **unitaires** : `App.test.tsx`, `QuizScreen.test.tsx` — adapter si des sélecteurs
  dépendent de la structure DOM modifiée.
- **nouvel invariant** : test que `TYPE_COLORS` couvre exactement les 6 `TYPE_IDS` (même
  esprit que les invariants de `questions.ts`).

## Hors périmètre (YAGNI)

- Pas de toggle dark mode exposé (on recolore `.dark` par propreté, sans l'exposer).
- Pas de panneau d'explications contextuel par question (écarté : biais sur le test).
- Pas de refonte du contenu du test (types, questions, synthèses inchangés).
- Pas de lazy-load de Framer Motion (reste au backlog).
