# Bloc 3 — Quiz + scoring + synthèse — Design

> Design validé le 2026-06-13. Scope : assemblage de l'application à partir du contenu
> validé au Bloc 2 (`src/data/types.ts`, `src/data/questions.ts`). Dernier bloc du brief.

## Contrainte transverse (rappel)

100 % statique, aucun backend, aucune donnée envoyée : tout le state reste en mémoire
navigateur. Synthèses textuelles **100 % originales** (dérivées des essences/besoins du
Bloc 2), jamais de reformulation de matériel propriétaire. Noms officiels des 6 types en
façade (décision Bloc 2), tout contenu descriptif rédigé maison.

## Objectif

Assembler l'app : 3 écrans (intro → quiz paginé → résultats), un moteur de scoring pur,
et un écran de résultats « signature » (immeuble animé + radar + synthèse).

## Flux & état

- 3 écrans pilotés par un `useReducer` en mémoire : `intro` → `quiz` → `results`.
- Aucun routing d'URL. État : `{ screen, answers, index }`.
- `answers` : `Record<questionId, Answer>` où
  `Answer = { kind: 'forced', cible: TypeId } | { kind: 'likert', valeur: 1|2|3|4|5 }`.
- Bouton « recommencer » sur les résultats → reset complet de l'état.

## Écran 1 — Intro

