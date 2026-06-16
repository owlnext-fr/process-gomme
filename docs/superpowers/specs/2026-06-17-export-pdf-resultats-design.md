# Export PDF des résultats (téléchargement 1 clic) — design

**Date** : 2026-06-17
**Statut** : spec validée (en attente relecture utilisateur)

## Intention

Permettre à l'utilisateur de **télécharger sa fiche de résultats en PDF** d'un seul clic,
depuis l'écran de résultats (profil personnel **ou** profil partagé). Le PDF est un
**rapport complet** : base·phase, immeuble, radar, synthèse (onglet « Ton profil ») et
« Pour aller plus loin » (canal / stress / vigilance).

## Principe directeur

L'app est **100 % statique** (aucun backend) et le navigateur ne peut pas produire un PDF
sans sa boîte d'impression. Le « 1 clic » impose donc de **générer le PDF en JavaScript**.
On reconstruit un **document vectoriel** avec `@react-pdf/renderer`, à partir des **mêmes
données et fonctions de contenu** que l'écran — pas une capture du DOM.

Bénéfices : sortie **vectorielle** (texte sélectionnable, fichier léger), mise en page
**découplée** de l'écran (pas de bricolage `print`/`forceMount`), et la dépendance lourde
est **lazy-loadée** au clic → **bundle initial intact** (même pattern que Recharts/Framer).

## Composants & fichiers

```
src/components/ExportPdfButton.tsx              # bouton + génération + download (lazy import)
src/features/results/pdf/
  ResultPdfDocument.tsx                         # <Document> react-pdf (assemblage du rapport)
  PdfImmeuble.tsx                               # pyramide redessinée (barres ∝ score)
  PdfRadar.tsx                                  # radar hexagonal (Svg/Polygon) depuis les 6 scores
  pdfColors.ts                                  # 6 couleurs de type en hex (miroir des tokens oklch)
```

### ExportPdfButton

Placé dans le header de `ResultsScreen` à côté de `ShareButton` (visible aussi en vue
partagée). Au clic :

1. **lazy-import** : `const { pdf } = await import("@react-pdf/renderer")` et
   `const { ResultPdfDocument } = await import("@/features/results/pdf/ResultPdfDocument")`
   → react-pdf reste **hors du bundle initial**.
2. `const blob = await pdf(<ResultPdfDocument result={result} date={...} />).toBlob()`.
3. **Download** : `URL.createObjectURL(blob)` → clic programmatique d'un `<a download>` →
   `URL.revokeObjectURL`. Nom de fichier : `process-gomme-<base>-<phase>.pdf` (ids de type,
   ex. `process-gomme-travaillomane-empathique.pdf`).
4. **État de chargement** : libellé « Génération… » + `disabled` pendant la génération, avec
   une région `aria-live` (la lib met quelques centaines de ms à charger/rendre). Gestion
   d'erreur : si la génération échoue, message non bloquant et bouton réactivé.
5. **Icône** lucide **`Download`** (`size-4`, `aria-hidden`), label « Exporter en PDF ».
6. **Date de génération** calculée dans le bouton (`new Date()`) et passée au document
   (format FR, ex. « 17 juin 2026 ») — la logique de date vit dans le composant UI, pas
   dans le contenu pur.

### ResultPdfDocument

Un `<Document>` react-pdf, `<Page size="A4">`, structuré **comme l'écran** :

```
process gomme — <Base> · <Phase>              (titre)
Généré le <date>                              (sous-titre discret)
─────────────────────────────────────────────
Ta base · ta phase                            (bandeau)
Ton immeuble        → <PdfImmeuble>
Ton profil en relief → <PdfRadar>
Synthèse :
  Ta base — <nom>      [hint]  <DESCRIPTIONS[base].base>
  Ta phase — <nom>     [hint]  <DESCRIPTIONS[phase].phase>
  Ton immeuble         [hint]  <IMMEUBLE_INTRO> + liste (nom — X% — ENERGIE[t])
  Interactions base × phase [hint]  <composeInteraction(base, phase)>
Pour aller plus loin :
  Ton canal de communication [hint]  <CANAUX[base]>
  Toi sous stress            [hint]  <composeStress(base, phase)>
  Points de vigilance        [hint]  <vigilance.base> / <vigilance.phase>
```

