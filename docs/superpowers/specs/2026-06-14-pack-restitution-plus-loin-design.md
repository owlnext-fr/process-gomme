# Pack restitution « Pour aller plus loin » — design

**Date** : 2026-06-14
**Statut** : validé (brainstorming), à implémenter

## Problème

La fiche de résultats restitue base, phase, immeuble et interactions. Le modèle de
référence (inventaire de personnalité / logique base-phase-structure) porte des dimensions
supplémentaires qu'on calcule déjà implicitement mais qu'on n'affiche pas : le **canal de
communication**, les **réactions sous stress**, l'**énergie par étage** et une **synthèse de
vigilance**. On veut enrichir la restitution sans alourdir le questionnaire.

> **Contrainte transverse rappelée** : tout le contenu textuel est **100 % original**. On
> reprend uniquement la **logique** du modèle (quelles dimensions, comment elles se déduisent
> de base/phase/structure), **jamais** un texte source. Pas de jargon de marque.

## Principe directeur

Ces dimensions sont des **conséquences** de la base et de la phase (déjà calculées) : aucune
nouvelle question. L'évolution est **100 % côté restitution** (contenu + UI).

## Périmètre (validé)

4 sections, réparties en 2 onglets :

- **Canal de communication** (dérivé **base**) — nouveau.
- **Toi sous stress** (dérivé **base × phase**) — nouveau.
- **Énergie par étage** (dérivé **socle**) — nouveau, enrichit l'immeuble existant.
- **Points de vigilance** (dérivé **base + phase**) — synthèse **courte/actionnable** (pas un
  paragraphe), pour ne PAS redire la « zone de vigilance » déjà présente dans `descriptions.ts`.

**Écarté** : « Motivation actuelle » (quasi-doublon de la section phase existante).

## Organisation : 2 onglets

`ResultsScreen` : le **header** (titre + boutons Partager/Recommencer) et le **bandeau
base·phase** restent au-dessus, communs. En dessous, des onglets **shadcn/ui Tabs (Radix)** :

- **Onglet « Ton profil »** (`defaultValue`) = la vue actuelle inchangée : colonne gauche
  sticky (immeuble + radar) / colonne droite (`Synthese` : base, phase, immeuble, interactions).
  L'**énergie par étage** enrichit la liste « Ton immeuble » de `Synthese`.
- **Onglet « Pour aller plus loin »** = Canal + Stress + Vigilance, empilés pleine largeur.

À l'ouverture (y compris via lien partagé) : onglet « Ton profil ». L'onglet actif n'est **pas**
mémorisé dans l'URL (YAGNI). Aucun impact sur le partage : tout reste dérivé de `socle`+`phase`.

## Modèle de contenu (nouveaux modules `src/content/`)

Tous indexés par `TypeId`, 100 % originaux, ton cohérent avec `descriptions.ts`.

### `canaux.ts`
```ts
export const CANAUX: Record<TypeId, string> // indexé BASE — « comment on communique le mieux avec toi »
```

### `energie.ts`
```ts
export const ENERGIE: Record<TypeId, string> // une phrase « ce que tu puises à cet étage »
```

### `stress.ts` — template assemblé base × phase (modèle `composeInteraction`)
```ts
export const STRESS_DECLENCHEUR: Record<TypeId, string> // indexé PHASE — le besoin non nourri qui fait monter la tension
export const STRESS_REFLEXE: Record<TypeId, string>     // indexé BASE  — le premier réflexe automatique sous tension
export const STRESS_RETOUR: Record<TypeId, string>      // indexé PHASE — comment revenir à l'équilibre
export function composeStress(base: TypeId, phase: TypeId): string
```
Assemble : « Quand [déclencheur·phase], ton premier réflexe : [réflexe·base]. Pour revenir à
l'équilibre : [retour·phase]. » + **variante quand `base === phase`** (réflexe et déclencheur
alignés), comme `composeInteraction`.

### `vigilance.ts` — synthèse courte (anti-redite avec `descriptions.ts`)
```ts
export const VIGILANCE_BASE: Record<TypeId, string>  // 1 punchline « ce qui peut coincer »
export const VIGILANCE_PHASE: Record<TypeId, string> // 1 punchline « en ce moment »
export function composeVigilance(base: TypeId, phase: TypeId): { base: string; phase: string }
```
Restitué en 2 puces (« ce qui peut coincer » / « en ce moment »), pas un paragraphe.

### `sectionHints.ts` (existant)
Ajout de 3 clés : `canal`, `stress`, `vigilance` (phrases d'explication des encadrés).

## UI

- **`src/components/ui/tabs.tsx`** : composant shadcn/Radix (ajoute `@radix-ui/react-tabs`).
- **`src/components/ResultSection.tsx`** : encadré partagé **extrait** de `Synthese`
  (icône lucide + titre `text-primary` + hint + contenu). Consommé par `Synthese` ET l'onglet 2.
- **`src/features/results/PlusLoin.tsx`** : onglet 2, rend Canal / Stress / Vigilance via
  `ResultSection`. Testable isolément (prend `result: DisplayResult`).
- **`Synthese.tsx`** : utilise `ResultSection` ; ajoute l'énergie dans la liste « Ton immeuble »
  (chaque ligne : `Type — X% — phrase`).
- **`ResultsScreen.tsx`** : enveloppe le contenu sous le bandeau dans `<Tabs>` (onglet 1 = split
  existant inline ; onglet 2 = `<PlusLoin result={result} />`).

**Icônes** (lucide) : Canal → `MessageCircle`, Stress → `CloudRain`, Vigilance → `Eye`.

## Tests

- **Contenu** : par module, les 6 clés présentes + textes non vides (modèle `interactions.test`).
- **`composeStress` / `composeVigilance`** : sortie non vide pour **toute paire** base×phase +
  **variante spécifique quand base === phase** (modèle `composeInteraction.test`).
- **`ResultSection`** : rendu (icône + titre + hint + children).
- **`PlusLoin`** : affiche les 3 sections (canal/stress/vigilance) pour un `result` donné.
- **`Synthese`** : l'énergie apparaît dans la liste de l'immeuble.
- **e2e** : étendre le smoke — après résultats, cliquer l'onglet « Pour aller plus loin » et
  vérifier qu'une section (ex. stress) s'affiche.
- `pnpm before_push` complet (lint + unit + build + e2e).

## Exigence de rédaction (ultrathink)

Les 4 tâches de rédaction de contenu (`canaux`, `energie`, `stress`, `vigilance`) sont des
tâches à **réflexion approfondie** :
- ton et longueur cohérents avec `descriptions.ts` (registre tutoiement, bienveillant, original) ;
- **relecture qualité par jury de personas** (méthode déjà utilisée pour l'harmonisation des
  options) — fidélité au type, absence de redite, équilibre entre les 6 types ;
- **100 % original**, aucune reprise du matériel source, pas de jargon de marque.

## Hors scope (YAGNI)

- Pas de « Motivation actuelle » (doublon de la phase).
- Pas de mémorisation de l'onglet actif dans l'URL.
- Pas de « phase vécue » / mode entretien (incréments futurs, voir BACKLOG).
- Pas de nouvelles questions au questionnaire (tout est dérivé).
