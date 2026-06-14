# Partage de la page de résultats par URL — design

**Date** : 2026-06-14
**Statut** : validé (brainstorming), à implémenter

## Problème

La page de résultats n'existe qu'en mémoire navigateur : impossible de la montrer à
quelqu'un sans refaire le test. On veut pouvoir **partager son profil** via un lien.

Contrainte d'hébergement : le site est **statique sur GitHub Pages** (aucun backend, base
path `/process-gomme/`). Le partage doit donc tenir entièrement côté client, dans l'URL.

## Objectif

1. Un bouton **« Partager »** sur la page de résultats qui copie dans le presse-papier une
   URL encodant le profil affiché, et le signale à l'utilisateur·ice.
2. À l'ouverture d'une URL contenant ce code, l'app affiche **directement** la page de
   résultats reconstruite à partir du code.

## Décisions de design (issues du brainstorming)

- **Contenu encodé** : un *snapshot des scores* — les 6 scores `socle` (arrondis) + la
  `phase`. Suffit à reconstruire fidèlement toute la page (pyramide, radar, synthèse).
  `motivation` n'est jamais affiché (il ne sert qu'à calculer la phase), donc non encodé ;
  `base` et `immeuble` se redérivent de `socle`.
- **Type d'affichage** : introduire `DisplayResult = Omit<ScoreResult, "motivation">`. La
  page de résultats ne dépend que de ce type. `computeResult(...)` (un `ScoreResult`) reste
  assignable ; le décodage produit un `DisplayResult` honnête (pas de champ fantôme).
- **Source du résultat découplée de l'affichage** : `App` calcule/décode le résultat et le
  passe à `ResultsScreen` ; `ResultsScreen` ne calcule plus lui-même.
- **UX destinataire** : un **bandeau « profil partagé »** + CTA « Faire mon test » en haut
  de la page quand on arrive via un lien. Le bouton « Recommencer » est masqué dans ce mode.
- **Feedback de copie** : le bouton se transforme en « ✓ Lien copié » ~2 s puis revient
  (zéro dépendance, `aria-live`).
- **Zéro nouvelle dépendance** : `URLSearchParams` / `history` natifs, Clipboard API native.

## Format du code

Payload JSON compact puis **base64url** (URL-safe : `+`→`-`, `/`→`_`, `=` retirés) :

```jsonc
// s = socle arrondi dans l'ordre canonique TYPE_IDS ; p = index de la phase (0–5)
{ "s": [34, 22, 18, 12, 8, 6], "p": 2 }
```

Param d'URL : `?r=<base64url>`. URL complète construite avec `import.meta.env.BASE_URL`
(gère le base path GH Pages) → `https://owlnext-fr.github.io/process-gomme/?r=…`.

### `encodeResult(result: DisplayResult): string`

- `s` = `TYPE_IDS.map(t => Math.round(result.socle[t]))`
- `p` = `TYPE_IDS.indexOf(result.phase)`
- `JSON.stringify` → base64url.

### `decodeResult(code: string): DisplayResult | null`

Décode + **valide strictement** ; renvoie `null` à la moindre incohérence :
- base64url → JSON ; `null` si le décodage/parse échoue.
- `s` : tableau de **6 entiers** dans `[0, 100]`. Sinon `null`.
- `p` : entier dans `[0, 5]`. Sinon `null`.
- Reconstruction : `socle` (objet `Record<TypeId, number>`), `phase = TYPE_IDS[p]`,
  puis `base`/`immeuble` via le helper partagé `deriveFromSocle` (voir ci-dessous),
  `baseEgalePhase = base === phase`.

### Anti-duplication

Extraire de `computeResult` la dérivation `socle → { base, immeuble }` dans une fonction
**`deriveFromSocle(socle): { base: TypeId; immeuble: TypeId[] }`**, réutilisée par
`computeResult` et `decodeResult`. Garantit un tri identique (même tie-break
`TYPE_IDS.indexOf`) → le profil partagé est strictement identique à l'original.

## Routing (App.tsx)

- Au montage, lire `?r=` **une seule fois** (lazy state / `useMemo`). Si présent et
  décodable → état « résultat partagé » avec le `DisplayResult` décodé.
- Sinon : flux normal inchangé (`useReducer` : intro → quiz → résultats).
- Le mode partagé est tenu dans un `useState` d'`App` (séparé du reducer, qui reste centré
  sur les `answers`). Pas de pollution du reducer avec un état sans réponses.
- CTA « Faire mon test » : `history.replaceState` pour retirer `?r=` de l'URL +
  `setShared(null)` → retour à l'intro (état initial du reducer).
- Param présent mais invalide (`decodeResult` → `null`) : ignoré, flux normal (intro).

## Composants UI

### `ShareButton` (`src/components/ShareButton.tsx`)

- Props : `result: DisplayResult`.
- Construit l'URL (`origin + BASE_URL + "?r=" + encodeResult(result)`).
- Clic → `navigator.clipboard.writeText(url)` :
  - succès → label « ✓ Lien copié » (icône `Check`) ~2 s puis retour « 🔗 Partager »
    (icône `Share2`/`Link`). `aria-live="polite"`.
  - échec → « Copie impossible » ~2 s. Pas de fallback `execCommand` (déprécié, YAGNI).
- Gère son propre timer ; nettoyer le timeout au démontage.

### Bandeau « profil partagé » (dans `ResultsScreen`, conditionné par `shared`)

- Fond indigo clair, texte « Tu regardes un profil partagé. » + bouton « Faire mon test »
  (→ `onRestart`, qui nettoie l'URL).
- En mode `shared` : bouton « Recommencer » masqué ; « Partager » conservé.

### `ResultsScreen` (modifié)

- Props : `result: DisplayResult`, `shared?: boolean`, `onRestart: () => void`.
- N'appelle plus `computeResult` (déplacé dans `App`). Header : titre + `ShareButton` +
  « Recommencer » (sauf si `shared`). Bandeau si `shared`.

### `Synthese` (modifié)

- `result: DisplayResult` (au lieu de `ScoreResult`). Aucun changement de rendu (n'utilise
  que `base`/`phase`/`immeuble`/`socle`).

## Tests

- **`src/lib/shareCode.test.ts`** : round-trip `encode → decode` (socle arrondi + phase
  préservés ; `base`/`immeuble` correctement redérivés) ; codes invalides (`""`, base64
  cassé, `s` de mauvaise taille, valeurs hors borne, `p` hors borne) → `null`.
- **`src/lib/scoring.test.ts`** (étendu) : `deriveFromSocle` donne le même `base`/`immeuble`
  que `computeResult` sur un cas connu.
- **`src/components/ShareButton.test.tsx`** : clic → `navigator.clipboard.writeText` appelé
  avec la bonne URL (mock) ; le label passe à « Lien copié ».
- **`src/App.test.tsx`** (étendu) : `?r=<valide>` → page de résultats affichée ;
  `?r=<invalide>` → intro.
- **`pnpm before_push`** complet (lint + unit + build + e2e) ; smoke e2e existant vert.

## Hors scope (YAGNI)

- Pas d'aperçu Open Graph / image de partage.
- Pas de `navigator.share` natif (uniquement copie presse-papier).
- Pas de raccourcisseur d'URL ni de versionnement du code (l'encodage des *scores* rend les
  liens robustes à un futur changement de scoring).
