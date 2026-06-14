# Handoff — état courant du projet

Notes informelles à destination de la prochaine session (humaine ou Claude). Format libre, chronologique inverse (le plus récent en haut).

**À mettre à jour à la fin d'une session significative**. Pas besoin de noter chaque petit truc — l'idée est de te resituer en 30 secondes en début de session.

---

## 2026-06-14 — Énergie par étage dans l'immeuble

### Dernière chose faite
- Nouveau module `src/content/energie.ts` : `ENERGIE: Record<TypeId, string>` — une phrase courte (~30-40 mots) par type décrivant la ressource mobilisable à cet étage de l'immeuble, ancrée sur `essenceBase` (types.ts), avec une nuance générique du coût d'énergie (haut = spontané ; bas = mobilisable mais plus coûteux). Prose 100 % originale, voix de `descriptions.ts` (tutoiement, bienveillant). Chaque phrase commence par « tu y… » pour s'enchaîner après le préfixe « Nom — X% — ».
- `Synthese.tsx` : import de `ENERGIE` ; la liste « Ton immeuble » affiche désormais `Nom — X%` (en `font-medium text-foreground`) suivi de `— <ENERGIE[t]>`. `<ol>` passé en `flex flex-col gap-1.5`.
- TDD : `src/content/energie.test.ts` (6 clés == TYPE_IDS, longueur > 20). Suite complète verte (18 fichiers, 53 tests) + `pnpm build` OK. Commit `b47759d`.

### Trucs en suspens
- **Pas encore poussé** (seul le commit local est fait).

### Prochaine chose à creuser
- Rien d'identifié.

### Notes pour future Claude
- Les phrases de `energie.ts` restent volontairement **génériques sur le rang** (« haut/bas », « en haut/plus bas ») pour fonctionner à n'importe quelle position dans l'immeuble. Si on veut une formulation indexée sur le rang réel, c'est un autre design (table par rang plutôt que par type).

## 2026-06-14 — Partage de la page de résultats par URL

