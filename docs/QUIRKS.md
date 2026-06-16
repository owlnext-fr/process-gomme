# Quirks & pièges connus

Comportements non-évidents découverts au fil du projet. Un H2 par quirk, avec une date.

**Si tu en découvres un nouveau pendant une session : ajoute-le ici dès la découverte, pas plus tard.**

---

## Export PDF : react-pdf lazy, env node pour les tests, couleurs dupliquées (2026-06-17)

L'export PDF (`src/features/results/pdf/*`, `src/components/ExportPdfButton.tsx`) utilise
`@react-pdf/renderer`. Trois pièges :

- **Lazy obligatoire** : react-pdf est **lourd (~1,4 Mo)**. Il n'est importé **que** par
  `ExportPdfButton`, en **`import()` dynamique** → chunk séparé chargé au clic. Ne **jamais**
  le passer en import statique (ça le mettrait dans le bundle initial). Le build émet un
  warning « chunk > 500 kB » pour ce chunk → **attendu, pas une régression**.
- **Tests en environnement node** : le rendu se teste avec `renderToBuffer` (API node de
  react-pdf), donc le fichier de test porte `// @vitest-environment node` en 1ʳᵉ ligne
  (`ResultPdfDocument.test.tsx`). En jsdom ça ne marche pas.
- **`PDF_TYPE_COLORS` duplique `index.css`** : react-pdf ne peut pas lire les CSS vars
  `--type-1..6` → `pdfColors.ts` en redonne les 6 hex (thème clair). À garder en phase si on
  change une teinte. Idem, dans les primitives SVG de react-pdf, `fontSize` se met dans
  `style={{ fontSize }}` (pas en prop directe — limite des types).

**Référence** : `src/features/results/pdf/`, `src/components/ExportPdfButton.tsx`

## Questions : structure (data) vs texte (content) — séparés par public (2026-06-17)

**Comment ça marche** : depuis les questionnaires par public, les questions sont en **deux couches**.
- `src/data/questions.ts` → `QUESTION_STRUCTURE` : la **structure** (ids, `famille`, `kind`, `cibles`), testée (équilibrage 8×/1×). **Aucun texte.** C'est ce que lit le **scoring** (`scoring.ts`) et le `quizReducer` → indépendants du public.
- `src/content/questions/{adulte,enfant,etudiant}.ts` → un **calque de texte par public** (`Record<id, QuestionText>`). Les labels d'un forcé sont indexés **par cible** (`Partial<Record<TypeId,string>>`, seulement les 4 cibles de la question — l'unicité des cibles garantit zéro désalignement).
- `getQuestions(audience)` (`src/lib/questions.ts`) fusionne structure + calque → `Question[]` (avec texte) pour l'UI. Il **throw** si un label manque (calque incomplet).

**Pièges** :
- **Ajouter/retirer une question = toucher le squelette ET les 3 calques** (`adulte`, `enfant`, `etudiant`), sinon `src/content/questions/calques.test.ts` casse (il vérifie 36 questions complètes par public via `getQuestions`).
- Le **scoring n'a pas besoin du public** : ne pas le lui passer. Valider le moteur une fois suffit pour les 3 publics.
- Le **lien de partage `?r=`** n'encode pas le public (résultats identiques quel que soit le questionnaire d'origine) — voir le quirk partage.

**Référence** : `src/data/questions.ts`, `src/content/questions/`, `src/lib/questions.ts`, `src/content/questions/calques.test.ts`

## Workflow de génération de contenu : rate-limit ET limite de session (2026-06-17)

**Symptôme** : un Workflow « jury » avec **5 personas distinctes par question** (brouillon + 5 critiques parallèles + révision ≈ 7 agents/item × 72 ≈ **500 agents Opus effort-élevé**) a d'abord saturé le **rate-limit serveur** (« Server is temporarily limiting requests », ~1/72 produit, 6,2 M tokens), puis — en reprenant — la **limite de session** (« You've hit your session limit · resets 12am »), ~4/72.

**Cause** : trop d'appels Opus haute-intensité, en rafale (rate-limit serveur, ~concurrence 16) **et** en cumul (limite de session = total de tokens, indépendante de la rafale).

**Workaround** (ce qui a débloqué, cf. la session précédente aussi) :
- **Fusionner le jury** : 1 seul agent évalue les 5 angles → ~3 agents/item (~200 total), ~3× moins de tokens → tient dans la session. Qualité par agent préservée (Opus, effort élevé, 5 angles couverts).
- **Réduire la rafale** indépendamment via une concurrence maison (`mapLimit`) plutôt que le cap par défaut (16) — utile contre le **rate-limit serveur** (pas contre la limite de session).
- **`resumeFromRunId`** rejoue le cache disque (`agent-*.jsonl`) : éditer l'orchestration **sans changer les prompts** garde le cache valide (les brouillons ne re-tournent pas). **Jamais de reprise à zéro.**
- Le journal (`journal.jsonl`) stocke des **clés hachées, pas les labels** → ne pas s'y fier pour mesurer la progression ; le vrai compte vient de la valeur de retour (`byAudience`/`missing`).

