# Handoff — état courant du projet

Notes informelles à destination de la prochaine session (humaine ou Claude). Format libre, chronologique inverse (le plus récent en haut).

**À mettre à jour à la fin d'une session significative**. Pas besoin de noter chaque petit truc — l'idée est de te resituer en 30 secondes en début de session.

---

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
