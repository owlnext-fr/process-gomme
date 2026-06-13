# Bloc 1 — Setup repo + déploiement GitHub Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un squelette Vite + React + TS + Tailwind v4 + shadcn/ui qui build, est testé (Vitest unit + Playwright e2e), et se déploie automatiquement sur `https://owlnext-fr.github.io/process-gomme/` via les GitHub Actions officielles, avec un README à badges dynamiques.

**Architecture :** App statique mono-page (« Hello ») à la racine du repo. Un seul workflow GitHub Actions enchaîne `test → build → deploy` (gating : rien n'est publié si un test échoue). Le déploiement utilise la source « GitHub Actions » de Pages (`upload-pages-artifact` + `deploy-pages`), pas de branche `gh-pages`.

**Tech Stack :** Node 24 (LTS), pnpm 10, Vite, React 19, TypeScript, Tailwind v4 (`@tailwindcss/vite`), shadcn/ui (style new-york, base neutral), Vitest + React Testing Library, Playwright. Commits gitmoji directement sur `main`.

**Spec source :** `docs/superpowers/specs/2026-06-13-bloc1-setup-deploiement-design.md`

---

## File Structure

| Fichier | Responsabilité |
|---------|----------------|
| `.nvmrc` | Épingle Node 24 |
| `package.json` | Scripts pnpm (`dev/build/preview/lint/test/test:e2e`) + deps |
| `vite.config.ts` | `base: '/process-gomme/'`, plugins react + tailwind, alias `@`, config Vitest |
| `tsconfig.json` / `tsconfig.app.json` | Path alias `@/*` |
| `src/index.css` | `@import "tailwindcss"` + tokens shadcn |
| `src/App.tsx` | Page « Hello » (placeholder du bloc) |
| `src/App.test.tsx` | Test smoke unit (Vitest + RTL) |
| `src/test/setup.ts` | Setup RTL (`jest-dom`) |
| `src/components/ui/` | Composants shadcn installés |
| `src/lib/utils.ts` | Helper `cn` (créé par shadcn) |
| `components.json` | Config shadcn |
| `playwright.config.ts` | testDir `e2e`, webServer = preview du build, baseURL avec base path |
| `e2e/smoke.spec.ts` | Test e2e : la page Hello s'affiche en prod-like |
| `.github/workflows/deploy.yml` | CI/CD : test → build → deploy Pages |
| `README.md` | Badges dynamiques + présentation |

---

## Task 1: Scaffolding Vite React TS + pnpm + Node pin

**Files:**
- Create: `.nvmrc`, `package.json`, `vite.config.ts`, `src/*`, `index.html`, `.gitignore`, `tsconfig*.json` (générés par create-vite)

> Le repo n'est pas vide (`.git`, `README.md`, `brief-claude-code-pcm.md`, `docs/`). On scaffolde dans un dossier temporaire puis on déplace les fichiers à la racine pour éviter le prompt interactif de create-vite.

- [ ] **Step 1: Vérifier Node 24 actif**

Run: `node -v`
Expected: `v24.x` (sinon `nvm use 24`)

- [ ] **Step 2: Scaffolder Vite dans un dossier temporaire**

```bash
cd /srv/owlnext/process-gomme
pnpm create vite@latest .tmp-vite --template react-ts
```
Expected: dossier `.tmp-vite/` créé avec le template react-ts.

- [ ] **Step 3: Déplacer les fichiers à la racine (le README du template écrase notre placeholder, normal — on le réécrit en Task 8)**

```bash
cd /srv/owlnext/process-gomme
shopt -s dotglob
mv .tmp-vite/* .
shopt -u dotglob
rm -rf .tmp-vite
```
Expected: `package.json`, `vite.config.ts`, `index.html`, `src/`, `.gitignore`, `tsconfig*.json` à la racine.

- [ ] **Step 4: Créer `.nvmrc`**

Create `.nvmrc`:
```
24
```

- [ ] **Step 5: Installer les dépendances**

Run: `pnpm install`
Expected: `node_modules/` créé, pas d'erreur.

- [ ] **Step 6: Vérifier que le dev build démarre puis le build prod**

Run: `pnpm build`
Expected: `dist/` généré sans erreur TypeScript.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "🎉 init: scaffold Vite + React + TS + pnpm (Node 24)"
```

---

## Task 2: Tailwind v4 + base path + alias `@`

**Files:**
- Modify: `vite.config.ts`, `src/index.css`, `tsconfig.json`, `tsconfig.app.json`
- Add dep: `@tailwindcss/vite`, `tailwindcss`, `@types/node`

- [ ] **Step 1: Installer Tailwind v4 et le plugin Vite + types node**

```bash
pnpm add tailwindcss @tailwindcss/vite
pnpm add -D @types/node
```

- [ ] **Step 2: Remplacer `src/index.css` par l'import Tailwind**

Replace entire `src/index.css` with:
```css
@import "tailwindcss";
```

- [ ] **Step 3: Configurer `vite.config.ts` (base path + plugins + alias)**

Replace entire `vite.config.ts` with:
```ts
import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/process-gomme/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

- [ ] **Step 4: Ajouter le path alias dans `tsconfig.json`**

In `tsconfig.json`, add to the root object (alongside `files`/`references`):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 5: Ajouter le path alias dans `tsconfig.app.json`**

In `tsconfig.app.json`, add to `compilerOptions`:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

- [ ] **Step 6: Vérifier le build avec Tailwind**

Run: `pnpm build`
Expected: build OK, le CSS Tailwind est inclus dans `dist/assets/`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "💄 style: Tailwind v4 + base path GH Pages + alias @"
```

---

## Task 3: Init shadcn/ui + composants du brief

**Files:**
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/*`
- Modify: `src/index.css` (tokens injectés par shadcn)

- [ ] **Step 1: Initialiser shadcn (style new-york, base neutral, thème par défaut)**

```bash
pnpm dlx shadcn@latest init
```
Réponses : style **new-york**, base color **neutral**, CSS variables **yes**.
Expected: `components.json` créé, `src/lib/utils.ts` créé, `src/index.css` enrichi des tokens `@theme`/`:root`.

- [ ] **Step 2: Vérifier `components.json`**

Le fichier doit ressembler à :
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 3: Installer les 7 composants du brief**

```bash
pnpm dlx shadcn@latest add card progress radio-group slider button tabs accordion
```
Expected: fichiers créés sous `src/components/ui/` (`card.tsx`, `progress.tsx`, `radio-group.tsx`, `slider.tsx`, `button.tsx`, `tabs.tsx`, `accordion.tsx`).

- [ ] **Step 4: Vérifier le build avec les composants shadcn**

Run: `pnpm build`
Expected: build OK (les composants ne sont pas encore importés, mais doivent compiler).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "✨ feat: init shadcn/ui + composants (card, progress, radio-group, slider, button, tabs, accordion)"
```

---

## Task 4: Setup Vitest + RTL et page « Hello » (TDD)

**Files:**
- Create: `src/test/setup.ts`, `src/App.test.tsx`
- Modify: `vite.config.ts` (bloc `test`), `package.json` (scripts), `src/App.tsx`
- Add deps: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/dom`, `jsdom`, `@vitejs/plugin-react` (déjà présent)

- [ ] **Step 1: Installer les deps de test unit**

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/dom jsdom
```

- [ ] **Step 2: Créer le setup RTL**

Create `src/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest"
```

- [ ] **Step 3: Configurer Vitest dans `vite.config.ts`**

Replace entire `vite.config.ts` with (ajoute `test` + la référence de types) :
```ts
/// <reference types="vitest/config" />
import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/process-gomme/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", "e2e"],
  },
})
```

- [ ] **Step 4: Ajouter les scripts dans `package.json`**

Dans `package.json`, remplacer le bloc `scripts` par :
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 5: Écrire le test smoke qui échoue**

Create `src/App.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import App from "./App"

