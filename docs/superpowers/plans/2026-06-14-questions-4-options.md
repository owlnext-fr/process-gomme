# Questions à 4 options — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note d'exécution** : la **Task 1** comporte une étape de génération de contenu via le tool **Workflow** (jury multi-agents). `Workflow` s'invoque depuis la **boucle principale (contrôleur)**, pas depuis un sous-agent générique — le contrôleur exécute cette étape lui-même, puis intègre le résultat.

**Goal:** Faire passer les 24 questions à choix forcé de 2 → 4 options (4 types distincts/question, équilibré 8×/type/famille), avec un contenu original produit par une boucle qualité multi-agents ; Likert et scoring inchangés.

**Architecture:** Changement quasi exclusivement **données + contenu**. Le type `ForcedChoice.options` passe à un 4-uplet ; le moteur de scoring (`+1` au type choisi) et l'UI (`ForcedChoice` mappe déjà `options`) restent identiques. L'assignation des 4 types par question est **déterministe** (table ci-dessous, testée 8×/type) ; seule la **prose** est générée via Workflow.

**Tech Stack:** Vite, React, TypeScript, Vitest, Playwright ; tool **Workflow** (orchestration multi-agents) pour le contenu.

---

## Référence — design validé

Spec : `docs/superpowers/specs/2026-06-14-questions-4-options-design.md`.

## Table d'équilibrage (déterministe — base ET phase, paires identiques)

Indices = position de la question forcée dans la famille (1→12). Les **paires existantes**
sont identiques entre base et phase. Pour chaque question : les 2 types existants (options
actuelles, à **reformuler**) + 2 types **ajoutés** (nouvelles options). Vérifié : chaque
type final apparaît **8×** sur les 12 questions.

| # | id base / phase | Existants (reformuler) | Ajoutés (nouveaux) | 4 types finaux |
|---|---|---|---|---|
| 1 | b-fc-01 / p-fc-01 | travaillomane, rebelle | perseverant, promoteur | travaillomane, rebelle, perseverant, promoteur |
| 2 | b-fc-02 / p-fc-02 | travaillomane, empathique | reveur, promoteur | travaillomane, empathique, reveur, promoteur |
| 3 | b-fc-03 / p-fc-03 | travaillomane, promoteur | perseverant, rebelle | travaillomane, promoteur, perseverant, rebelle |
| 4 | b-fc-04 / p-fc-04 | travaillomane, reveur | empathique, rebelle | travaillomane, reveur, empathique, rebelle |
| 5 | b-fc-05 / p-fc-05 | perseverant, rebelle | travaillomane, empathique | perseverant, rebelle, travaillomane, empathique |
| 6 | b-fc-06 / p-fc-06 | perseverant, empathique | reveur, promoteur | perseverant, empathique, reveur, promoteur |
| 7 | b-fc-07 / p-fc-07 | perseverant, promoteur | travaillomane, reveur | perseverant, promoteur, travaillomane, reveur |
| 8 | b-fc-08 / p-fc-08 | perseverant, reveur | empathique, rebelle | perseverant, reveur, empathique, rebelle |
| 9 | b-fc-09 / p-fc-09 | empathique, reveur | travaillomane, rebelle | empathique, reveur, travaillomane, rebelle |
| 10 | b-fc-10 / p-fc-10 | empathique, promoteur | perseverant, reveur | empathique, promoteur, perseverant, reveur |
| 11 | b-fc-11 / p-fc-11 | reveur, rebelle | travaillomane, promoteur | reveur, rebelle, travaillomane, promoteur |
| 12 | b-fc-12 / p-fc-12 | promoteur, rebelle | perseverant, empathique | promoteur, rebelle, perseverant, empathique |

Comptage final par type (sur 12 questions) = 8 chacun :
- travaillomane : 1,2,3,4,5,7,9,11 — perseverant : 1,3,5,6,7,8,10,12 — empathique : 2,4,5,6,8,9,10,12
- reveur : 2,4,6,7,8,9,10,11 — rebelle : 1,3,4,5,8,9,11,12 — promoteur : 1,2,3,6,7,10,11,12

**Ordre des options dans le fichier** : libre mais **fixe/déterministe** (les tests ne
vérifient que le compte, la distinction et l'équilibrage ; l'e2e clique la 1re option).

## File Structure

| Fichier | Action | Responsabilité |
|---|---|---|
| `src/data/questions.ts` | Modifier | Type `options` → 4-uplet ; 24 forcés à 4 options (contenu généré) ; Likert inchangés |
| `src/data/questions.test.ts` | Modifier | Invariants : 4 options/forcé, types distincts, 8×/type/famille en forcé |
| `src/lib/scoring.ts` | — | Inchangé (vérifié, non modifié) |
| `src/features/quiz/ForcedChoice.tsx` | — | Inchangé (mappe déjà `options`) |
| `docs/superpowers/artifacts/2026-06-14-forced-4opts.json` | Créer | Sortie brute du Workflow (provenance/traçabilité) |

