# Registre des features livrées

Catalogue chronologique de ce qui a été construit. Pour chaque entrée : spec (le quoi/pourquoi), plan (le comment), statut. Une ligne par feature.

Voir aussi : `ENVIRONMENT.md` · `QUIRKS.md` · `BACKLOG.md` · `HANDOFF.md` · `superpowers/specs/` · `superpowers/plans/`

---

## Features

| Feature | Date | Spec | Plan | Statut | Notes |
|---|---|---|---|---|---|
| Bloc 1 — Setup repo + déploiement GH Pages | 2026-06-13 | [spec](superpowers/specs/2026-06-13-bloc1-setup-deploiement-design.md) | [plan](superpowers/plans/2026-06-13-bloc1-setup-deploiement.md) | ✅ Livré | Vite+React+TS+Tailwind v4+shadcn ; workflow CI/CD `test→build→deploy` ; badges README |
| Bloc 2 — 6 types + 36 questions | 2026-06-13 | [spec](superpowers/specs/2026-06-13-bloc2-conception-questions-design.md) | [plan](superpowers/plans/2026-06-13-bloc2-conception-questions.md) | ✅ Livré | Équilibrage 5×/type/famille (graphe d'appariement 4-régulier), tests d'invariants ; contenu original |
| Bloc 3 — Quiz + scoring + synthèse | 2026-06-13 | [spec](superpowers/specs/2026-06-13-bloc3-quiz-scoring-synthese-design.md) | [plan](superpowers/plans/2026-06-13-bloc3-quiz-scoring-synthese.md) | ✅ Livré | Scoring pur testé, immeuble animé (pyramide), radar Recharts, synthèses originales étoffées |
| Lazy-load Recharts (radar) | 2026-06-13 | — | — | ✅ Livré | Bundle initial 672→411 kB ; Recharts en chunk séparé (`ResultsScreen.tsx`) |
| Système de mémoire projet | 2026-06-13 | — | — | ✅ Livré | `docs/` (HANDOFF/INDEX/ENVIRONMENT/QUIRKS/BACKLOG/CONVENTIONS) + bloc mémoire `CLAUDE.md` + hook `SessionStart` (`.claude/hooks/load-memory.sh`) |
| Refonte UX — layouts pleine page 1/3-2/3 + page résultats C + thème indigo | 2026-06-14 | [spec](superpowers/specs/2026-06-13-refonte-ux-layouts-couleurs-design.md) | [plan](superpowers/plans/2026-06-13-refonte-ux-layouts-couleurs.md) | ✅ Livré | `SplitLayout` + `ProfilExplainer` ; volet 2/3 indigo (`bg-primary`) ; `TYPE_COLORS` (radar+pyramide+pastilles) ; icônes lucide sur tous les boutons ; résultats en cartes (titres+explications) ; pleine page |
| Corrections UX mobile (intro + quiz) | 2026-06-14 | — | — | ✅ Livré | Intro mobile : panneau d'explications masqué + box centrée sur la page ; quiz mobile : nav (Précédent/Suivant) poussée en bas de page. Via `SplitLayout` volet gauche `min-h-svh` (`md:min-h-0`). Commit `c9dd3c9` |
| Questions à 4 options (choix forcés) | 2026-06-14 | [spec](superpowers/specs/2026-06-14-questions-4-options-design.md) | [plan](superpowers/plans/2026-06-14-questions-4-options.md) | ✅ Livré | Forcés 2→4 options, équilibré 8×/type/famille ; Likert & scoring inchangés ; contenu original via Workflow jury (5 angles + cohérence). Provenance : `docs/superpowers/artifacts/2026-06-14-forced-4opts.json` |

## Commandes / scripts utilitaires

| Commande | Date | Cible |
|---|---|---|
| `pnpm before_push` | 2026-06-13 | Gate CI complet en local : `lint && test && build && test:e2e` |