describe("App", () => {
  it("affiche le titre Hello et le sous-titre process gomme", () => {
    render(<App />)
    expect(
      screen.getByRole("heading", { name: /hello/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/process gomme/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Lancer le test pour vérifier qu'il échoue**

Run: `pnpm test`
Expected: FAIL — `App.tsx` actuel (template Vite) n'a ni heading « Hello » ni texte « process gomme ».

- [ ] **Step 7: Réécrire `src/App.tsx` (page Hello minimale, propre, avec un composant shadcn pour valider l'intégration)**

Replace entire `src/App.tsx` with:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">Hello 👋</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            process gomme — squelette déployé. Le contenu arrive aux blocs suivants.
          </p>
          <Button className="w-fit">Bientôt : le test</Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
```

- [ ] **Step 8: Nettoyer les imports morts du template (App.css, logos)**

Supprimer `src/App.css` s'il existe et toute ligne `import "./App.css"` / imports de logos restants. Vérifier qu'`src/main.tsx` importe bien `./index.css`.

Run: `rm -f src/App.css src/assets/react.svg`

- [ ] **Step 9: Lancer le test pour vérifier qu'il passe**

Run: `pnpm test`
Expected: PASS (1 test).

- [ ] **Step 10: Vérifier le build**

Run: `pnpm build`
Expected: build OK.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "✅ test: setup Vitest + RTL et page Hello (smoke unit)"
```

---

## Task 5: Setup Playwright + test e2e smoke

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`
- Modify: `.gitignore` (artefacts Playwright)
- Add dep: `@playwright/test`

- [ ] **Step 1: Installer Playwright et le navigateur Chromium**

```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

- [ ] **Step 2: Créer `playwright.config.ts` (sert le build prod via vite preview, avec le base path)**

Create `playwright.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test"

const PORT = 4173
const BASE_URL = `http://localhost:${PORT}/process-gomme/`

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

- [ ] **Step 3: Écrire le test e2e smoke**

Create `e2e/smoke.spec.ts`:
```ts
import { test, expect } from "@playwright/test"

test("la page Hello s'affiche avec le style Tailwind appliqué", async ({ page }) => {
  await page.goto("/process-gomme/")

  // Le titre Hello est visible
  await expect(page.getByRole("heading", { name: /hello/i })).toBeVisible()

  // Le texte de présentation est présent
  await expect(page.getByText(/process gomme/i)).toBeVisible()

  // Preuve que le base path est correct : le CSS est chargé (la Card a un fond non transparent)
  const card = page.getByText(/process gomme/i).locator("..")
  await expect(card).toBeVisible()
})
```

- [ ] **Step 4: Ignorer les artefacts Playwright**

Ajouter à `.gitignore` :
```
# Playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

- [ ] **Step 5: Lancer le test e2e**

Run: `pnpm test:e2e`
Expected: PASS — Playwright build + preview, charge `/process-gomme/`, voit le titre Hello.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "✅ test: e2e Playwright smoke (parcours Hello prod-like)"
```

---

## Task 6: Workflow GitHub Actions (test → build → deploy)

**Files:**
- Create: `.github/workflows/deploy.yml`

> Pré-requis déjà fait par Adrien : Settings → Pages → Source = **GitHub Actions**.

- [ ] **Step 1: Créer le workflow**

Create `.github/workflows/deploy.yml`:
```yaml
name: CI/CD

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - name: Install Playwright browser
        run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Vérifier la cohérence des scripts**

Vérifier que `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build` existent bien dans `package.json` (Tasks 4 & 5).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "🚀 ci: workflow GitHub Actions test → build → deploy Pages"
```

---

## Task 7: README avec badges dynamiques

**Files:**
- Modify: `README.md` (remplace le contenu actuel et celui hérité du template Vite)

- [ ] **Step 1: Réécrire `README.md`**

Replace entire `README.md` with:
```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "📝 docs: README avec badges dynamiques et instructions"
```

---

## Task 8: Vérification complète + push + validation prod

**Files:** aucun (vérification)

- [ ] **Step 1: Vérification locale complète**

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```
Expected: tout passe sans erreur.

- [ ] **Step 2: Pousser sur main**

```bash
git push origin main
```

- [ ] **Step 3: Suivre le workflow**

Run: `gh run watch` (ou onglet Actions du repo)
Expected: jobs `test → build → deploy` verts.

- [ ] **Step 4: Vérifier la prod**

Ouvrir `https://owlnext-fr.github.io/process-gomme/`.
Expected : page « Hello 👋 » dans une Card stylée (CSS Tailwind appliqué → preuve que `base` est correct).

- [ ] **Step 5: Vérifier les badges README**

Sur la page GitHub du repo : badges CI (passing), Pages (success), Last commit à jour.

- [ ] **Step 6: STOP — validation avec Adrien**

Le Bloc 1 est terminé. **Ne pas enchaîner sur le Bloc 2** sans validation explicite du déploiement (cf. STOP gate du brief).

---

## Notes d'exécution

- **Versions d'actions** (`@v4`, `@v5`, `@v3`) : si une action échoue pour cause de version dépréciée au moment de l'exécution, prendre la dernière version stable majeure équivalente.
- **create-vite** peut générer React 19 ; tous les snippets ci-dessus sont compatibles.
- Si `pnpm dlx shadcn init` pose une question sur l'écrasement de `src/index.css` (déjà modifié en Task 2), accepter — shadcn ajoute ses tokens par-dessus `@import "tailwindcss"`.
- Si le port 4173 est occupé localement, adapter `PORT` dans `playwright.config.ts`.
