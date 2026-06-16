# Questionnaires par public (enfant / étudiant / adulte) — design

**Date** : 2026-06-16
**Statut** : spec validée (en attente relecture utilisateur)

## Intention

Proposer le même inventaire de personnalité à **trois publics** dont le quotidien
diffère, en adaptant **uniquement le contexte des questions** (pas leur sens) :

- **Enfant** — école primaire
- **Étudiant** — fin de lycée / études supérieures
- **Adulte** — vie active (le questionnaire actuel)

Exemple de dérivation : un contexte « meuble livré en kit » (adulte) devient « boîte de
Lego » (enfant) ou « meuble à monter dans la chambre étudiante » (étudiant). Le **type
visé** par chaque option reste identique ; seul l'habillage change.

## Principe directeur

Le moteur de scoring ne lit que la **structure** d'une question (`id`, `famille`, `kind`,
et les `cible` des options / du Likert) — **jamais le texte**. On exploite cette propriété :

> Une **structure unique et partagée** + **trois calques de texte** (un par public).

Conséquences :

- Le **scoring, les 6 types, et tout le contenu de résultats** (descriptions, synthèse,
  immeuble, « pour aller plus loin », stress, canaux, vigilance…) restent **communs aux
  trois publics**. Rien à dupliquer côté résultats.
- L'**équilibrage** (8× forcé + 1× Likert par type et par famille) est garanti **une seule
  fois**, au niveau de la structure. Divergence entre publics structurellement impossible.
- Le **lien de partage `?r=`** reste **inchangé** : il encode `socle` + `phase`, qui sont
  indépendants du public ayant produit le profil.

## Modèle de données

Séparation nette **structure** (`src/data/`, testée) / **prose** (`src/content/`, générée).

```
src/data/audiences.ts          # Audience + AUDIENCES (id, label, icône lucide)
src/data/questions.ts          # SQUELETTE : QUESTION_STRUCTURE[] (zéro texte)
src/content/questions/
  adulte.ts                    # calque de texte (migration verbatim de l'actuel)
  enfant.ts                    # calque généré
  etudiant.ts                  # calque généré
src/lib/questions.ts           # getQuestions(audience): Question[]
```

### Audience

```ts
// src/data/audiences.ts
export type Audience = "enfant" | "etudiant" | "adulte"

export interface AudienceMeta {
  id: Audience
  label: string            // "Enfant" | "Étudiant" | "Adulte"
  icon: LucideIcon         // ToyBrick | GraduationCap | Briefcase
}

export const AUDIENCES: AudienceMeta[] = [/* enfant, etudiant, adulte */]
```

Ids **sans accent** (cohérent avec les slugs internes `reveur`, etc.). Le label affiché
est la seule chaîne « humaine » côté structure.

### Squelette de structure

```ts
// src/data/questions.ts — AUCUN texte
export type Famille = "base" | "phase"

interface StructBase { id: string; famille: Famille }

export interface ForcedStruct extends StructBase {
  kind: "forced"
  cibles: [TypeId, TypeId, TypeId, TypeId]   // 4 types distincts (invariant testé)
}
export interface LikertStruct extends StructBase {
  kind: "likert"
  cible: TypeId
}
export type QuestionStruct = ForcedStruct | LikertStruct

export const QUESTION_STRUCTURE: QuestionStruct[] = [/* 36 entrées, ordre figé */]
```

### Calque de texte (un fichier par public)

Le texte est **indexé par `id`** ; pour un forcé, les labels sont **indexés par `cible`**.
L'invariant « 4 cibles distinctes par question » garantit l'unicité → aucun désalignement
possible (contrairement à un alignement par index).

```ts
// src/content/questions/adulte.ts (et enfant.ts, etudiant.ts)
export type ForcedText = { prompt: string; labels: Record<TypeId, string> }
export type LikertText = { statement: string }
export type QuestionText = ForcedText | LikertText

export const ADULTE: Record<string, QuestionText> = {
  "b-fc-01": {
    prompt: "Quand je monte un meuble livré en kit, par nature je…",
    labels: {
      travaillomane: "lis la notice du début à la fin et je trie les pièces une à une.",
      rebelle: "laisse la notice de côté et je monte selon mon envie du moment.",
      perseverant: "le monte par principe jusqu'au bout, sans tricher…",
      promoteur: "vise le montage entier et je relève le défi sans m'arrêter.",
    },
  },
  // … 35 autres
}
```

### Resolver

```ts
// src/lib/questions.ts — pur, testable
export function getQuestions(audience: Audience): Question[]
```

`getQuestions` fusionne `QUESTION_STRUCTURE` avec le calque du public et **reconstruit
exactement le type `Question[]`** (forcé : `{ id, famille, kind, prompt, options: [{label,
cible}×4] }` ; Likert : `{ id, famille, kind, statement, cible }`) déjà consommé par l'UI.
Les types `Question`/`Option` (forme résolue, avec texte) restent exportés pour l'UI.

## Flux applicatif

```
intro (choix public) → quiz → résultats
```

- **`QuizState`** gagne `audience: Audience | null`. L'action `start` devient
  `{ type: "start"; audience: Audience }`.
