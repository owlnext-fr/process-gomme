# Backlog & idées

Choses identifiées comme "à faire un jour" mais pas prioritaires. Si tu trouves une amélioration en passant, note-la ici plutôt que de l'oublier ou de la coder maintenant.

Une fois faite, déplace-la en `INDEX.md` (livré) ou supprime-la (abandonnée).

---

## Performance / bundle

- [ ] Lazy-load Framer Motion (`motion`) si on veut alléger davantage le chargement initial (déjà fait pour Recharts).
- [ ] Évaluer le retrait de la police **Geist** (`@fontsource-variable/geist`, héritée du preset shadcn nova) pour gagner du poids et des requêtes.

## Visuel / UX

- [ ] Peaufiner l'accent ambré de l'étage « phase » de la pyramide et les couleurs du radar sur le thème shadcn neutre (cohérence visuelle).
- [ ] Écran d'intro : éventuellement ajouter une mini-explication illustrée de base/phase/immeuble.

## Qualité

- [ ] Audit complet de navigation clavier (tab order, focus visible) sur les 3 écrans.
- [ ] Envisager un test unitaire sur `composeInteraction` couvrant l'enchaînement grammatical de chaque clause dans les deux gabarits.
