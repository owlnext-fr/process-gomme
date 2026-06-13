# process gomme — instructions projet

Inventaire de personnalité statique (logique base / phase / immeuble, 6 types), 100 % en mémoire navigateur, déployé sur GitHub Pages. Stack : Vite + React + TypeScript + Tailwind v4 + shadcn/ui + Recharts + Framer Motion. Commits **gitmoji directs sur `main`**. Lancer **`pnpm before_push`** avant tout push.

**Contrainte transverse** : tout le contenu textuel (descriptions, questions, synthèses) est **100 % original** — jamais de reformulation/copie de matériel propriétaire.

## Mémoire projet — où chercher quoi

Le projet maintient une base de connaissances opérationnelle sous `docs/`. **En début de session, scanner ces fichiers pour se resituer** :

- **`docs/HANDOFF.md`** — état courant, dernière chose faite, trucs à savoir tout de suite. **À lire en premier.**
- **`docs/INDEX.md`** — catalogue des features livrées avec liens vers spec/plan.
- **`docs/ENVIRONMENT.md`** — paths, services, env vars, accès. À consulter avant de lancer toute commande non-triviale.

À consulter au cas par cas :
- **`docs/QUIRKS.md`** — pièges et comportements non-évidents.
- **`docs/BACKLOG.md`** — idées et améliorations identifiées mais non urgentes.
- **`docs/CONVENTIONS.md`** — skeletons de code et règles tacites.
- **`docs/superpowers/specs/`** — design docs détaillés par feature.
- **`docs/superpowers/plans/`** — plans d'implémentation détaillés par feature.

### À mettre à jour DURANT la session (decision tree — une question = un fichier)

| Tu découvres ou décides… | Fichier |
|---|---|
| Une règle qui s'applique TOUJOURS au projet | `CLAUDE.md` |
| Un squelette de code récurrent | `docs/CONVENTIONS.md` |
| Une feature livrée | ajouter une ligne dans `docs/INDEX.md` + spec/plan dans `docs/superpowers/` si non-trivial |
| Où vit un container, un path, un port, un accès | `docs/ENVIRONMENT.md` |
| Un comportement non-évident, un piège | `docs/QUIRKS.md` (ajouter dès la découverte, pas plus tard) |
| Une idée future / nice-to-have | `docs/BACKLOG.md` |
| L'état mental d'une session significative | `docs/HANDOFF.md` (en fin de session) |

### Règle de fin d'implémentation (NON-NÉGOCIABLE)

À la fin de toute implémentation significative (feature livrée, refactor majeur, bug fix non-trivial, nouvelle commande/script), **avant de signaler la fin du travail**, tu DOIS :

1. **Mettre à jour `docs/INDEX.md`** — ajouter une ligne dans la table correspondante (feature, commande, etc.).
2. **Mettre à jour `docs/HANDOFF.md`** — ajouter une entrée datée en haut (sous le titre H1) avec : `Dernière chose faite`, `Trucs en suspens`, `Prochaine chose à creuser`, `Notes pour future Claude`.
3. **Mettre à jour `docs/QUIRKS.md`** si tu as découvert un piège non-évident pendant l'implémentation.
4. **Mettre à jour `docs/BACKLOG.md`** si tu as identifié des améliorations futures que tu n'as pas implémentées.
5. **Mettre à jour `docs/CONVENTIONS.md`** si tu as introduit un nouveau pattern qui doit être reproduit.
6. **Mettre à jour `docs/ENVIRONMENT.md`** si tu as ajouté/découvert un service, path, port, env var.
7. **Mettre à jour `CLAUDE.md`** si tu as établi une règle qui s'applique toujours au projet.

Ces mises à jour font partie de la définition de "terminé". Une feature livrée sans mise à jour de la mémoire est une feature à moitié livrée.