### Dernière chose faite
- **Partage de profil** : nouveau bouton `ShareButton` (`src/components/ShareButton.tsx`) dans le header des résultats. Au clic → copie une URL `?r=<base64url>` (encode `socle`+`phase`, `src/lib/shareCode.ts`) dans le presse-papier + feedback « Lien copié » (région `aria-live` dédiée). Ouvrir un tel lien → `App` lit `?r=` une fois au montage (`readSharedFromLocation`, lazy `useState`) et rend la page en **mode partagé** : bandeau « profil partagé » + bouton « Faire mon test » (nettoie l'URL via `replaceState(BASE_URL)`), « Recommencer » masqué.
- **Refactor** : `ResultsScreen`/`Synthese` prennent désormais un `DisplayResult = Omit<ScoreResult,"motivation">` ; `App` calcule/décode le résultat et le passe (séparation source/affichage). Tri `socle → {base, immeuble}` extrait dans `deriveFromSocle` (`scoring.ts`), réutilisé par `computeResult` ET `decodeResult` (zéro duplication).
- **Tests** : `shareCode.test.ts` (round-trip + rejets), `ShareButton.test.tsx` (clipboard + erreur), `App.test.tsx` (`?r=` valide/invalide), **e2e `share.spec.ts`** (copie réelle → réouverture du lien → même profil → nettoyage URL). Gate `pnpm before_push` **vert** (50 unit + 2 e2e). Zéro dépendance ajoutée.
- Exécuté en **subagent-driven** (6 tâches, implémenteur + revue spec + revue qualité chacune). Quelques retouches issues des revues : garde « socle tout à zéro » dans `decodeResult`, région `aria-live` dédiée + test du chemin d'erreur du `ShareButton`, `searchParams.set`.

### Trucs en suspens
- **Pas encore poussé** au moment d'écrire ces lignes (juste avant `git push` final).
- Gaps de tests mineurs identifiés en revue mais jugés non nécessaires : pas de test du reset à 2 s du `ShareButton`, pas de cas `base === phase` au round-trip (logique triviale ; l'e2e couvre le flux réel).

### Prochaine chose à creuser
- Rien d'identifié. Idée future possible : aperçu Open Graph / image de partage (non fait, YAGNI — voir BACKLOG si on veut le tracer).

### Notes pour future Claude
- Le lien encode les **scores arrondis** : le profil partagé peut très marginalement différer de l'original si deux types sont à < 0,5 pt (voir `QUIRKS.md`). Compromis assumé.
- Toujours construire/nettoyer l'URL avec `import.meta.env.BASE_URL` (base path GH Pages).
- Spec : `docs/superpowers/specs/2026-06-14-partage-resultats-url-design.md` · Plan : `docs/superpowers/plans/2026-06-14-partage-resultats-url.md`.

## 2026-06-14 — Encadrés explicatifs des concepts dans la synthèse

### Dernière chose faite
- Sur la page résultats, chaque section de `Synthese` (`src/features/results/Synthese.tsx`) a maintenant un **encadré d'en-tête** sur fond clair (`bg-indigo-50`, bordure `indigo-200`) : **icône lucide** (`text-primary`) + **titre `<h2>` en `text-primary`** + **une phrase d'explication** du concept. Le paragraphe perso suit dessous, inchangé. 4 sections couvertes : base (Anchor), phase (Compass), immeuble (Building2), interactions (ArrowLeftRight).
- Le titre de section a été **absorbé dans l'encadré** (plus de `<h2>` séparé) → pas de doublon, un seul niveau de titre.
- Contenu des 4 phrases dans **nouveau** `src/content/sectionHints.ts` (`SECTION_HINTS`), testé. `explainer.ts` / intro / quiz **intacts**.
- Tests ajoutés : `sectionHints.test.ts` (4 clés non vides) + `Synthese.test.tsx` (les 4 phrases s'affichent). Gate `pnpm before_push` **vert** (lint+unit+build+e2e).

### Trucs en suspens
- **Pas encore poussé** au moment d'écrire ces lignes — `git push` est la dernière étape du plan.
- Phrases de `sectionHints.ts` retouchables si besoin (formulations validées en brainstorming mais perfectibles).

### Prochaine chose à creuser
- Rien d'identifié. Vérifier le rendu réel sur la page de résultats (le visuel des 4 encadrés) si l'occasion se présente.

### Notes pour future Claude
- Deux jeux de définitions des concepts coexistent volontairement (`explainer.ts` vs `sectionHints.ts`) — voir `QUIRKS.md`. Modifier l'un ne touche pas l'autre.
- Spec : `docs/superpowers/specs/2026-06-14-encadres-explicatifs-synthese-design.md` · Plan : `docs/superpowers/plans/2026-06-14-encadres-explicatifs-synthese.md`.

## 2026-06-14 — Ordre aléatoire des options à l'affichage

- Dernier item du backlog : l'ordre des 4 options d'une question forcée est désormais **mélangé** (anti-biais de position). `shuffledIndices` (Fisher-Yates, `src/lib/shuffle.ts`, rng injectable + testé) ; `QuizScreen` calcule un ordre **stable par session** via `useMemo` (pas de re-mélange en revenant en arrière). Purement cosmétique : le scoring se base sur le type choisi, pas la position. Gate vert, poussé + déployé.

## 2026-06-14 — Harmonisation de la forme des options (anti-biais)

### Dernière chose faite
- Adrien a remarqué que les 2 options « ajoutées » sonnaient différemment des 2 d'origine → **biais d'orientation** (la forme pouvait pousser un choix). Passe d'**harmonisation** : les 4 options de chaque question forcée réécrites pour être **parallèles en forme** (longueur, structure, registre, énergie, symétrie de justification). Cibles/équilibrage **inchangés**. Gate complet **vert**, commit `85e92f7`, poussé + déployé.
- Méthode : Workflow **jury de 5 personas** (Le métricien, Le styliste, L'ado cash, Le conformiste prudent, Le lecteur pressé) jugeant la **forme à l'aveugle des types** → réécriture si ≥2 jurés signalent un déséquilibre.
- **2 régressions corrigées à la main avant intégration** (l'auto-réécriture les avait introduites) : double « je » (prompts base finissent par « je… ») et accents perdus sur ~6 questions. Puis revue finale (7,5/10) → 4 retouches ciblées (fidélité perseverant b-fc-01, longueurs p-fc-03 / b-fc-07, justification b-fc-03).

### Trucs en suspens
- Le **rate-limit serveur** a encore frappé le Workflow (jury 5 personas = grosse rafale) ; la résilience + `resumeFromRunId` ont sauvé le coup, mais le 2e tour de re-validation (r1) n'a pas pu finir partout. La revue finale consolidée (1 agent) a comblé.

### Prochaine chose à creuser
- Si on relance un gros Workflow : **fusionner le jury** (1 agent multi-angles) pour éviter le rate-limit, ou batcher base/phase. Voir QUIRKS.
- Backlog inchangé (shuffle ordre des options, etc.).

### Notes pour future Claude
- Règle ajoutée dans CONVENTIONS : **options non-orientantes** (forme parallèle) + **grammaire de continuation** (base = verbe sans « je » en tête ; phase = infinitif). À respecter si on régénère du contenu.
- Provenance brute de l'harmonisation : `docs/superpowers/artifacts/2026-06-14-forced-4opts.json` (le `questions.ts` final porte en plus les 4 retouches manuelles).

## 2026-06-14 — Questions à 4 options (choix forcés)

### Dernière chose faite
- Les **24 questions à choix forcé** (12 base + 12 phase) passent de **2 → 4 options**. Likert (6/famille) et moteur de scoring **inchangés**. Gate `before_push` **vert**.
- **Équilibrage** : chaque type est cible **8× en forcé** (+1 Likert) par famille. Assignation déterministe figée dans le plan ; invariant testé mis à jour (4 options, types distincts, 8×).
- **Contenu** (96 options, 100 % original) produit via le tool **Workflow** : 1er run = brouillon → jury 5 angles → correction (jury fusionné après un crash rate-limit, voir QUIRKS) ; 2e run = **passe de dédoublonnage/cohérence** par famille (le jury avait relevé des répétitions de tournures + p-fc-05 trop long). Provenance : `docs/superpowers/artifacts/2026-06-14-forced-4opts.json`.

### Trucs en suspens
- Rien de bloquant. Commits sur `main`, **non poussés** (à `git push` quand tu veux → déploie).
- Le code change est minime (type `options` en 4-uplet) ; `ForcedChoice` mappait déjà les options, `scoring` fait déjà `+1 au choix`.

### Prochaine chose à creuser
- Backlog : mélange aléatoire de l'ordre des 4 options (anti-biais de position).
- Relire à l'œil quelques libellés en contexte (lecture humaine) — le jury a validé, mais un dernier regard ne nuit pas.

### Notes pour future Claude
- **Workflow + jury** : `Workflow` s'invoque depuis la boucle principale (pas un sous-agent). Pièges rencontrés cette session, voir QUIRKS : `args` n'arrive PAS toujours comme tableau (inliner les données dans le script), agents `null` sous rate-limit (rendre le script résilient + réduire la rafale en fusionnant le jury), reprise via `resumeFromRunId` pour réutiliser le cache.

## 2026-06-14 — Corrections UX mobile (intro + quiz)

- **Intro mobile** : panneau d'explications masqué (`hideRightOnMobile` sur l'intro), box principale (titre + note + bouton) centrée sur la page (`max-md:items-center max-md:text-center`).
- **Quiz mobile** : nav (Précédent/Suivant) poussée en bas de page (avant elle collait sous les réponses).
- Mécanisme commun : `SplitLayout` donne au volet gauche `min-h-svh` en mobile (`md:min-h-0` en desktop) → le `flex` interne peut centrer (intro) ou pousser la nav en bas (quiz). Gate `before_push` vert. Commit `c9dd3c9`.

## 2026-06-14 — Refonte UX (layouts pleine page + page résultats + thème indigo)

### Dernière chose faite
- Refonte UX complète livrée en subagent-driven (12 tâches), `pnpm before_push` **vert** (36 tests unitaires + 1 e2e).
- **Layouts pleine page** : nouveau `SplitLayout` (1/3-2/3, plus de `max-w`/marges) utilisé par intro + quiz ; volet 2/3 droit en **indigo** (`bg-primary`, aligné sur les boutons), panneau d'explications `ProfilExplainer` (statique, contenu original base/phase/immeuble) **centré** et cadré (`max-w-lg`), fond indigo clair.
- **Quiz** : panneau d'explications **desktop-only** (`hideRightOnMobile` → `max-md:hidden`) ; mobile = colonne simple.
- **Couleur** : thème indigo via tokens (`src/index.css`) + **`TYPE_COLORS`** (source unique, `--type-1..6`) → pyramide (étages colorés), radar (sommets colorés), pastilles du panneau. Icônes lucide sur **tous** les boutons.
- **Page résultats (layout C, pleine page)** : en-tête titre « Tes résultats » + reset ↺ en haut à droite, bandeau base·phase (indigo clair), colonne sticky gauche (pyramide + radar) en **cartes titrées avec explications**, synthèse en carte. Radar agrandi (`h-80`, rayon 80 %). Pyramide resserrée en desktop (`md:px-16`, **pas** de padding en mobile sinon ça casse).

### Trucs en suspens
- Rien de bloquant. Tout est commité sur `main`, gate vert. (Pas encore poussé — à `git push` quand tu veux.)

### Prochaine chose à creuser
- Vérif visuelle mobile fine (le quiz mobile = colonne simple ; la pyramide mobile sans padding).
- Le thème reste « clair » uniquement (le `.dark` est recoloré mais non exposé).

### Notes pour future Claude
- Beaucoup d'ajustements visuels ont été décidés **en live sur capture d'écran** avec Adrien (full-page, teinte du volet, centrage, padding pyramide). Le spec et le plan portent une section « Ajustements live (2026-06-14) » qui **prime** sur le code initial des Tasks 4/5/10.
- Règle confirmée : **toute couleur de type passe par `TYPE_COLORS`** (jamais en dur). **Tout bouton porte une icône lucide** (`size-4`, `aria-hidden`).
- Serveur dev lancé pendant la session (port 5174) ; artefacts de capture (`.playwright-mcp/`, `*.png`) gitignorés.

## 2026-06-13 — Bootstrap mémoire projet + fin des 3 blocs

### Dernière chose faite
- Mise en place du système de mémoire persistante sous `docs/` (HANDOFF, INDEX, ENVIRONMENT, QUIRKS, BACKLOG, CONVENTIONS) + bloc « Mémoire projet » dans `CLAUDE.md` + hook `SessionStart` (`.claude/hooks/load-memory.sh`).
- Juste avant : lazy-load de Recharts (radar) → bundle initial 672 kB → **411 kB** (sous le seuil 500 kB), Recharts dans un chunk séparé chargé à l'écran de résultats.
- Ajout du script `pnpm before_push` (lint + test + build + test:e2e = gate CI complet) + doc README.

### État du projet
- **Les 3 blocs du brief sont livrés et déployés** : Bloc 1 (setup + CI/CD GH Pages), Bloc 2 (6 types + 36 questions équilibrées), Bloc 3 (quiz + scoring + synthèse). Démo : https://owlnext-fr.github.io/process-gomme/
- CI verte, 29 tests unitaires + 1 e2e (parcours complet), tout passe via `pnpm before_push`.

### Trucs en suspens
- Rien de bloquant. Le projet est fonctionnellement complet.

### Prochaine chose à creuser
- Si on veut alléger encore : lazy-load Framer Motion, ou retirer la police Geist (preset shadcn nova). Voir `BACKLOG.md`.
- Peaufinage visuel possible : accent ambré de la pyramide + couleurs du radar sur le thème neutre.

### Notes pour future Claude
- Workflow du projet : chaque « bloc » a suivi brainstorm → spec (`docs/superpowers/specs/`) → plan (`docs/superpowers/plans/`) → exécution subagent-driven avec double-revue.
- **Contrainte transverse forte** : tout le contenu textuel (types, questions, synthèses) est **100 % original**. Les noms officiels des 6 types sont repris en façade (décision Adrien) mais aucune fiche/inventaire propriétaire n'est copié. Garder ça si on touche au contenu.
- Commits **gitmoji directs sur `main`** (petit projet, pas de PR). Lancer `pnpm before_push` avant de pousser.