**Référence** : `docs/superpowers/artifacts/2026-06-16-questions-publics.json`, `docs/superpowers/plans/2026-06-16-questionnaires-par-public.md` (Task 7)

## Id de type ≠ nom affiché (2026-06-16)

**Piège** : depuis le renommage aux standards à jour, les **ids internes** (`TypeId`) ne correspondent **plus** au nom montré à l'utilisateur :

| id (clé interne, partout dans le code/tests/contenu) | nom affiché (`TYPES[id].nom`) |
|---|---|
| `travaillomane` | **Analyseur** |
| `reveur` | **Imagineur** |
| `rebelle` | **Énergiseur** |

Les ids restent les anciens slugs car ils sont les **clés** du scoring, des `Record<TypeId, …>` de contenu (`descriptions.ts`, `stress.ts`, `canaux.ts`, `questions.ts`, etc.) et de **tous les tests**. Le nom affiché vit **uniquement** dans le champ `nom` de `src/data/types.ts`, source unique consommée dynamiquement par toute l'UI (`Synthese`, `RadarProfil`, `Immeuble`, `ResultsScreen`, `interactions.ts`).

**Conséquence** : pour renommer un type à l'écran, ne toucher **que** `nom` ; ne jamais renommer un id (cassure massive, sans bénéfice). À l'inverse, voir l'id `travaillomane` dans un test ou une clé n'est **pas** un oubli de renommage — c'est volontaire.

**Référence** : `src/data/types.ts` (`TypeId`, `TYPES[*].nom`)

## Likert : ordre d'affichage descendant ≠ value (2026-06-15)