---

## Task 1 : Migration des 24 forcés en 4 options (type + contenu + tests)

**Files:**
- Modify: `src/data/questions.ts`
- Modify: `src/data/questions.test.ts`
- Create: `docs/superpowers/artifacts/2026-06-14-forced-4opts.json`

> Cette task est **atomique** : changer le type `options` en 4-uplet casse la compilation
> des données 2-options existantes, donc type + données + tests évoluent ensemble. On NE
> committe PAS d'état rouge (commits directs sur `main`). La génération de prose se fait via
> Workflow (contrôleur).

- [ ] **Step 1 : Écrire les invariants cibles dans les tests (vérifier le rouge, sans committer)**

Remplacer dans `src/data/questions.test.ts` le bloc `describe("QUESTIONS — choix forcés", ...)` par :

```ts
describe("QUESTIONS — choix forcés", () => {
  it("chaque forcé a exactement 4 options de types distincts et valides", () => {
    for (const q of forced) {
      expect(q.options).toHaveLength(4)
      const cibles = q.options.map((o) => o.cible)
      expect(new Set(cibles).size).toBe(4)
      for (const o of q.options) {
        expect(TYPE_IDS).toContain(o.cible)
        expect(o.label.length).toBeGreaterThan(0)
      }
      expect(q.prompt.length).toBeGreaterThan(0)
    }
  })
})
```

Et remplacer, dans le `describe("QUESTIONS — équilibrage ...")`, le titre + l'assertion `fc` :

```ts
  it("chaque type est cible 8× en forcé et 1× en Likert, dans chaque famille", () => {
    for (const f of FAMILLES) {
      const c = comptageCibles(f)
      for (const t of TYPE_IDS) {
        expect(c[t].fc, `${t} forcé en ${f}`).toBe(8)
        expect(c[t].lk, `${t} likert en ${f}`).toBe(1)
      }
    }
  })
```

Run: `pnpm test -- src/data/questions.test.ts`
Expected: **FAIL** (les forcés actuels ont 2 options ; `fc` vaut 4). C'est le rouge attendu — **ne pas committer**.

- [ ] **Step 2 : Élargir le type `ForcedChoice.options` à un 4-uplet**

Dans `src/data/questions.ts`, remplacer :

```ts
export interface ForcedChoice extends QuestionBase {
  kind: "forced"
  prompt: string
  options: [Option, Option]
}
```

par :

```ts
export interface ForcedChoice extends QuestionBase {
  kind: "forced"
  prompt: string
  options: [Option, Option, Option, Option]
}
```

