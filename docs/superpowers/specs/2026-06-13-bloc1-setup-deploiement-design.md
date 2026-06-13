# Bloc 1 — Setup repo + déploiement GitHub Pages

> Design validé le 2026-06-13. Scope : **uniquement le Bloc 1** du brief
> (`brief-claude-code-pcm.md`). Les blocs 2 (questions) et 3 (quiz/scoring) feront
> l'objet de specs séparées, conformément aux STOP gates du brief.

## Objectif

Un squelette qui **build**, est **testé** (unit + e2e), et se **déploie automatiquement**
sur GitHub Pages via les Actions officielles. Aucun contenu métier à ce stade : une page
« Hello » prouve que la chaîne complète (build → test → deploy → assets servis avec le bon
`base`) fonctionne en production avant d'investir dans le contenu.

## Contexte

- Repo : `git@github.com:owlnext-fr/process-gomme.git` (org **owlnext-fr**, **public**).
- URL Pages cible : `https://owlnext-fr.github.io/process-gomme/`.
- Machine : Node 24 (LTS Krypton) actif, pnpm 10 disponible.

## Décisions actées (brainstorming)

| Sujet | Décision | Raison |
|-------|----------|--------|
| Mécanisme de déploiement | **Source « GitHub Actions » moderne** (`actions/upload-pages-artifact` + `actions/deploy-pages`) | Un seul workflow lisible, zéro branche `gh-pages` parasite, gating natif |
| Périmètre du gate CI | **Gate complet** : lint + unit (Vitest) + e2e (Playwright) avant build/deploy | Le parcours utilisateur EST le produit ; le e2e attrape les régressions qui comptent |
| Version Tailwind | **v4** (CSS-first, `@tailwindcss/vite`) | Défaut actuel du CLI shadcn, stack moderne cohérente |
| Gestionnaire de paquets | **pnpm 10** + Node 24 épinglé via `.nvmrc` | Demande utilisateur |
| Convention de commits | **gitmoji**, directement sur `main` | Demande utilisateur (petit projet) |

## Stack & versions

- **Node 24** (LTS Krypton) épinglé via `.nvmrc`, **pnpm 10**.
- **Vite + React + TypeScript** (template `react-ts`).
- **Tailwind v4** (CSS-first, plugin `@tailwindcss/vite`).
- **shadcn/ui** (thème par défaut) + composants pré-installés :
  `Card, Progress, RadioGroup, Slider, Button, Tabs, Accordion`.
- **Vitest + React Testing Library** (unit), **Playwright** (e2e).

## Structure (à la racine du repo)

```
.nvmrc                       # 24
vite.config.ts               # base: '/process-gomme/' + plugins react & tailwind
playwright.config.ts         # webServer = preview du build
src/
  main.tsx
  App.tsx                    # page Hello (placeholder de ce bloc)
  index.css                  # @import tailwind + @theme par défaut shadcn
  components/ui/             # composants shadcn installés
  App.test.tsx               # test smoke unit (Vitest + RTL)
e2e/
  smoke.spec.ts              # parcours Playwright : la page Hello s'affiche
.github/workflows/deploy.yml # test → build → deploy
README.md                    # badges dynamiques + présentation
```

## Point critique — `base`

`vite.config.ts` → `base: '/process-gomme/'`. Sans ça, les assets cassent sur
`owlnext-fr.github.io/process-gomme/`. Pour le Bloc 1 c'est une page unique (pas de routing).
Tout routing futur devra tenir compte de ce base path.

## Workflow CI/CD (`.github/workflows/deploy.yml`)

Un seul fichier, déclenché sur push `main`, gating par dépendances de jobs :

- **job `test`** : checkout → setup pnpm + Node 24 → `pnpm install` →
  `pnpm lint` → `pnpm test` (Vitest run) → `pnpm test:e2e` (Playwright sur build preview).
- **job `build`** : `needs: test` → `pnpm build` → `actions/upload-pages-artifact` (`dist/`).
- **job `deploy`** : `needs: build` → `actions/deploy-pages` (environnement `github-pages`).

Permissions : `pages: write`, `id-token: write`, `contents: read`.
Concurrency group `pages` (un déploiement à la fois).
**Rien n'est publié si un test échoue.**

Réglage manuel unique côté GitHub : Settings → Pages → Source = **GitHub Actions**.

## README — badges dynamiques

En tête de README, badges live + badges de stack statiques :

| Badge | Source | Montre |
|-------|--------|--------|
| CI / Deploy | `github/actions/workflows/deploy.yml/badge.svg` | État du workflow (passing/failing) |
| Pages deployment | `shields.io` `github/deployments/.../github-pages` | État du dernier déploiement Pages |
| Last commit | `shields.io` `github/last-commit` | Fraîcheur du repo |
| Stack (statiques) | `shields.io` `for-the-badge` | Vite, React, TypeScript, Tailwind, shadcn/ui |

Note : CI / Last commit / Pages restent « unknown/inactif » tant que le workflow n'a pas
tourné une première fois → deviennent verts après le premier push réussi (comportement normal).

## Tests de ce bloc

- **Unit** (`src/App.test.tsx`) : `App` rend le texte « Hello » / un titre.
  Valide que Vitest + RTL + Tailwind sont câblés.
- **E2E** (`e2e/smoke.spec.ts`) : Playwright charge la preview du build et vérifie
  l'affichage de la page « Hello ». Valide la chaîne de bout en bout.

## Critères de fin de bloc (validation avant Bloc 2)

1. `pnpm build` passe en local.
2. `pnpm test` et `pnpm test:e2e` passent en local.
3. Push `main` → workflow vert (test → build → deploy).
4. La page « Hello » s'affiche sur `https://owlnext-fr.github.io/process-gomme/`
   avec le CSS Tailwind appliqué (preuve que `base` est correct).
5. Badges README live et cohérents.

**STOP** après ce bloc : validation du déploiement avec Adrien avant d'attaquer le Bloc 2.

## Hors scope (volontairement)

- Contenu des 36 questions (Bloc 2).
- Quiz, scoring, synthèse, animations immeuble (Bloc 3).
- Tout routing multi-pages, state management avancé, persistance.
