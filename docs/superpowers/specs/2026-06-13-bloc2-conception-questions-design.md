# Bloc 2 — Conception des 36 questions — Design

> Design validé le 2026-06-13. Scope : **uniquement le Bloc 2** du brief
> (`brief-claude-code-pcm.md`) — le CONTENU du test (modèle des 6 types + 36 items +
> équilibrage). Le quiz, le scoring et la synthèse sont le Bloc 3 (spec séparée).
>
> **La rédaction des 36 items concrets se fera en ULTRATHINK** à l'implémentation
> (raisonnement combinatoire = priorité, cf. brief).

## Contrainte transverse (rappel impératif)

Le matériel officiel PCM (fiches descriptives, items d'inventaire validés, canaux,
séquences de stress) est **propriétaire**. On rédige des **contenus 100 % originaux**
inspirés de la logique générale base / phase / immeuble — jamais une reformulation ou
un copier-coller d'un inventaire existant.

**Décision Adrien (revirement assumé sur la clause « libellés »)** : on **reprend les
noms officiels des 6 types en façade** (Travaillomane, Persévérant, Empathique, Rêveur,
Rebelle, Promoteur — mots français courants, risque copyright faible), MAIS **tout le
reste — essences, besoins, items, synthèses — est rédigé original**. On n'affiche ni la
marque « PCM / Process Communication Model », ni aucune fiche descriptive officielle.

## Objectif

