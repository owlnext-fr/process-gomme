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

## Développement

Pré-requis : Node 24 (`nvm use`), pnpm 10.

```bash
pnpm install        # dépendances
pnpm dev            # serveur de dev
pnpm test           # tests unitaires (Vitest)
pnpm test:e2e       # tests end-to-end (Playwright)
pnpm build          # build de production
pnpm preview        # prévisualisation du build
```

## Déploiement

Push sur `main` → GitHub Actions enchaîne `test → build → deploy`.
Rien n'est publié si un test échoue. Hébergé sur GitHub Pages.
