# Questions à 4 réponses — design

**Date** : 2026-06-14
**Statut** : design validé en brainstorming, en attente de relecture du spec
**Type** : évolution du contenu du test (modèle de question + réécriture des réponses)

## Objectif

Faire passer les **24 questions à choix forcé** (12 base + 12 phase) de **2 → 4 options**
(« en ajouter 2 à chaque fois »), en **reformulant** les réponses pour que les 4 soient
également plausibles. Les **6 Likert/famille restent inchangés** (curseur 1→5). La qualité
des réponses est maximisée via une **boucle multi-agents (jury)**.

## Décisions validées

| Sujet | Décision |
|---|---|
| Likert | **Gardés** (curseur 1→5). Seuls les forcés sont élargis. |
| Options par forcé | **4** (4-uplet), ciblant **4 types distincts** sur 6. |
| Mécanique | Reformuler les 2 options existantes + en ajouter 2. |
| Scoring | **Inchangé** : choix forcé = `+1` au type choisi. |
| Équilibrage | Chaque type proposé **exactement 8×/famille** en forcé (+ 1× Likert). |
| Production du contenu | **Workflow multi-agents (jury)** — qualité max. |
| Nombre de questions | Inchangé (36 : 18 base + 18 phase). |
| Hors scope | Pas de mélange aléatoire des options (→ backlog), pas de conversion des Likert. |

## Modèle de données (`src/data/questions.ts`)

- `ForcedChoice.options` : `[Option, Option]` → **`[Option, Option, Option, Option]`**
  (4-uplet, garantie à la compilation).
- Chaque question forcée présente **4 types distincts**. `Option` inchangé
  (`{ label: string; cible: TypeId }`).
- `Likert` inchangé. Le reste des types (`Question`, `Famille`) inchangé.

## Équilibrage (invariant testé)

- Aujourd'hui : chaque type est proposé **4×/famille** en forcé (24 emplacements ÷ 6).
- Avec 4 options : 12 questions × 4 = **48 emplacements ÷ 6 = 8×/famille**.
- On **ajoute chaque type à exactement 4 questions de plus**, parmi celles où il n'est pas
  déjà présent. Invariant final, **par famille** :
  - chaque question forcée a **4 options** de **types distincts** ;
  - chaque type est cible **8×** en forcé et **1×** en Likert.
- **Ordre de travail** : l'assignation des 4 types par question (qui vise les 8×) est
  **décidée d'abord, de façon déterministe** (et figée/testée) ; la rédaction des libellés
  vient ensuite. La boucle qualité ne touche **que la prose**, jamais l'assignation.

> Faisabilité : chaque type passe de 4 → 8 apparitions, soit +4 ajouts répartis sur les 12
> questions sans collision (un type n'est jamais ajouté à une question où il figure déjà).
> L'assignation explicite est produite à l'implémentation et garantie par le test.

## Scoring (`src/lib/scoring.ts`)

**Aucun changement.** `cible[a.cible] += 1` vaut pour 2 ou 4 options. Likert inchangé
(`+(valeur-1)/4`). Effet : chaque question forcée reste « 1 point à 1 type », simplement
plus discriminante (1 chance sur 4 au lieu d'1 sur 2).

## UI

- `ForcedChoice.tsx` : **inchangé** — il mappe déjà `q.options` dans un `RadioGroup`.
  Micro-ajustement d'espacement possible si 4 items serrent trop (cosmétique, non requis).
- `LikertScale.tsx` : **inchangé**.

## Méthode de production du contenu (boucle qualité — Workflow multi-agents)

Le contenu (24 scénarios × 4 options = **96 options** : 48 existantes reformulées + 48
nouvelles) est le cœur de la feature. Production via **Workflow** (orchestration
multi-agents) :

1. **Étape 0 — équilibrage déterministe (code, pas LLM)** : produire l'assignation des 4
   types par question (8×/type/famille). Sortie : pour chaque question, ses 4 types cibles.
2. **Pipeline par question** (les 24 forcés, en parallèle) :
   a. **Brouillon** — 4 options (1 par type assigné), dans la voix du projet.
   b. **Jury multi-angles** — juges indépendants, chacun rend *pass/fail* + corrections :
      - **Fidélité de type** : chaque option évoque *son* type, pas un autre.
      - **Équilibre d'attractivité** : les 4 également tentantes, aucun « intrus » évident.
      - **Discriminance** : des types différents choisiraient plausiblement des options
        différentes.
      - **Naturel & français** : fluide dans le scénario, accents/ponctuation soignés.
      - **Originalité** : zéro reprise/reformulation de matériel propriétaire.
   c. **Correction** → **ré-jugement** → boucle **jusqu'à ce que tous les angles passent**
      (ou N tours, en loggant le résiduel).
3. **Passe finale de cohérence** (critique transverse) : variété de ton entre questions
   (pas de doublons), équilibre global respecté, lecture d'ensemble par famille.

> La sortie de la boucle est intégrée dans `questions.ts` ; le résultat passe ensuite les
> tests d'invariants (structure + équilibrage) — garde-fou final, non négociable.

### Contraintes de rédaction (rappel)

- **Contenu 100 % original** (contrainte transverse du projet) : aucune copie/reformulation
  de matériel propriétaire (types, fiches, items).
- Un **prompt peut être légèrement reformulé** s'il ne peut pas accueillir 4 réponses typées
  crédibles (le scénario reste le même esprit).
- **Français correct** : accents et ponctuation soignés, pas de point-virgule, guillemets
  doubles (style du repo).

## Tests (`src/data/questions.test.ts`)

À mettre à jour :
- « chaque forcé a exactement **2** options » → **4** options, **4 types distincts** et
  valides, labels non vides.
- Équilibrage : comptage forcé par type passe de **4 → 8** par famille (Likert reste 1).
- Inchangés : 36 items, 18/18, 12 forcés + 6 Likert/famille, ids uniques, Likert valides.
- `scoring.test.ts` : **inchangé** (mécanique identique). Vérifier qu'il reste vert.
- e2e (`smoke.spec.ts`) : **inchangé** (clique la 1re option ; 4 options ne change rien).

## Points d'attention / risques

- **Plausibilité à 4** : certains scénarios actuels opposent finement 2 types ; rédiger 4
  options crédibles demande parfois de reformuler le prompt — d'où la boucle qualité.
- **Biais de position** : ordre des options fixe (déterministe pour tests/e2e) → un mélange
  aléatoire est noté au **backlog**, pas dans ce périmètre.
- **Coût tokens** : le Workflow jury est volontairement coûteux (choix « qualité max »).

## Hors périmètre (YAGNI)

- Pas de conversion des Likert en 4 options.
- Pas de réduction/augmentation du nombre de questions.
- Pas de mélange aléatoire des options (backlog).
- Pas de changement du moteur de scoring ni des composants UI (au-delà d'un éventuel
  micro-espacement).