**Piège** : dans `src/features/quiz/LikertScale.tsx`, le tableau `LIKERT_OPTIONS` est dans l'ordre d'**affichage** (descendant : « Tout à fait d'accord » en premier), mais chaque entrée porte une `value` string (`"5"` … `"1"`) qui est le **vrai niveau d'accord**. La position dans le tableau **n'est pas** la value. Le scoring (`(valeur - 1) / 4` dans `scoring.ts`) lit la value, pas l'index → inverser/réordonner les options à l'écran ne change **rien** au score. Si tu édites ce tableau, ne déduis jamais la value de l'index.

**Référence** : `src/features/quiz/LikertScale.tsx`, `src/lib/scoring.ts`

## Likert obligatoire : fallback `?? 3` de `scoring.ts` inatteignable (2026-06-15)

**Piège** : depuis que tout le quiz est obligatoire (gate `reponseManquante` dans `QuizScreen`), `computeResult` ne reçoit plus jamais de Likert non répondu — le fallback `valeur ?? 3` (neutre) y est **conservé par défense mais ne se déclenche plus en pratique**. Ne pas le supprimer en croyant à du code mort : il protège un appel hypothétique sur réponses partielles. Aucun test ne le couvre directement (il n'est plus atteignable par le flux normal).

**Référence** : `src/lib/scoring.ts` (`computeResult`), `src/features/quiz/QuizScreen.tsx`

## `SECTION_HINTS` : test sur les clés EXACTES (2026-06-14)

**Piège** : `src/content/sectionHints.test.ts` vérifie la liste **exacte** des clés (`toEqual([...])`), pas juste leur présence. Ajouter (ou retirer) une section dans `SECTION_HINTS` **casse ce test** tant qu'on n'a pas mis à jour le tableau attendu. Pense à éditer le test en même temps que l'objet.

**Référence** : `src/content/sectionHints.ts`, `src/content/sectionHints.test.ts`

## `@radix-ui/react-tabs` vs `radix-ui` (umbrella) (2026-06-14)

**Piège** : `src/components/ui/tabs.tsx` importe `from "radix-ui"` (le **package umbrella**, déjà en dépendance), pas `@radix-ui/react-tabs`. Inutile d'ajouter `@radix-ui/react-tabs` pour utiliser les onglets — ce serait une dépendance morte. Idem pour d'autres primitives shadcn déjà présentes.

**Référence** : `src/components/ui/tabs.tsx`, `package.json`

## Partage par URL : code = `socle` + `phase` uniquement, scores arrondis (2026-06-14)

**Comment ça marche** : le lien de partage encode dans `?r=<base64url>` un JSON `{ s, p }` où `s` = les 6 scores `socle` **arrondis à l'entier** (ordre `TYPE_IDS`) et `p` = l'index de la `phase`. `base` et `immeuble` ne sont **pas** stockés : ils sont redérivés de `socle` via `deriveFromSocle` (`src/lib/scoring.ts`), réutilisé par `decodeResult` (`src/lib/shareCode.ts`). `motivation` n'est pas dans le lien (jamais affiché).

**Pièges** :
- **Arrondi** : le profil partagé est rendu à partir des scores **arrondis**, pas des flottants d'origine. Dans le cas (très rare) où deux types sont à < 0,5 pt l'un de l'autre, l'ordre de l'immeuble ou la base affichés au destinataire peuvent différer de ce que voyait l'émetteur. Compromis assumé du format compact — ce n'est pas un bug.
- **Base path** : construire l'URL avec `import.meta.env.BASE_URL` (= `/process-gomme/`), sinon le lien casse en prod. Idem pour le nettoyage de l'URL au clic « Faire mon test » (`history.replaceState(..., BASE_URL)`).
- **Robustesse** : `decodeResult` valide strictement (taille 6, bornes 0–100, `p` ∈ 0–5, somme ≠ 0) et renvoie `null` sinon → un `?r=` corrompu est ignoré et l'app affiche l'intro.

**Référence** : `src/lib/shareCode.ts`, `src/lib/scoring.ts` (`deriveFromSocle`, `DisplayResult`), `src/components/ShareButton.tsx`, `src/App.tsx`, `e2e/share.spec.ts`.

---

## Deux jeux de définitions des concepts coexistent (2026-06-14)

**Piège** : les concepts base / phase / immeuble sont définis à **deux endroits** au contenu volontairement différent.

- `src/content/explainer.ts` (`EXPLAINER_SECTIONS`) — **glossaire autonome**, phrases préfixées « Ta base, c'est… », avec pastille de couleur. Affiché par `ProfilExplainer` sur l'**intro** et le **quiz**.
- `src/content/sectionHints.ts` (`SECTION_HINTS`) — **rappel contextuel court** (sans préfixe, car il suit le titre de section), + une 4ᵉ entrée `interactions` absente de l'explainer. Affiché dans les encadrés de `Synthese` (page **résultats**).

**Conséquence** : modifier la définition d'un concept dans l'un **n'affecte PAS** l'autre. Si tu changes le sens d'un concept, pense à répercuter dans les deux.

**Référence** : `src/content/explainer.ts`, `src/content/sectionHints.ts`, `src/features/results/Synthese.tsx`

## Vite `base` obligatoire pour GitHub Pages (2026-06-13)

**Symptôme** : en prod, les assets (JS/CSS) renvoient 404 et la page est blanche.

**Cause** : GitHub Pages sert le site sous `/<repo>/`, pas à la racine.

**Workaround** : `vite.config.ts` → `base: '/process-gomme/'`. Tout routing futur devra en tenir compte.

**Référence** : `vite.config.ts`

## TypeScript 6 déprécie `baseUrl` (2026-06-13)

**Symptôme** : `tsc -b` échoue avec `TS5101: Option 'baseUrl' is deprecated`.

**Cause** : TS 6 déprécie `baseUrl` seul.

**Workaround** : ne PAS mettre `baseUrl` ; garder uniquement `paths` (`@/*` → `./src/*`), qui fonctionne seul depuis TS 4.1. Pas de flag `ignoreDeprecations`.

**Référence** : `tsconfig.json`, `tsconfig.app.json`

## shadcn/ui + règle ESLint `react-refresh` (2026-06-13)

**Symptôme** : `pnpm lint` échoue sur `button.tsx`/`tabs.tsx` (`react-refresh/only-export-components`).

**Cause** : les composants shadcn exportent volontairement un composant ET ses variantes (`buttonVariants`) depuis le même fichier.

**Workaround** : override ESLint désactivant cette règle pour `src/components/ui/**`.

**Référence** : `eslint.config.js`

## Playwright e2e + animations Framer Motion (2026-06-13)

**Symptôme** : clic sur un radio/bouton échoue (« element is not stable » / « detached from the DOM »).

**Cause** : `AnimatePresence` anime le conteneur de la question (~250 ms) ; Playwright refuse de cliquer un élément en mouvement.

**Workaround** : dans le test e2e, `await page.waitForTimeout(350)` après confirmation du compteur de question, avant d'interagir. (Fix côté test uniquement, pas l'app.)

**Référence** : `e2e/smoke.spec.ts`

## `pnpm/action-setup` exige le champ `packageManager` (2026-06-13)

**Symptôme** : le job CI échoue à déterminer la version de pnpm.

**Cause** : `pnpm/action-setup@v4` lit la version dans `package.json` → `packageManager`.

**Workaround** : `"packageManager": "pnpm@10.28.1"` dans `package.json`.

**Référence** : `package.json`, `.github/workflows/deploy.yml`

## Avertissement « Node.js 20 deprecated » dans Actions (2026-06-13)

**Symptôme** : annotations jaunes sur chaque run CI.

**Cause** : les actions officielles (`checkout@v4`, etc.) embarquent un runtime Node 20, déprécié par GitHub (forçage Node 24 prévu le 2026-06-16).

**Workaround** : informatif, **rien à corriger** — ce sont déjà les dernières versions majeures. À surveiller si un job casse après la bascule.

**Référence** : `.github/workflows/deploy.yml`

## shadcn CLI 4.11 : preset par défaut `base-nova` (2026-06-13)

**Symptôme** : `style: "radix-nova"` dans `components.json`, police Geist + `tw-animate-css` + `shadcn` en dépendance runtime — pas le « new-york » historique.

**Cause** : refonte shadcn 4.x ; le défaut est `--preset base-nova`. « new-york » n'existe plus.

**Workaround** : choix assumé `--base radix` (Radix UI, mature) + preset nova (= thème par défaut). Conforme au brief « thème par défaut ».

**Référence** : `components.json`, `src/index.css`

## `max-md:hidden` (pas `hidden md:block`) pour masquer un volet flex en mobile (2026-06-14)

**Symptôme** : on veut masquer le volet droit du `SplitLayout` en mobile MAIS le garder en conteneur flex (`flex flex-col justify-center`) en desktop pour centrer son contenu.

**Cause** : `hidden md:block` force `display:block` à partir de `md`, ce qui **écrase** le `flex` du volet → plus de centrage vertical.

**Workaround** : utiliser `max-md:hidden` (masque sous `md`, laisse le `flex` intact à `md`+). Le test de `SplitLayout` vérifie donc `max-md:hidden`.

**Référence** : `src/components/SplitLayout.tsx`, `src/components/SplitLayout.test.tsx`

## Padding horizontal de la pyramide : desktop-only (2026-06-14)

**Symptôme** : `px-16` sur la pyramide (immeuble) « casse tout » en mobile (étages écrasés, illisibles).

**Cause** : en mobile la carte est étroite ; un gros padding horizontal sur des étages en largeur `%` les réduit à presque rien.

**Workaround** : `md:px-16` (padding seulement à partir de `md`). En mobile, la pyramide reste pleine largeur.

**Référence** : `src/features/results/Immeuble.tsx`

## Centrer / positionner en mobile : `min-h-svh` sur le volet (2026-06-14)

**Symptôme** : en mobile (layout empilé, pas `grid`), impossible de centrer verticalement la box d'intro ou de pousser la nav du quiz en bas de page — le contenu colle en haut.

**Cause** : hors `grid`, le volet gauche du `SplitLayout` fait juste la hauteur de son contenu, donc `justify-center`/`flex-1` n'ont rien à répartir.

**Workaround** : donner au volet gauche `min-h-svh` en mobile (`md:min-h-0` en desktop, où la grille `stretch` gère déjà la hauteur). Le `flex` interne peut alors centrer (`justify-center`) ou pousser le dernier enfant en bas (zone centrale en `flex-1`).

**Référence** : `src/components/SplitLayout.tsx`

## Tool `Workflow` (orchestration multi-agents) : pièges (2026-06-14)

**Contexte** : génération du contenu des questions à 4 options via un Workflow « jury ».

- **`args` n'arrive pas toujours comme tableau** : `const QS = args` a planté avec `pipeline() expects an array`. **Workaround** : **inliner les données dans le script** plutôt que de les passer via `args` (fiable à 100 %).
- **Agents `null` sous rate-limit** : quand le serveur limite (« not your usage limit »), `agent()` renvoie `null` après retries ; un script qui fait `opts.options` derrière plante toute la run. **Workaround** : rendre le script **résilient aux null** (garder le dernier état valide, `filter(Boolean)`) ET **réduire la rafale** (ici : fusionner les 5 juges parallèles en **1 agent** qui évalue les 5 angles → ~5× moins de requêtes simultanées).
- **Reprise** : après un échec, `Workflow({scriptPath, resumeFromRunId})` rejoue les `agent()` réussis depuis le **cache** (clé = prompt) et ne relance que les appels modifiés/nouveaux — précieux pour ne pas regénérer les brouillons coûteux.
- **`Workflow` = boucle principale uniquement** : ne pas l'imbriquer dans un sous-agent lancé via le tool Agent.

**Référence** : `docs/superpowers/plans/2026-06-14-questions-4-options.md`
