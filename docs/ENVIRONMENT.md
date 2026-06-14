# Environnement du projet

Carte des paths, conteneurs, services, accès. À jour au fil des découvertes.

À consulter **avant de lancer toute commande non-triviale**.

---

## Repo

- **Path hôte** : `/srv/owlnext/process-gomme`
- **Remote** : `git@github.com:owlnext-fr/process-gomme.git` (org **owlnext-fr**, repo **public**)
- **Branche par défaut** : `main`
- **Convention de merge** : **commits directs sur `main`** (petit projet, pas de PR/feature branches). Messages **gitmoji** (ex. `✨ feat:`, `🔧 fix:`, `📝 docs:`).

## Stack d'exécution

- **Runtime** : **local** (pas de Docker). Node **24** (LTS Krypton) via **nvm** (`.nvmrc` = `24`), **pnpm 10.28.1** (épinglé via `packageManager` dans `package.json`, activable par `corepack enable pnpm`).
- **Comment lancer une commande** : en local, `pnpm <script>` depuis la racine du repo.
- **Prérequis e2e (une fois)** : `pnpm exec playwright install chromium`.
- **App** : 100 % statique (Vite + React). `vite.config.ts` → `base: '/process-gomme/'` (impératif pour GitHub Pages, sinon les assets cassent).

## Services actifs

| Service | Rôle | Accès |
|---|---|---|
| GitHub Pages | Hébergement de la prod (statique) | https://owlnext-fr.github.io/process-gomme/ |
| GitHub Actions | CI/CD (`.github/workflows/deploy.yml`) : `test → build → deploy` | onglet Actions du repo ; `gh run watch` |

Pas de backend, pas de base de données. Tout le state est en mémoire navigateur (`useReducer`).

**Surface publique de l'app** : un seul paramètre d'URL, `?r=<code base64url>` (lien de partage de profil). Lu une fois au montage par `App` (`readSharedFromLocation`, `src/lib/shareCode.ts`) ; un code invalide est ignoré → intro. Aucune autre route ni param.

## Variables d'environnement

**Aucune.** L'app est 100 % statique, sans secret, sans backend. Pas de `.env`. Aucune donnée n'est envoyée ni persistée (les réponses restent en mémoire navigateur).

## Commandes clés

```bash
pnpm dev            # serveur de dev
pnpm test           # tests unitaires (Vitest)
pnpm test:e2e       # e2e (Playwright) — nécessite le navigateur installé
pnpm build          # build de prod (tsc -b && vite build)
pnpm preview        # prévisualisation du build
pnpm lint           # ESLint
pnpm before_push    # gate CI complet en local (lint+test+build+e2e) — À LANCER AVANT git push
```

## Déploiement

`git push origin main` → GitHub Actions enchaîne `test → build → deploy` (rien n'est publié si un test échoue). Réglage GitHub fait une fois : Settings → Pages → Source = **GitHub Actions**.

## Outils de dev / vérification visuelle

- **Serveur de dev** : `pnpm dev` sert sur **`http://localhost:5173/process-gomme/`** (Vite prend **5174** si 5173 est occupé). Ne pas oublier le suffixe `/process-gomme/` (cf. `base` dans `vite.config.ts`).
- **Vérif visuelle** : on capture les écrans via le **MCP Playwright** (`browser_navigate` + `browser_resize` + `browser_take_screenshot`) pour juger desktop (ex. 1440×900) et mobile (ex. 390×844) pendant les itérations UX.
- **Compagnon visuel (brainstorming superpowers)** : serveur local de maquettes ; les HTML générés vivent sous `.superpowers/brainstorm/.../content/` (cliquables, sélections lues dans `.../state/events`).
- **`.gitignore`** : `.superpowers/`, `.playwright-mcp/`, `*.png` (artefacts de capture/maquettes — ne pas committer).