Produire le contenu du test (pas l'UI) : le modèle des 6 types et 36 items typés,
équilibrés et discriminants, prêts à alimenter le moteur de scoring du Bloc 3.

## Les 6 types (noms officiels, contenu original)

Calibrés 1:1 sur les 6 filtres perceptuels de la logique générale. Essences et besoins
ci-dessous = **formulations maison** (point de départ ; les paragraphes de synthèse
complets du Bloc 3 en dériveront).

| `TypeId` | Type | Filtre perceptuel (BASE) | Besoin psychologique (PHASE) |
|---|---|---|---|
| `travaillomane` | Travaillomane | pensées et structures : trie, planifie, veut logique et faits | reconnaissance de la **qualité du travail** ; repères de temps clairs |
| `perseverant` | Persévérant | valeurs et opinions : jauge le juste, le fiable, le digne d'engagement | reconnaissance de ses **convictions** et de son engagement |
| `empathique` | Empathique | émotions et liens : ressent l'ambiance, prend soin de la relation | être reconnu **en tant que personne** ; chaleur, contact bienveillant |
| `reveur` | Rêveur | images et réflexions intérieures : observe, imagine, prend du recul | espaces de **solitude et de calme** pour l'imaginaire |
| `rebelle` | Rebelle | réactions « j'aime / j'aime pas » : spontané, créatif, plaisir et humour | **contact ludique**, jeu, légèreté |
| `promoteur` | Promoteur | actions et opportunités : direct, charmeur, fonce et s'adapte | **action, défi, intensité** dans l'instant |

## Architecture des 36 items

- **18 base + 18 phase.** Par famille : **12 choix forcés (FC) + 6 Likert**.
- **Format** :
  - **FC** = micro-scénario situationnel avec **exactement 2 options** (A → type X,
    B → type Y), types **opposés et discriminants**. Les deux options doivent être
    également plausibles (aucune « bonne réponse »).
  - **Likert** = énoncé introspectif, échelle **1→5** (pas du tout d'accord → tout à
    fait), pondérant **un seul** type cible.
- **Style & voix** : « je » à la 1ʳᵉ personne, ton neutre. FC = scénario concret ;
  Likert = énoncé d'état/besoin.
- **Ancrage temporel systématique (levier anti-confusion base/phase)** :
  - **base** : « en général / par nature / depuis toujours » (trait stable, hors du temps).
  - **phase** : « ces derniers temps / en ce moment » (état motivationnel actuel,
    angle **besoins psychologiques** : ce qui nourrit ou frustre en ce moment).

## Équilibrage (à justifier explicitement — exigence du brief)

Cible = nombre de fois où un type peut être « gagné » par un item.

**Par famille (base, puis phase, identiques) :**
- 12 FC × 2 options = **24 apparitions-cible** ÷ 6 types = **4 par type** en forcé.
- 6 Likert × 1 cible = **6 apparitions-cible** ÷ 6 types = **1 par type** en Likert.
- **Total : exactement 5 apparitions-cible par type et par famille.**

**Tableau type × famille (objectif) :**

| Type | base (FC + Likert = total) | phase (FC + Likert = total) |
|---|---|---|
| chacun des 6 | 4 + 1 = **5** | 4 + 1 = **5** |

→ couverture parfaitement homogène : **5 partout**, **10 par type au global**.

**Appariement des choix forcés (graphe d'opposition) :**
Sur chaque famille, les 12 FC forment un **multigraphe 4-régulier** sur les 6 types
(chaque type a un degré de 4 : il apparaît dans 4 forcés). Principe de sélection des
arêtes : **opposer des types qui séparent vraiment** (axes croisés), p.ex.
- Travaillomane ↔ Rebelle (structure vs spontanéité)
- Promoteur ↔ Rêveur (action vs retrait)
- Empathique ↔ Persévérant (relation vs conviction)
- Travaillomane ↔ Empathique (faits vs ressenti)
- Rebelle ↔ Persévérant (légèreté vs gravité), etc.

Éviter d'opposer deux types trop proches sur un même axe (faible pouvoir discriminant).
Le **planning d'appariement complet des deux familles** (liste des 24 arêtes) est posé
et vérifié **à l'implémentation, en ultrathink**, et documenté dans le fichier livrable.

## Modèle de données

**Fichier `src/data/types.ts`** — les 6 types :
```ts
export type TypeId =
  | 'travaillomane' | 'perseverant' | 'empathique'
  | 'reveur' | 'rebelle' | 'promoteur'

export interface TypeMeta {
  id: TypeId
  nom: string          // libellé affiché (ex. "Travaillomane")
  essenceBase: string  // filtre perceptuel, formulation maison
  besoinPhase: string  // besoin psychologique, formulation maison
}

export const TYPES: Record<TypeId, TypeMeta>  // les 6, contenu original
export const TYPE_IDS: TypeId[]               // ordre canonique des 6
```

**Fichier `src/data/questions.ts`** — les 36 items :
```ts
import type { TypeId } from './types'

export type Famille = 'base' | 'phase'

interface QuestionBase { id: string; famille: Famille }

interface Option { label: string; cible: TypeId }

export interface ForcedChoice extends QuestionBase {
  kind: 'forced'
  prompt: string                 // contexte du micro-scénario
  options: [Option, Option]      // exactement 2, types opposés
}

export interface Likert extends QuestionBase {
  kind: 'likert'
  statement: string              // énoncé introspectif
  cible: TypeId                  // 1→5 pondère cette cible
}

export type Question = ForcedChoice | Likert

export const QUESTIONS: Question[]   // 36 items (18 base + 18 phase)
```

`famille` + `cible` portent toute l'information nécessaire au scoring (Bloc 3). Aucune
logique de scoring ici : le Bloc 2 ne produit que de la donnée typée.

**Convention d'`id`** : `b-fc-01`, `b-lk-01`, `p-fc-01`, `p-lk-01`… (famille / format /
n°) pour lisibilité et tests.

## Livrable du Bloc 2

1. `src/data/types.ts` — les 6 types (contenu original).
2. `src/data/questions.ts` — les 36 items typés.
3. **Tableau de justification de l'équilibrage** (constante exportée + commentaire) :
   matrice type × famille montrant 5 partout, et la liste des 24 arêtes d'appariement FC.
4. **Tests unitaires de cohérence** (Vitest) garantissant les invariants : 36 items,
   18/18 par famille, 12 FC + 6 Likert par famille, chaque type cible exactement 4× en
   FC et 1× en Likert par famille, FC à exactement 2 options de types distincts, ids
   uniques. (Les tests valident la STRUCTURE, pas la qualité rédactionnelle.)

## Hors scope (Bloc 3)

Quiz/UI, moteur de scoring, vecteurs base/phase, immeuble, radar, synthèses textuelles,
gestion `base = phase`. Le Bloc 2 s'arrête à la donnée.

## Réserve connue (transmise par Adrien)

[Inférence] Le mapping item→type et la sémantique fine base/phase restent la principale
source d'imprécision. L'ancrage temporel + l'angle « besoins psychologiques » pour la
phase + l'opposition de types discriminants en FC sont les garde-fous retenus. La
calibration s'appuie sur la logique générale du modèle, sans copier le matériel
propriétaire.