- **Contenu réutilisé tel quel** : `DESCRIPTIONS`, `IMMEUBLE_INTRO`, `composeInteraction`,
  `ENERGIE`, `CANAUX`, `composeStress`, `composeVigilance`, `SECTION_HINTS`, `TYPES[].nom`,
  `result.socle/base/phase/immeuble`. **Les `SECTION_HINTS` sont inclus** (court rappel sous
  chaque titre de section, comme à l'écran).
- **Pagination automatique** par react-pdf ; on protège les titres avec `wrap`/`break` et
  `minPresenceAhead` (ou `View wrap={false}` sur les blocs courts) pour ne pas couper un
  titre de son texte.
- **Police** : Helvetica intégrée (gère les accents FR et « ») → aucun fichier de police à
  embarquer. (Si un caractère manquait, enregistrer une police ; non prévu par défaut.)
- **Styles** via `StyleSheet.create` (couleurs, tailles, espacements) — palette alignée sur
  l'écran (indigo `primary`, gris muted) mais en valeurs hex (react-pdf n'a pas les tokens).

### Visuels redessinés

react-pdf ne peut pas réutiliser Recharts ni les `<div>` animées : on redessine à partir
des données.

- **`PdfImmeuble`** : pour chaque type de `result.immeuble` (du plus marqué au plus discret),
  une barre (`View` ou `Svg Rect`) dont la **largeur ∝ `socle[t]`**, couleur `pdfColors[t]`,
  étiquette `TYPES[t].nom — X%`. L'**étage de la phase** est encadré (bordure).
- **`PdfRadar`** : un `<Svg>` avec la grille hexagonale (6 axes) + un `<Polygon>` reliant les
  6 scores normalisés, rempli en `primary` semi-transparent. Sommets étiquetés `TYPES[t].nom`.

### Couleurs PDF (`pdfColors.ts`)

`TYPE_COLORS` (`src/data/types.ts`) pointe vers des **CSS vars** (`--type-1..6` dans
`index.css`, déjà en **hex** : `#4f46e5`, `#7c3aed`, `#be185d`, `#0e7490`, `#b45309`,
`#047857` pour le thème clair) — non lisibles au runtime par react-pdf. On définit donc
`PDF_TYPE_COLORS: Record<TypeId, string>`, **miroir hex** de ces 6 tokens. ⚠️ **Couplage** :
si on change une teinte dans `index.css`, mettre à jour ce fichier. Documenté dans
`QUIRKS.md`.

## Tests

- **`ExportPdfButton.test.tsx`** : le clic déclenche la génération (mock de
  `@react-pdf/renderer` → `pdf().toBlob` renvoie un Blob factice) et le **download**
  (mock `URL.createObjectURL`/`revokeObjectURL` + interception du clic `<a>`), avec le **nom
  de fichier** attendu ; l'état « Génération… » apparaît puis se réactive ; le chemin
  d'erreur réactive le bouton.
- **`ResultPdfDocument.test.tsx`** : `renderToBuffer(<ResultPdfDocument .../>)` (API node de
  react-pdf) renvoie un buffer **non vide** pour 2-3 paires base/phase (dont `base === phase`)
  → valide l'assemblage, les clés de contenu et la résolution des couleurs. *Si react-pdf
  ne s'exécute pas dans l'environnement de test, repli : tester que `pdfColors` couvre les 6
  types et que le document se construit sans lever (montage léger).* 
- **e2e** : sur la page de résultats, clic « Exporter en PDF » → `page.waitForEvent('download')`
  et vérifier que le fichier se termine par `.pdf`.

## Non-goals (YAGNI)

- Pas d'**aperçu intégré** (`PDFViewer`) — uniquement le téléchargement.
- Pas de **capture du DOM** (html2canvas) — document reconstruit.
- Pas de mise en page **distincte par public** (le PDF suit le résultat affiché, quel que
  soit le questionnaire d'origine).
- Pas d'export d'un **autre profil** que celui à l'écran.
- Pas d'enregistrement de police personnalisée (Helvetica par défaut).

## Impact sur l'existant

- `ResultsScreen.tsx` : ajouter `<ExportPdfButton result={result} />` dans le header (à côté
  de `ShareButton`). Aucun autre changement de l'écran (le PDF est découplé).
- Nouvelle dépendance runtime `@react-pdf/renderer`, **chargée en lazy** (chunk séparé) →
  bundle initial inchangé ; noter le poids du chunk au build.