- **Intro** : le bouton « Commencer » unique est remplacé par une **rangée de 3 cartes**
  (icône lucide + label seul : `Enfant` / `Étudiant` / `Adulte`), dans le volet gauche du
  `SplitLayout` ; le texte d'intro (titre + note « ~5 min · rien n'est enregistré ») est
  conservé au-dessus. Volet droit `ProfilExplainer` **inchangé**. Desktop = rangée ;
  mobile = cartes empilées (volet droit déjà masqué en mobile). Clic carte →
  `dispatch({ type: "start", audience })`.
- **QuizScreen** : `const questions = useMemo(() => getQuestions(state.audience), [state.audience])`.
  Le shuffle des options forcées (`shuffledIndices`, stable par session) s'applique sur le
  résultat résolu, inchangé.
- **Résultats & partage** : **inchangés**. Un lien `?r=` rouvert → « Faire mon test » →
  intro → l'utilisateur choisit un public.

## Génération du contenu (enfant, étudiant)

L'**adulte** est l'existant **figé** (migration verbatim). On génère **enfant** et
**étudiant** par dérivation des 36 questions adultes, via le tool **Workflow**, **itération
par question**, reprise du pattern « jury » des features précédentes.

### Contrat de dérivation

Pour chaque question (prompt + 4 labels tagués par cible, ou énoncé Likert) :

1. **Changer le contexte, pas le sens.** Le label d'une cible doit toujours exprimer **la
   tendance de ce type** ; l'intention de la question est préservée.
2. **Respecter les contrats de continuation** : base = verbe à la 1ʳᵉ personne **sans « je »**
   en tête ; phase = infinitif ou subordonnée (voir `CONVENTIONS.md`).
3. **Forme parallèle non-orientante** : les 4 options d'une question restent comparables en
   longueur, structure, registre, énergie (seule la teneur du type distingue).
4. **Français correct** : accents, ponctuation soignés.
5. **100 % original** : aucune reformulation de matériel propriétaire.

### Conseil de 5 personas (ultrathink)

Par question, raffinement d'un brouillon jusqu'à validation du conseil :

1. **Gardien du sens** — la cible / l'intention est-elle préservée ?
2. **Spécialiste du public** — instituteur (enfant) / conseiller d'orientation (étudiant) :
   le contexte est-il crédible et familier pour ce public ?
3. **Styliste** — forme parallèle, non-orientante.
4. **Grammairien** — contrats de continuation + accents / ponctuation.
5. **Le public lui-même** — un enfant / un étudiant : « est-ce que ça me parle ? »

### Garde-fous Workflow (voir `QUIRKS.md`)

- Risque de **rate-limit** sur grosse rafale → possibilité de **fusionner le jury en 1
  agent multi-angles** ; script **résilient aux `null`** (`filter(Boolean)`, garder le
  dernier état valide) ; reprise via `resumeFromRunId` pour réutiliser le cache.
- **Provenance** écrite sous `docs/superpowers/artifacts/` (brouillons + verdicts).

## Tests

Le moteur est déjà prouvé sur questionnaire simulé et **ne dépend que de la structure** —
le valider une fois couvre les trois publics.

- **Moteur (existant, déplacé sur le squelette)** : `scoring.test.ts` (`answersFavorisant`
  fabrique un questionnaire complet → `computeResult` → base/phase/immeuble/normalisation/
  cas vide). Tourne tel quel en lisant `QUESTION_STRUCTURE`.
- **Structure & équilibrage (existant, sur le squelette)** : `questions.test.ts` (36 items,
  18/18, 12+6, ids uniques, 4 cibles distinctes, 8×/1× par type et famille).
- **Calques (nouveau)** : pour **chaque** public, **chaque** `id` de la structure a un
  calque ; un forcé a des `labels` pour **exactement** les cibles de la question ; aucune
  chaîne vide (prompt/statement/labels). Migre les anciens checks `label.length > 0` /
  `prompt.length > 0`.
- **Resolver (nouveau)** : `getQuestions(audience)` rend 36 questions bien formées pour
  chaque public, cohérentes avec la structure.
- **Intro (nouveau)** : 3 cartes rendues ; clic → `dispatch` avec le bon `audience`.
- **Reducer** : `start` porte l'`audience` et passe en écran quiz.
- **e2e** : `smoke.spec.ts` clique désormais une **carte** (au lieu de « Commencer ») ;
  couvre au moins un public non-adulte. `share.spec.ts` adapté au même point d'entrée.

## Découpage d'implémentation (aperçu)

1. **Refactor structurel sans changement de comportement** : extraire la structure
   (`QUESTION_STRUCTURE`) + calque `adulte.ts` (verbatim) ; `getQuestions` ; brancher
   `scoring`/`reducer` sur le squelette, `QuizScreen` sur `getQuestions("adulte")` ;
   déplacer les tests. Gate vert = parité adulte prouvée.
2. **Choix de public** : `audiences.ts`, cartes d'intro, `audience` dans l'état, action
   `start` paramétrée, `QuizScreen` résout selon `state.audience`.
3. **Génération de contenu** : calques `enfant.ts` / `etudiant.ts` via Workflow jury.
4. **Tests & e2e** : calques, resolver, intro, e2e mis à jour.

## Non-goals (YAGNI)

- Pas de **dépendance i18n** (archi i18n maison, zéro lib).
- Pas d'**autres langues** (la dimension publique n'est pas la dimension langue).
- Pas d'adaptation du **ton des résultats** par public (contenu de résultats commun).
- Pas de **mémorisation du public** dans le lien de partage.
- Pas de **sélecteur de public en cours de quiz** (choix uniquement à l'accueil).