(À ce stade `pnpm build`/`tsc` casse sur les 24 forcés encore en 2 options — c'est attendu ; on remplit au Step 4.)

- [ ] **Step 3 : Générer le contenu via Workflow (contrôleur)**

Construire `args` en lisant les 24 forcés actuels de `src/data/questions.ts` : pour chaque question `{ id, famille, prompt, existing: { <type>: <label actuel> } }`, et y joindre les **2 types ajoutés** depuis la table d'équilibrage ci-dessus (donc 4 types cibles par question).

Lancer le Workflow suivant (le contrôleur l'invoque ; `args` = le tableau des 24 questions enrichi) :

```js
export const meta = {
  name: 'questions-4opts-content',
  description: 'Génère 4 options originales par question forcée via jury multi-angles',
  phases: [{ title: 'Draft' }, { title: 'Jury' }, { title: 'Cohérence' }],
}

const QS = args // 24 questions: { id, famille, prompt, types:[t1..t4], existing:{[type]:label} }

const OPTIONS_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    options: {
      type: 'array', minItems: 4, maxItems: 4,
      items: {
        type: 'object', additionalProperties: false,
        properties: { cible: { type: 'string' }, label: { type: 'string' } },
        required: ['cible', 'label'],
      },
    },
  },
  required: ['options'],
}

const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { pass: { type: 'boolean' }, fixes: { type: 'array', items: { type: 'string' } } },
  required: ['pass', 'fixes'],
}

const LENSES = [
  ['fidélité de type', "Chaque option évoque SANS ambiguïté son type cible (et pas un autre des 6). Les 6 types : travaillomane=pensée/structure/logique ; perseverant=valeurs/convictions ; empathique=émotions/relation ; reveur=imaginaire/retrait/calme ; rebelle=plaisir/spontanéité/humour ; promoteur=action/défi/opportunité."],
  ["équilibre d'attractivité", "Les 4 options sont également plausibles et tentantes dans le scénario ; aucune n'est un 'intrus' ni caricaturale."],
  ['discriminance', "Des personnes de types différents choisiraient plausiblement des options différentes (pas de réponse 'évidente' pour tous)."],
  ['naturel et français', "Phrases fluides, naturelles dans le scénario du prompt ; accents et ponctuation soignés ; PAS de point-virgule ; registre cohérent avec le projet (tutoiement, ton posé et concret)."],
  ['originalité', "Contenu 100% original : aucune reprise ni reformulation de matériel propriétaire d'inventaires de personnalité existants."],
]

const VOICE = "Inventaire de personnalité 'process gomme'. Ton : tutoiement, concret, posé, un brin chaleureux. Familles : 'base' = manière stable de percevoir (formulations type 'par nature je…', 'depuis toujours') ; 'phase' = besoin/élan du moment ('ces derniers temps', 'en ce moment'). Réponses courtes (une phrase), à la 1re personne, sans point-virgule, guillemets doubles."

const results = await pipeline(QS, async (q) => {
  const draftPrompt = `${VOICE}\n\nScénario (prompt de la question, famille ${q.famille}) : "${q.prompt}"\n` +
    `Rédige EXACTEMENT 4 options, une par type cible parmi : ${q.types.join(', ')}.\n` +
    `Pour les types déjà présents, tu PEUX réutiliser/reformuler ces libellés existants : ${JSON.stringify(q.existing)}.\n` +
    `Chaque option : une phrase à la 1re personne cohérente avec le scénario, qui incarne son type. Renvoie {options:[{cible,label}]} avec cible ∈ {${q.types.join(', ')}}.`
  let opts = await agent(draftPrompt, { schema: OPTIONS_SCHEMA, phase: 'Draft', label: `draft:${q.id}` })

  for (let round = 0; round < 3; round++) {
    const verdicts = await parallel(LENSES.map(([name, crit]) => () =>
      agent(`${VOICE}\n\nScénario : "${q.prompt}"\nOptions proposées : ${JSON.stringify(opts.options)}\n` +
            `ANGLE = ${name}. Critère : ${crit}\n` +
            `Évalue STRICTEMENT. Renvoie {pass:boolean, fixes:[...]} ; si pass=false, fixes = corrections précises et actionnables.`,
        { schema: VERDICT_SCHEMA, phase: 'Jury', label: `jury:${q.id}:${name}` })))
    const fails = verdicts.filter(Boolean).filter((v) => !v.pass)
    if (!fails.length) break
    const allFixes = fails.flatMap((f) => f.fixes)
    opts = await agent(`${VOICE}\n\nScénario : "${q.prompt}"\nOptions actuelles : ${JSON.stringify(opts.options)}\n` +
      `Corrige en tenant compte de TOUTES ces remarques : ${JSON.stringify(allFixes)}.\n` +
      `Garde 4 options, une par type ∈ {${q.types.join(', ')}}, types distincts. Renvoie {options:[{cible,label}]}.`,
      { schema: OPTIONS_SCHEMA, phase: 'Jury', label: `refine:${q.id}` })
  }
  return { id: q.id, famille: q.famille, options: opts.options }
})

// Passe de cohérence par famille (signale les doublons de ton ; corrections appliquées au besoin)
const COH_SCHEMA = { type: 'object', additionalProperties: false,
  properties: { problemes: { type: 'array', items: { type: 'string' } } }, required: ['problemes'] }
const coherence = await parallel(['base', 'phase'].map((f) => () =>
  agent(`${VOICE}\n\nVoici toutes les options de la famille "${f}" : ` +
    `${JSON.stringify(results.filter((r) => r.famille === f).map((r) => r.options))}\n` +
    `Repère les doublons de tournure, les répétitions de ton ou les options trop similaires entre questions. Renvoie {problemes:[...]} (vide si rien).`,
    { schema: COH_SCHEMA, phase: 'Cohérence', label: `coherence:${f}` })))

return { results, coherence: coherence.filter(Boolean) }
```

Si la passe de cohérence remonte des `problemes`, relancer un `refine` ciblé sur les questions concernées (ré-exécuter le Workflow sur ce sous-ensemble) jusqu'à ce que ce soit propre.

Écrire la sortie brute (`results`) dans `docs/superpowers/artifacts/2026-06-14-forced-4opts.json` (provenance).

- [ ] **Step 4 : Intégrer le contenu dans `questions.ts`**

Pour chacune des 24 questions forcées, remplacer le tableau `options` par les **4 options** générées (objets `{ label, cible }`), `cible` ∈ les 4 types de la table. Vérifier pour chaque question : 4 options, 4 `cible` distinctes correspondant exactement à la ligne de la table d'équilibrage. Likert et `prompt` inchangés (sauf reformulation légère d'un prompt si le Workflow l'a justifié — auquel cas reporter le nouveau prompt).

- [ ] **Step 5 : Vérifier le vert + le gate local**

Run: `pnpm test -- src/data/questions.test.ts`
Expected: **PASS** (4 options, types distincts, 8×/type/famille).

Run: `pnpm lint && pnpm build && pnpm test`
Expected: tout vert (le scoring et le reste ne bougent pas).

- [ ] **Step 6 : Commit**

```bash
git add src/data/questions.ts src/data/questions.test.ts docs/superpowers/artifacts/2026-06-14-forced-4opts.json
git commit -m "✨ feat: questions à choix forcé en 4 options (équilibré 8×/type, contenu original)"
```

---

## Task 2 : Gate CI complet (e2e inclus)

**Files:** aucun (vérification), sauf correctif éventuel.

- [ ] **Step 1 : Lancer le gate complet**

Run: `pnpm before_push`
Expected: `lint` ✓, `test` ✓, `build` ✓, `test:e2e` ✓. L'e2e clique la 1re option de chaque question forcée — 4 options ne changent rien au parcours.

- [ ] **Step 2 : Si l'e2e casse, diagnostiquer sans dénaturer**

Si un sélecteur e2e échoue (peu probable), lire l'échec et corriger le **test** au plus juste (ne pas affaiblir les assertions de fond). Les boutons radio restent des `role="radio"` ; la 1re option reste cliquable.

- [ ] **Step 3 : Commit (si correctif e2e)**

```bash
git add e2e/smoke.spec.ts
git commit -m "✅ test: e2e adapté aux questions à 4 options"
```

(Si rien à corriger, pas de commit.)

---

## Task 3 : Mise à jour de la mémoire projet (règle de fin d'implémentation)

**Files:** `docs/INDEX.md`, `docs/HANDOFF.md`, `docs/CONVENTIONS.md`, `docs/BACKLOG.md`, `docs/QUIRKS.md` (si piège).

- [ ] **Step 1 : `docs/INDEX.md`** — ajouter une ligne :

```
| Questions à 4 options (choix forcés) | 2026-06-14 | [spec](superpowers/specs/2026-06-14-questions-4-options-design.md) | [plan](superpowers/plans/2026-06-14-questions-4-options.md) | ✅ Livré | Forcés 2→4 options, équilibré 8×/type/famille ; Likert & scoring inchangés ; contenu original via Workflow jury |
```

- [ ] **Step 2 : `docs/CONVENTIONS.md`** — préciser, dans la règle d'équilibrage/contenu : les forcés ont **4 options** de types distincts ; invariant **8× cible/type/famille en forcé (+1 Likert)** ; assignation des types **déterministe et testée**, prose seulement générée.

- [ ] **Step 3 : `docs/BACKLOG.md`** — ajouter : « Mélange aléatoire de l'ordre des 4 options (anti-biais de position) — actuellement ordre fixe pour déterminisme tests/e2e. »

- [ ] **Step 4 : `docs/HANDOFF.md`** — entrée datée en haut (Dernière chose faite / suspens / prochaine chose / notes), mentionnant l'artefact de provenance et la méthode Workflow jury.

- [ ] **Step 5 : `docs/QUIRKS.md`** — uniquement si un piège non-évident est apparu (sinon ignorer).

- [ ] **Step 6 : Commit**

```bash
git add docs/
git commit -m "📝 docs: mémoire projet à jour (questions à 4 options)"
```

---

## Self-Review (rempli pendant l'écriture)

- **Couverture du spec** : modèle 4 options (T1 Step 2/4), Likert gardés (non touchés), scoring inchangé (vérifié au gate, aucun fichier modifié), équilibrage 8×/type déterministe + testé (table + T1 Step 1/5), production contenu via Workflow jury 5 angles + cohérence (T1 Step 3), tests d'invariants mis à jour (T1 Step 1), e2e (T2), backlog shuffle (T3). ✅
- **Placeholders** : aucun — table d'équilibrage explicite, script Workflow concret, code de test fourni. La **prose** des options est volontairement générée à l'exécution (impossible à figer dans le plan) mais encadrée par schémas + invariants testés.
- **Cohérence des types** : `options` 4-uplet de `Option` ({label, cible}) cohérent entre questions.ts, le schéma du Workflow (`{cible,label}`) et l'intégration ; `comptageCibles` (déjà dans le test) réutilisé pour l'assertion 8×.
- **Périmètre** : un seul plan ; aucune logique/UI modifiée (hors données + tests + docs).
- **Garde-fou** : aucun commit d'état rouge ; le contenu généré doit passer les invariants avant commit.
