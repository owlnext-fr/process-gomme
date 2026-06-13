# Quirks & pièges connus

Comportements non-évidents découverts au fil du projet. Un H2 par quirk, avec une date.

**Si tu en découvres un nouveau pendant une session : ajoute-le ici dès la découverte, pas plus tard.**

---

## Vite `base` obligatoire pour GitHub Pages (2026-06-13)

**Symptôme** : en prod, les assets (JS/CSS) renvoient 404 et la page est blanche.

**Cause** : GitHub Pages sert le site sous `/<repo>/`, pas à la racine.

**Workaround** : `vite.config.ts` → `base: '/process-gomme/'`. Tout routing futur devra en tenir compte.

**Référence** : `vite.config.ts`

## TypeScript 6 déprécie `baseUrl` (2026-06-13)

**Symptôme** : `tsc -b` échoue avec `TS5101: Option 'baseUrl' is deprecated`.

**Cause** : TS 6 déprécie `baseUrl` seul.

**Workaround** : ne PAS mettre `baseUrl` ; garder uniquement `paths` (`@/*` → `./src/*`), qui fonctionne seul depuis TS 4.1. Pas de flag `ignoreDeprecations`.

**Référence** : `tsconfig.json`, `tsconfig.app.json`

## shadcn/ui + règle ESLint `react-refresh` (2026-06-13)

**Symptôme** : `pnpm lint` échoue sur `button.tsx`/`tabs.tsx` (`react-refresh/only-export-components`).

**Cause** : les composants shadcn exportent volontairement un composant ET ses variantes (`buttonVariants`) depuis le même fichier.

**Workaround** : override ESLint désactivant cette règle pour `src/components/ui/**`.

**Référence** : `eslint.config.js`

## Playwright e2e + animations Framer Motion (2026-06-13)

**Symptôme** : clic sur un radio/bouton échoue (« element is not stable » / « detached from the DOM »).

**Cause** : `AnimatePresence` anime le conteneur de la question (~250 ms) ; Playwright refuse de cliquer un élément en mouvement.

**Workaround** : dans le test e2e, `await page.waitForTimeout(350)` après confirmation du compteur de question, avant d'interagir. (Fix côté test uniquement, pas l'app.)

**Référence** : `e2e/smoke.spec.ts`

## `pnpm/action-setup` exige le champ `packageManager` (2026-06-13)

**Symptôme** : le job CI échoue à déterminer la version de pnpm.

**Cause** : `pnpm/action-setup@v4` lit la version dans `package.json` → `packageManager`.

**Workaround** : `"packageManager": "pnpm@10.28.1"` dans `package.json`.

**Référence** : `package.json`, `.github/workflows/deploy.yml`

## Avertissement « Node.js 20 deprecated » dans Actions (2026-06-13)

**Symptôme** : annotations jaunes sur chaque run CI.

**Cause** : les actions officielles (`checkout@v4`, etc.) embarquent un runtime Node 20, déprécié par GitHub (forçage Node 24 prévu le 2026-06-16).

**Workaround** : informatif, **rien à corriger** — ce sont déjà les dernières versions majeures. À surveiller si un job casse après la bascule.

**Référence** : `.github/workflows/deploy.yml`

## shadcn CLI 4.11 : preset par défaut `base-nova` (2026-06-13)

**Symptôme** : `style: "radix-nova"` dans `components.json`, police Geist + `tw-animate-css` + `shadcn` en dépendance runtime — pas le « new-york » historique.

**Cause** : refonte shadcn 4.x ; le défaut est `--preset base-nova`. « new-york » n'existe plus.

**Workaround** : choix assumé `--base radix` (Radix UI, mature) + preset nova (= thème par défaut). Conforme au brief « thème par défaut ».

**Référence** : `components.json`, `src/index.css`

## `max-md:hidden` (pas `hidden md:block`) pour masquer un volet flex en mobile (2026-06-14)

**Symptôme** : on veut masquer le volet droit du `SplitLayout` en mobile MAIS le garder en conteneur flex (`flex flex-col justify-center`) en desktop pour centrer son contenu.

**Cause** : `hidden md:block` force `display:block` à partir de `md`, ce qui **écrase** le `flex` du volet → plus de centrage vertical.

**Workaround** : utiliser `max-md:hidden` (masque sous `md`, laisse le `flex` intact à `md`+). Le test de `SplitLayout` vérifie donc `max-md:hidden`.

**Référence** : `src/components/SplitLayout.tsx`, `src/components/SplitLayout.test.tsx`

## Padding horizontal de la pyramide : desktop-only (2026-06-14)

**Symptôme** : `px-16` sur la pyramide (immeuble) « casse tout » en mobile (étages écrasés, illisibles).

**Cause** : en mobile la carte est étroite ; un gros padding horizontal sur des étages en largeur `%` les réduit à presque rien.

**Workaround** : `md:px-16` (padding seulement à partir de `md`). En mobile, la pyramide reste pleine largeur.

**Référence** : `src/features/results/Immeuble.tsx`