Titre, courte présentation (logique base/phase/immeuble, ~36 questions, ~5 min, privé,
rien n'est envoyé), bouton « Commencer ». Contenu original, sobre.

## Écran 2 — Quiz

- **Une question par écran**, transition glissée Framer Motion entre questions.
- `Progress` shadcn : avancement n/36.
- **Choix forcés** → `RadioGroup` (2 options). **Likert** → `Slider` (1→5, défaut **3**).
- Boutons **Précédent / Suivant** explicites (pas d'auto-avance). « Suivant » désactivé
  tant qu'un choix forcé n'est pas répondu ; un Likert est toujours validable (défaut 3).
  Back-navigation autorisée (les réponses déjà saisies sont conservées).
- Ordre de présentation : ordre du tableau `QUESTIONS` (base puis phase). (Pas de
  randomisation — déterminisme pour tests et reproductibilité.)

## Écran 3 — Résultats — moteur de scoring

Module pur `src/lib/scoring.ts`, sans dépendance UI, entièrement testable.

**Schéma de scoring (validé) :**
- 2 vecteurs de 6 scores : **socle** (items `famille: "base"`) et **motivation**
  (items `famille: "phase"`).
- **Choix forcé** : l'option choisie ajoute **+1** au type ciblé.
- **Likert** (réponse `r` ∈ 1..5) : ajoute **(r − 1) / 4** au type ciblé (0 à 1 point).
- **Normalisation** : chaque vecteur est ramené en pourcentages (somme = 100). Si un
  vecteur est entièrement nul (cas théorique), répartir à 0 et éviter la division par 0.

**Dérivés :**
- **Base** = `argmax(socle)`. **Phase** = `argmax(motivation)`.
- **Immeuble** = les 6 types triés par score **socle** décroissant (structure stable).
- **Égalités** : départage déterministe par l'ordre canonique `TYPE_IDS`.
- **Cas `base === phase`** : géré explicitement (drapeau `baseEgalePhase`), l'UI affiche
  une variante de texte dédiée — situation normale, jamais une incohérence.

**Interface :**
```ts
export interface ScoreResult {
  socle: Record<TypeId, number>        // %
  motivation: Record<TypeId, number>   // %
  base: TypeId
  phase: TypeId
  immeuble: TypeId[]                    // 6 types, socle décroissant
  baseEgalePhase: boolean
}
export function computeResult(answers: Answers): ScoreResult
```

## Écran 3 — Résultats — affichage (split vertical validé)

Mise en page **split vertical** ; sur mobile, empilement (visuels au-dessus du texte).

**Colonne gauche — visuels :**
- **Immeuble = pyramide** : 6 étages empilés et centrés, **largeur ∝ score** (socle),
  socle (score max) en bas, étage de la **phase** mis en évidence (accent visuel).
  **Animation de construction étage par étage au reveal** — le moment signature ;
  soigner celui-ci, garder le reste sobre.
- **Radar** (Recharts) : 6 axes (les 6 types), polygone du vecteur socle. Lecture de la
  forme d'ensemble.

**Colonne droite — synthèse, sections titrées (simples paragraphes, zéro interaction,
tout sur une page) :**
1. **Base** — paragraphe original sur le type de base.
2. **Phase** — paragraphe original sur le besoin du moment.
3. **Immeuble** — court texte expliquant la lecture de la structure (ordre des étages).
4. **Interactions base × phase** — texte composé par **template paramétré**
   (base + phase + transition), avec variante dédiée si `base === phase`.

Pas de Tabs ni d'Accordion (décision : lecture verticale simple). Bouton « recommencer ».

## Contenu textuel (`src/content/`, 100 % original)

- `descriptions.ts` : pour chacun des 6 types, un paragraphe **base** + un paragraphe
  **phase** (dérivés de `TYPES[*].essenceBase` / `besoinPhase`, étoffés, originaux).
- `interactions.ts` : `composeInteraction(base, phase) → string` — template paramétré qui
  assemble base + phase + une transition ; cas `base === phase` → texte spécifique.
- `immeuble.ts` (ou constante) : gabarit du texte d'explication de l'immeuble.

## Architecture & découpage

```
src/
  data/                 # (Bloc 2) types.ts, questions.ts
  lib/
    scoring.ts          # moteur pur + types Answer/Answers/ScoreResult
    scoring.test.ts
  content/
    descriptions.ts     # 6 base + 6 phase (original)
    interactions.ts     # template paramétré
  features/
    quiz/
      quizReducer.ts     # état + actions
      QuizScreen.tsx     # orchestration page quiz
      ForcedChoice.tsx   # RadioGroup
      LikertScale.tsx    # Slider
    results/
      ResultsScreen.tsx  # split layout
      Immeuble.tsx       # pyramide animée
      RadarProfil.tsx    # Recharts
      Synthese.tsx       # sections titrées
    intro/
      IntroScreen.tsx
  App.tsx               # routeur d'écrans (useReducer)
```

Chaque fichier a une responsabilité unique et une interface claire. `scoring.ts` et
`content/*` sont purs (sans React) → testables isolément.

## Qualité plancher

- **Responsive** mobile (le split s'empile, la pyramide et le radar restent lisibles).
- **Focus clavier visible** sur tous les contrôles (RadioGroup, Slider, boutons) ;
  navigation au clavier dans le quiz.
- **`prefers-reduced-motion`** respecté : transitions Framer Motion et animation de
  l'immeuble réduites/instantanées quand l'utilisateur le demande.

## Tests

- **Unitaires `scoring.ts`** : normalisation en %, somme = 100, `argmax` base/phase,
  ordre de l'immeuble, départage d'égalités déterministe, drapeau `baseEgalePhase`,
  robustesse vecteur nul. Jeux de réponses synthétiques.
- **Unitaires `interactions.ts`** : composition base×phase, variante `base === phase`.
- **Composant** : navigation quiz (Suivant désactivé sans réponse forcée, back conserve
  les réponses, Progress avance).
- **E2E Playwright** : parcours complet intro → répondre aux 36 → résultats affichés
  (pyramide + radar + synthèse présents). Met à jour/complète le smoke existant.

## Hors scope

Persistance, comptes, partage de résultats, i18n, analytics. Tout reste en mémoire.

## Réserve connue (transmise par Adrien)

[Inférence] La justesse des synthèses dépend de la qualité des paragraphes originaux et
du template d'interaction ; calibration sur la logique générale du modèle, sans copier le
matériel propriétaire. La rédaction des textes se fera avec relecture.
