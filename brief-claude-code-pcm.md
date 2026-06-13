# Brief Claude Code — Inventaire de personnalité (logique PCM)

Projet **privé**, statique, à développer en local puis déployer sur GitHub Pages.
Exécuter les blocs **dans l'ordre**. Ne pas passer au bloc suivant sans validation.

---

## Contrainte transverse (à respecter dans tous les blocs)

Le modèle s'inspire de la logique générale base / phase / immeuble et de 6 types de
personnalité. Le matériel officiel (libellés exacts des types, fiches descriptives,
canaux de communication, besoins psychologiques, séquences de stress, items d'inventaire
validés) est **propriétaire**. Rédiger des **contenus originaux inspirés de la logique
générale**, jamais une reformulation ou un copier-coller d'un inventaire existant.
Usage strictement privé.

Stack imposée : **Vite + React + TypeScript + Tailwind + shadcn/ui + Recharts + Framer Motion**.
Thème shadcn par défaut. 100 % statique, aucun backend,
aucune donnée envoyée : tout le state reste en mémoire navigateur (useState/useReducer).

---

## BLOC 1 — Setup repo + déploiement GitHub Pages

Objectif : un squelette qui build et se déploie, avant tout contenu.

- Init projet Vite (React + TS), Tailwind, shadcn/ui.
- Garder le thème shadcn par défaut.
- Composants shadcn à installer : Card, Progress, RadioGroup, Slider, Button, Tabs, Accordion.
- `vite.config.ts` : **`base: '/<nom-du-repo>/'`** (sinon les assets cassent sur GH Pages).
- Workflow GitHub Actions : build sur push `main` → déploiement sur `gh-pages`.
- Vérifier que `npm run build` passe et qu'une page « Hello » s'affiche en prod.

Point à arbitrer avec moi (Adrien) : repo public = code du test visible (les réponses
restent privées en mémoire navigateur). Test lui-même privé = repo privé (nécessite plan
compatible Pages sur repo privé). À trancher avant de push.

**STOP. Valider le déploiement avant le bloc 2.**

---

## BLOC 2 — Conception des 36 questions (ULTRATHINK)

> Lancer ce bloc en **ultrathink**. La qualité du raisonnement combinatoire prime ici.

Objectif : produire le contenu du test, pas encore l'UI.

Exigences :

- **36 items**, répartis en deux familles obligatoires :
  - ~18 items **socle (base)** : perceptions, traits stables, manière de filtrer le monde.
  - ~18 items **motivation (phase)** : besoins actuels, sources d'énergie et de stress du moment.
- **Format mixte** dans chaque famille :
  - majorité en **choix forcé** (option A → type X, option B → type Y), pour capter les
    préférences relatives ;
  - quelques **Likert 1-5** sur affirmations ciblées, pour départager les ex æquo et
    nuancer l'intensité.
- **Équilibrage par type** : viser une couverture homogène des 6 types sur chaque famille
  (idéalement chaque type est « cible » un nombre comparable de fois en base et en phase).
  **Justifier explicitement l'équilibrage** (tableau type × famille × nombre d'items).
- Chaque item porte deux métadonnées : `famille` (`base` | `phase`) et `cible`
  (un type, ou deux types opposés pour un choix forcé).
- Pour les choix forcés, **opposer des types réellement discriminants**, pas deux types
  proches qui ne séparent rien.

Livrable du bloc : un fichier `questions.ts` typé (types `Question`, `ForcedChoice`,
`Likert`) + le tableau de justification de l'équilibrage.

**STOP. Relire les questions avec moi avant le bloc 3.**

---

## BLOC 3 — Implémentation quiz + scoring + synthèse

Objectif : assembler l'app à partir du contenu validé.

### Flux (3 écrans)
intro → quiz paginé → résultats.

### Quiz
- Pagination fluide (Framer Motion : transition entre questions).
- `Progress` shadcn pour l'avancement.
- `RadioGroup` pour les choix forcés, `Slider` pour les Likert.

### Moteur de scoring
- Deux vecteurs de 6 scores : **vecteur socle** (items base) et **vecteur motivation**
  (items phase), normalisés en %.
- **Base** = type dominant du vecteur socle.
- **Phase** = type dominant du vecteur motivation.
- **Immeuble** = classement décroissant des 6 types (sur le vecteur socle = structure stable).
- **Gérer explicitement le cas base = phase** (situation normale, pas un bug) : l'UI ne
  doit pas casser ni afficher d'incohérence.

### Affichage des résultats
- **Immeuble / pyramide** : 6 étages empilés, base en bas, hauteur ou opacité ∝ score ;
  **phase mise en évidence** (bordure/accent visuel). Animation de construction étage par
  étage au reveal (le moment « signature » du parcours — soigner celui-ci, garder le reste sobre).
- **Radar ou barres** (Recharts) des 6 scores pour la lecture analytique.

### Synthèse texte (descriptions ORIGINALES — cf. contrainte transverse)
- Paragraphe sur la base, paragraphe sur la phase.
- **Interactions base × phase** : utiliser un **template paramétré** qui compose
  base + phase + texte de transition (préféré aux 36 paragraphes en dur, plus maintenable).
- Tabs ou Accordion shadcn pour organiser base / phase / immeuble / interactions.

### Qualité plancher
Responsive mobile, focus clavier visible, `prefers-reduced-motion` respecté.

---

## Réserves à garder en tête (transmises par Adrien)

- [Inférence] Le mapping question→type et la sémantique fine base/phase sont la principale
  source d'imprécision. Si une source PCM fiable est disponible au moment de rédiger les
  items, l'utiliser pour calibrer (sans copier le matériel propriétaire).
- [Non vérifié] Vérifier les options d'hébergement GH Pages sur repo privé selon le plan
  GitHub avant de décider public/privé.
