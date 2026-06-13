# process gomme

[![CI/CD](https://github.com/owlnext-fr/process-gomme/actions/workflows/deploy.yml/badge.svg)](https://github.com/owlnext-fr/process-gomme/actions/workflows/deploy.yml)
[![Pages](https://img.shields.io/github/deployments/owlnext-fr/process-gomme/github-pages?label=pages)](https://owlnext-fr.github.io/process-gomme/)
[![Last commit](https://img.shields.io/github/last-commit/owlnext-fr/process-gomme)](https://github.com/owlnext-fr/process-gomme/commits/main)

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?logo=shadcnui&logoColor=white&style=for-the-badge)

> Inventaire de personnalité (logique base / phase / immeuble). Projet privé, statique,
> contenus 100 % originaux. **[Démo →](https://owlnext-fr.github.io/process-gomme/)**

## Stack

Vite · React · TypeScript · Tailwind v4 · shadcn/ui · Recharts · Framer Motion.
100 % statique, aucun backend, état uniquement en mémoire navigateur.

## Installation (Linux)

Tout depuis zéro (nvm → Node 24 → pnpm → dépendances) :

```bash
# 1. Cloner le dépôt
git clone git@github.com:owlnext-fr/process-gomme.git
cd process-gomme

# 2. Installer nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
# Charger nvm dans le shell courant (sinon : ouvrir un nouveau terminal)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 3. Installer et activer la version de Node lue dans .nvmrc (Node 24)
nvm install
nvm use

# 4. Activer pnpm via corepack (la version est épinglée dans package.json)
corepack enable pnpm

# 5. Installer les dépendances et lancer le serveur de dev
pnpm install
pnpm dev
```

Les tests end-to-end utilisent Playwright. Installer le navigateur **une seule fois** :

```bash
pnpm exec playwright install chromium
```

## Scripts

```bash
pnpm dev            # serveur de dev
pnpm test           # tests unitaires (Vitest)
pnpm test:e2e       # tests end-to-end (Playwright)
pnpm build          # build de production
pnpm preview        # prévisualisation du build
pnpm lint           # ESLint
pnpm before_push    # tout vérifier avant de pousser (voir ci-dessous)
```

## Avant de pousser

Une seule commande à lancer avant chaque `git push`. Elle rejoue **exactement** ce que
la CI vérifie : si c'est vert en local, le push passera la CI.

```bash
pnpm before_push
```

Elle enchaîne, dans l'ordre, et s'arrête à la première erreur :

1. `pnpm lint` — ESLint (qualité + style du code)
2. `pnpm test` — tests unitaires (Vitest)
3. `pnpm build` — compilation TypeScript + build de production
4. `pnpm test:e2e` — parcours complet du test dans un vrai navigateur (Playwright)

> Si une étape échoue, corrige avant de pousser : un push qui casse la CI bloque le
> déploiement (rien n'est publié tant que tout n'est pas vert).

## Architecture

Séparation nette entre **données**, **logique pure**, **contenu textuel** et **UI**. La
logique de calcul ne dépend pas de React (donc testable en isolation) ; l'UI ne fait que
l'afficher.

```
src/
├── data/                 # contenu du test (Bloc 2)
│   ├── types.ts          # les 6 types (TypeId, TYPES)
│   └── questions.ts      # les 36 questions typées + invariants testés
├── lib/
│   └── scoring.ts        # moteur de scoring PUR (vecteurs base/phase, immeuble) — sans React
├── content/              # synthèses textuelles originales
│   ├── descriptions.ts   # 1 paragraphe base + 1 phase par type
│   └── interactions.ts   # template paramétré base × phase + intro immeuble
├── features/
│   ├── intro/            # écran d'accueil
│   ├── quiz/             # state machine (useReducer) + écran de quiz
│   │   ├── quizReducer.ts
│   │   ├── QuizScreen.tsx, ForcedChoice.tsx (RadioGroup), LikertScale.tsx (Slider)
│   └── results/          # écran de résultats (split vertical)
│       ├── Immeuble.tsx      # pyramide animée (largeur ∝ score, construction étage par étage)
│       ├── RadarProfil.tsx   # radar Recharts des 6 scores
│       ├── Synthese.tsx      # sections titrées (base/phase/immeuble/interactions)
│       └── ResultsScreen.tsx # assemblage + appel du moteur de scoring
├── components/ui/        # composants shadcn/ui
└── App.tsx               # routeur d'écrans (intro → quiz → résultats) via useReducer
```

**Flux** : `App.tsx` tient l'état (`useReducer`) et route entre les 3 écrans. Le quiz
accumule les réponses en mémoire ; à la fin, `computeResult()` (dans `lib/scoring.ts`)
produit les deux vecteurs de scores, la base, la phase et l'immeuble, que l'écran de
résultats affiche. Rien n'est persisté ni envoyé.

## Déploiement

Push sur `main` → GitHub Actions enchaîne `test → build → deploy`.
Rien n'est publié si un test échoue. Hébergé sur GitHub Pages.

## Pourquoi « process gomme » ?

Boutade assumée. Le modèle qui a inspiré la mécanique générale (base / phase / immeuble,
six types de perception) est familièrement appelé « Process Com ». « process gomme » en est
la déformation potache : on a gardé la **logique générale**, passé la **gomme** sur tout le
reste, et **réécrit 100 % du contenu** — types décrits, questions, synthèses. Aucun lien
officiel avec la marque, aucune reprise de matériel propriétaire : usage strictement privé.
