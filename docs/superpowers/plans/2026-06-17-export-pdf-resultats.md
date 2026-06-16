# Export PDF des résultats — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un bouton « Exporter en PDF » qui télécharge en 1 clic un rapport vectoriel complet des résultats (base·phase, immeuble, radar, synthèse, pour aller plus loin).

**Architecture:** Le PDF est un document `@react-pdf/renderer` **reconstruit à partir des données** (scores + fonctions de contenu existantes), pas une capture du DOM. La lib est **lazy-loadée au clic** → bundle initial intact. Les visuels (pyramide, radar) sont redessinés en primitives PDF ; les couleurs de type sont mirrorées en hex.

**Tech Stack:** React + TypeScript, `@react-pdf/renderer`, Vitest (unit, env node pour le rendu PDF), Playwright (e2e download), lucide-react.

**Spec:** `docs/superpowers/specs/2026-06-17-export-pdf-resultats-design.md`

---

## Structure des fichiers

**Créés :**
- `src/features/results/pdf/pdfColors.ts` — `PDF_TYPE_COLORS: Record<TypeId, string>` (hex, miroir de `index.css`).
- `src/features/results/pdf/pdfColors.test.ts` — couvre les 6 types, hex valides.
- `src/features/results/pdf/PdfImmeuble.tsx` — pyramide (barres ∝ score).
- `src/features/results/pdf/PdfRadar.tsx` — radar hexagonal (Svg).
- `src/features/results/pdf/ResultPdfDocument.tsx` — le `<Document>` complet.
- `src/features/results/pdf/ResultPdfDocument.test.tsx` — `renderToBuffer` non vide (env node).
- `src/components/ExportPdfButton.tsx` — bouton + génération + download (lazy import).
- `src/components/ExportPdfButton.test.tsx` — clic → génération mockée → download + nom de fichier.

**Modifiés :**
- `package.json` / lockfile — dépendance `@react-pdf/renderer`.
- `src/features/results/ResultsScreen.tsx` — ajout du bouton dans le header.
- `e2e/smoke.spec.ts` — étape de téléchargement PDF (ou nouveau `e2e/pdf.spec.ts`).

---

## Task 1 : Dépendance + couleurs PDF

**Files:**
- Modify: `package.json` (via `pnpm add`)
- Create: `src/features/results/pdf/pdfColors.ts`
- Test: `src/features/results/pdf/pdfColors.test.ts`

- [ ] **Step 1: Installer la dépendance**

Run: `pnpm add @react-pdf/renderer`
Expected: ajoutée à `dependencies`, lockfile à jour, exit 0.

- [ ] **Step 2: Écrire le test des couleurs (échoue)**

```ts
// src/features/results/pdf/pdfColors.test.ts
import { describe, it, expect } from "vitest"
import { PDF_TYPE_COLORS } from "./pdfColors"
import { TYPE_IDS } from "@/data/types"

describe("PDF_TYPE_COLORS", () => {
  it("couvre exactement les 6 types", () => {
    expect(Object.keys(PDF_TYPE_COLORS).sort()).toEqual([...TYPE_IDS].sort())
  })
  it("chaque couleur est un hex #rrggbb", () => {
    for (const t of TYPE_IDS) expect(PDF_TYPE_COLORS[t]).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test -- src/features/results/pdf/pdfColors.test.ts`
Expected: FAIL (`Cannot find module './pdfColors'`).

- [ ] **Step 4: Implémenter `pdfColors.ts`**

Les valeurs reproduisent le thème clair de `src/index.css` (`--type-1..6`), dans l'ordre du
mapping `TYPE_COLORS` (`travaillomane`=1 … `promoteur`=6).

```ts
// src/features/results/pdf/pdfColors.ts
import type { TypeId } from "@/data/types"

// Miroir hex des tokens --type-1..6 (thème clair) de src/index.css.
// @react-pdf/renderer ne peut pas lire les CSS vars → on duplique en hex.
// ⚠️ Garder en phase avec src/index.css (voir QUIRKS).
export const PDF_TYPE_COLORS: Record<TypeId, string> = {
  travaillomane: "#4f46e5",
  perseverant: "#7c3aed",
  empathique: "#be185d",
  reveur: "#0e7490",
  rebelle: "#b45309",
  promoteur: "#047857",
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test -- src/features/results/pdf/pdfColors.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/features/results/pdf/pdfColors.ts src/features/results/pdf/pdfColors.test.ts
git commit -m "✨ feat(pdf): dépendance @react-pdf/renderer + couleurs de type en hex"
```

---

## Task 2 : Document PDF (visuels + assemblage)

Crée les visuels PDF et le document complet, validés par un test `renderToBuffer`.

**Files:**
- Create: `src/features/results/pdf/PdfImmeuble.tsx`
- Create: `src/features/results/pdf/PdfRadar.tsx`
- Create: `src/features/results/pdf/ResultPdfDocument.tsx`
- Test: `src/features/results/pdf/ResultPdfDocument.test.tsx`

- [ ] **Step 1: Écrire le test du document (échoue)**

Le test force l'environnement **node** (react-pdf `renderToBuffer` est l'API node).

```tsx
// src/features/results/pdf/ResultPdfDocument.test.tsx
// @vitest-environment node
import { describe, it, expect } from "vitest"
import { renderToBuffer } from "@react-pdf/renderer"
import { ResultPdfDocument } from "./ResultPdfDocument"
import { computeResult, type DisplayResult } from "@/lib/scoring"
import { QUESTION_STRUCTURE } from "@/data/questions"
import type { TypeId } from "@/data/types"

function profil(base: TypeId, phase: TypeId): DisplayResult {
  // Fabrique des réponses qui favorisent base (famille base) et phase (famille phase).
  const answers: Record<string, { kind: "forced"; cible: TypeId } | { kind: "likert"; valeur: 1 | 2 | 3 | 4 | 5 }> = {}
  for (const q of QUESTION_STRUCTURE) {
    const cible = q.famille === "base" ? base : phase
    if (q.kind === "forced") {
      answers[q.id] = { kind: "forced", cible: q.cibles.includes(cible) ? cible : q.cibles[0] }
    } else {
      answers[q.id] = { kind: "likert", valeur: q.cible === cible ? 5 : 1 }
    }
  }
  const { motivation: _omit, ...rest } = computeResult(answers)
  return rest
}

describe("ResultPdfDocument", () => {
  it("produit un PDF non vide pour des profils variés (dont base === phase)", async () => {
    for (const [b, p] of [
      ["travaillomane", "empathique"],
      ["reveur", "promoteur"],
      ["rebelle", "rebelle"],
    ] as [TypeId, TypeId][]) {
      const buf = await renderToBuffer(
        <ResultPdfDocument result={profil(b, p)} genere="17 juin 2026" />,
      )
      expect(buf.length).toBeGreaterThan(1000)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/features/results/pdf/ResultPdfDocument.test.tsx`
Expected: FAIL (`Cannot find module './ResultPdfDocument'`).

- [ ] **Step 3: Implémenter `PdfImmeuble.tsx`**

```tsx
// src/features/results/pdf/PdfImmeuble.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer"
import { TYPES, type TypeId } from "@/data/types"
import { PDF_TYPE_COLORS } from "./pdfColors"

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  label: { width: 130, fontSize: 9, color: "#334155" },
  track: { flex: 1, height: 12, backgroundColor: "#f1f5f9", borderRadius: 2 },
  bar: { height: 12, borderRadius: 2 },
  phaseRow: { borderWidth: 1, borderColor: "#1e1b4b", borderRadius: 3, padding: 2 },
})

export function PdfImmeuble({
  immeuble,
  socle,
  phase,
}: {
  immeuble: TypeId[]
  socle: Record<TypeId, number>
  phase: TypeId
}) {
  const max = Math.max(...immeuble.map((t) => socle[t]), 1)
  return (
    <View>
      {immeuble.map((t) => (
        <View key={t} style={t === phase ? [s.row, s.phaseRow] : s.row}>
          <Text style={s.label}>
            {TYPES[t].nom} — {Math.round(socle[t])}%
          </Text>
          <View style={s.track}>
            <View
              style={[s.bar, { width: `${(socle[t] / max) * 100}%`, backgroundColor: PDF_TYPE_COLORS[t] }]}
            />
          </View>
        </View>
      ))}
    </View>
  )
}
```

- [ ] **Step 4: Implémenter `PdfRadar.tsx`**

```tsx
// src/features/results/pdf/PdfRadar.tsx
import { Svg, Polygon, Line, Text as SvgText } from "@react-pdf/renderer"
import { TYPE_IDS, TYPES, type TypeId } from "@/data/types"

const SIZE = 220
const C = SIZE / 2
const R = 80

function point(i: number, radius: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6
  return [C + radius * Math.cos(angle), C + radius * Math.sin(angle)] as const
}

export function PdfRadar({ socle }: { socle: Record<TypeId, number> }) {
  const max = Math.max(...TYPE_IDS.map((t) => socle[t]), 1)
  const grid = TYPE_IDS.map((_, i) => point(i, R))
  const shape = TYPE_IDS.map((t, i) => point(i, (socle[t] / max) * R))
  const toStr = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  return (
    <Svg width={SIZE} height={SIZE}>
      {grid.map((_, i) => {
        const [x, y] = grid[i]
        return <Line key={i} x1={C} y1={C} x2={x} y2={y} stroke="#cbd5e1" strokeWidth={0.5} />
      })}
      <Polygon points={toStr(grid)} stroke="#cbd5e1" strokeWidth={0.5} fill="none" />
      <Polygon points={toStr(shape)} stroke="#4f46e5" strokeWidth={1} fill="#4f46e5" fillOpacity={0.25} />
      {grid.map((g, i) => {
        const [lx, ly] = point(i, R + 14)
        return (
          <SvgText key={i} x={lx} y={ly} textAnchor="middle" fontSize={7} fill="#475569">
            {TYPES[TYPE_IDS[i]].nom}
          </SvgText>
        )
      })}
    </Svg>
  )
}
```

- [ ] **Step 5: Implémenter `ResultPdfDocument.tsx`**

```tsx
// src/features/results/pdf/ResultPdfDocument.tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import { TYPES, type TypeId } from "@/data/types"
import type { DisplayResult } from "@/lib/scoring"
import { DESCRIPTIONS } from "@/content/descriptions"
import { ENERGIE } from "@/content/energie"
import { IMMEUBLE_INTRO, composeInteraction } from "@/content/interactions"
import { CANAUX } from "@/content/canaux"
import { composeStress } from "@/content/stress"
import { composeVigilance } from "@/content/vigilance"
import { SECTION_HINTS } from "@/content/sectionHints"
import { PdfImmeuble } from "./PdfImmeuble"
import { PdfRadar } from "./PdfRadar"

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#0f172a", fontFamily: "Helvetica", lineHeight: 1.4 },
  h1: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  sub: { fontSize: 9, color: "#64748b", marginTop: 2, marginBottom: 12 },
  banner: { backgroundColor: "#e0e7ff", borderRadius: 6, padding: 10, marginBottom: 16 },
  bannerLabel: { fontSize: 8, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 },
  bannerValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#4338ca", marginTop: 2 },
  section: { marginBottom: 14 },
  blockTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 8 },
  hint: { fontSize: 8, color: "#6366f1", marginBottom: 3 },
  p: { marginBottom: 4 },
  li: { marginBottom: 2 },
})

function Section({ titre, hint, children }: { titre: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={s.section} wrap={false}>
      <Text style={s.subTitle}>{titre}</Text>
      {hint ? <Text style={s.hint}>{hint}</Text> : null}
      {children}
    </View>
  )
}

export function ResultPdfDocument({ result, genere }: { result: DisplayResult; genere: string }) {
  const { base, phase, immeuble, socle } = result
  const vigilance = composeVigilance(base, phase)
  return (
    <Document title={`process gomme — ${TYPES[base].nom} · ${TYPES[phase].nom}`}>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>process gomme</Text>
        <Text style={s.sub}>Ton profil · généré le {genere}</Text>

        <View style={s.banner}>
          <Text style={s.bannerLabel}>Ta base · ta phase</Text>
          <Text style={s.bannerValue}>
            {TYPES[base].nom} · {TYPES[phase].nom}
          </Text>
        </View>

        <View style={s.section} wrap={false}>
          <Text style={s.blockTitle}>Ton immeuble</Text>
          <Text style={s.hint}>{SECTION_HINTS.immeuble}</Text>
          <PdfImmeuble immeuble={immeuble} socle={socle} phase={phase} />
        </View>

        <View style={s.section} wrap={false}>
          <Text style={s.blockTitle}>Ton profil en relief</Text>
          <PdfRadar socle={socle} />
        </View>

        <Text style={s.blockTitle}>Synthèse</Text>
        <Section titre={`Ta base — ${TYPES[base].nom}`} hint={SECTION_HINTS.base}>
          <Text style={s.p}>{DESCRIPTIONS[base].base}</Text>
        </Section>
        <Section titre={`Ta phase — ${TYPES[phase].nom}`} hint={SECTION_HINTS.phase}>
          <Text style={s.p}>{DESCRIPTIONS[phase].phase}</Text>
        </Section>
        <Section titre="Ton immeuble" hint={SECTION_HINTS.immeuble}>
          <Text style={s.p}>{IMMEUBLE_INTRO}</Text>
          {immeuble.map((t: TypeId) => (
            <Text key={t} style={s.li}>
              {TYPES[t].nom} — {Math.round(socle[t])}% — {ENERGIE[t]}
            </Text>
          ))}
        </Section>
        <Section titre="Interactions base × phase" hint={SECTION_HINTS.interactions}>
          <Text style={s.p}>{composeInteraction(base, phase)}</Text>
        </Section>

        <Text style={s.blockTitle}>Pour aller plus loin</Text>
        <Section titre="Ton canal de communication" hint={SECTION_HINTS.canal}>
          <Text style={s.p}>{CANAUX[base]}</Text>
        </Section>
        <Section titre="Toi sous stress" hint={SECTION_HINTS.stress}>
          <Text style={s.p}>{composeStress(base, phase)}</Text>
        </Section>
        <Section titre="Points de vigilance" hint={SECTION_HINTS.vigilance}>
          <Text style={s.li}>• {vigilance.base}</Text>
          <Text style={s.li}>• {vigilance.phase}</Text>
        </Section>
      </Page>
    </Document>
  )
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test -- src/features/results/pdf/ResultPdfDocument.test.tsx`
Expected: PASS (1 test, 3 profils). Si une primitive SVG casse (`Text` dans `Svg`), corriger l'import/usage jusqu'au vert.

- [ ] **Step 7: Vérifier lint + build**

Run: `pnpm lint && pnpm build`
Expected: 0 erreur. (react-pdf est importé statiquement ici, mais ces modules ne sont eux-mêmes importés que par `ExportPdfButton` en lazy — voir Task 3 — donc pas dans le bundle initial.)

- [ ] **Step 8: Commit**

```bash
git add src/features/results/pdf/PdfImmeuble.tsx src/features/results/pdf/PdfRadar.tsx src/features/results/pdf/ResultPdfDocument.tsx src/features/results/pdf/ResultPdfDocument.test.tsx
git commit -m "✨ feat(pdf): document de résultats react-pdf (immeuble + radar + synthèse + plus loin)"
```

---

## Task 3 : Bouton d'export (lazy + download)

**Files:**
- Create: `src/components/ExportPdfButton.tsx`
- Test: `src/components/ExportPdfButton.test.tsx`

- [ ] **Step 1: Écrire le test (échoue)**

On mocke le module react-pdf et la génération ; on vérifie l'appel download + le nom de
fichier + l'état de chargement.

```tsx
// src/components/ExportPdfButton.test.tsx
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ExportPdfButton } from "./ExportPdfButton"
import type { DisplayResult } from "@/lib/scoring"
import type { TypeId } from "@/data/types"

vi.mock("@react-pdf/renderer", () => ({
  pdf: () => ({ toBlob: async () => new Blob(["%PDF-1.7"], { type: "application/pdf" }) }),
}))
vi.mock("@/features/results/pdf/ResultPdfDocument", () => ({
  ResultPdfDocument: () => null,
}))

const socle: Record<TypeId, number> = {
  travaillomane: 34, perseverant: 22, empathique: 18, reveur: 12, rebelle: 8, promoteur: 6,
}
const result: DisplayResult = {
  socle, base: "travaillomane", phase: "empathique",
  immeuble: ["travaillomane", "perseverant", "empathique", "reveur", "rebelle", "promoteur"],
  baseEgalePhase: false,
}

describe("ExportPdfButton", () => {
  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => "blob:fake")
    globalThis.URL.revokeObjectURL = vi.fn()
  })

  it("génère le PDF et déclenche un téléchargement nommé", async () => {
    const user = userEvent.setup()
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
    let captured: HTMLAnchorElement | undefined
    const realCreate = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = realCreate(tag) as HTMLElement
      if (tag === "a") captured = el as HTMLAnchorElement
      return el
    })

    render(<ExportPdfButton result={result} />)
    await user.click(screen.getByRole("button", { name: /exporter en pdf/i }))

    await waitFor(() => expect(click).toHaveBeenCalled())
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled()
    expect(captured?.getAttribute("download")).toBe("process-gomme-travaillomane-empathique.pdf")

    vi.restoreAllMocks()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/components/ExportPdfButton.test.tsx`
Expected: FAIL (`Cannot find module './ExportPdfButton'`).

- [ ] **Step 3: Implémenter `ExportPdfButton.tsx`**

```tsx
// src/components/ExportPdfButton.tsx
import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TYPES } from "@/data/types"
import type { DisplayResult } from "@/lib/scoring"

export function ExportPdfButton({ result }: { result: DisplayResult }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  async function handleExport() {
    setBusy(true)
    setError(false)
    try {
      const [{ pdf }, { ResultPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/features/results/pdf/ResultPdfDocument"),
      ])
      const genere = new Date().toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
      })
      const blob = await pdf(<ResultPdfDocument result={result} genere={genere} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `process-gomme-${result.base}-${result.phase}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={handleExport} disabled={busy}>
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Download className="size-4" aria-hidden />
        )}
        {busy ? "Génération…" : "Exporter en PDF"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {error ? "Export PDF impossible" : busy ? "Génération du PDF en cours" : ""}
      </span>
    </>
  )
}
```

> Note : ce composant est le **seul** à importer `@react-pdf/renderer` et `ResultPdfDocument`,
> et il le fait en **`import()` dynamique** → react-pdf part dans un **chunk séparé** chargé
> au clic. Le test mocke ces modules (le mock s'applique aussi aux imports dynamiques).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/components/ExportPdfButton.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ExportPdfButton.tsx src/components/ExportPdfButton.test.tsx
git commit -m "✨ feat(pdf): bouton Exporter en PDF (lazy import + téléchargement 1 clic)"
```

---

## Task 4 : Intégration écran + e2e

**Files:**
- Modify: `src/features/results/ResultsScreen.tsx`
- Create: `e2e/pdf.spec.ts`

- [ ] **Step 1: Brancher le bouton dans le header**

Dans `src/features/results/ResultsScreen.tsx`, importer et insérer `ExportPdfButton` à côté
de `ShareButton` :

```tsx
import { ExportPdfButton } from "@/components/ExportPdfButton"
```

Et dans le `<div className="flex gap-2">` du header, avant `<ShareButton .../>` :

```tsx
        <div className="flex gap-2">
          <ExportPdfButton result={result} />
          <ShareButton result={result} />
          {!shared && (
            <Button variant="outline" onClick={onRestart}>
              <RotateCcw className="size-4" aria-hidden />
              Recommencer
            </Button>
          )}
        </div>
```

- [ ] **Step 2: Écrire l'e2e de téléchargement**

```ts
// e2e/pdf.spec.ts
import { test, expect } from "@playwright/test"

test("export PDF : le bouton télécharge un .pdf", async ({ page }) => {
  await page.goto("/process-gomme/")
  await page.getByRole("button", { name: /adulte/i }).click()

  // Répondre aux 36 questions (1re option à chaque fois).
  for (let i = 0; i < 36; i++) {
    await expect(page.getByText(`Question ${i + 1} / 36`)).toBeVisible()
    await page.waitForTimeout(350) // animations Framer (cf. QUIRKS)
    const suivant = page.getByRole("button", { name: /suivant|résultats/i })
    const radios = page.getByRole("radio")
    if (await radios.first().isVisible().catch(() => false)) await radios.first().click()
    await expect(suivant).toBeEnabled()
    await suivant.click()
  }

  await expect(page.getByRole("heading", { name: /tes résultats/i })).toBeVisible()
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /exporter en pdf/i }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/\.pdf$/)
})
```

- [ ] **Step 3: Run unit + lint + build**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: tout PASS. Vérifier dans la sortie `vite build` qu'un **chunk séparé** contient
react-pdf (gros chunk distinct de l'`index`), preuve du lazy-load.

- [ ] **Step 4: Run e2e**

Run: `pnpm test:e2e`
Expected: les specs passent (smoke + share + pdf). Si le download n'est pas capté, vérifier
que le clic du `<a download>` se produit bien (pas de bloqueur) ; pas de `waitForTimeout`
nécessaire après le clic (l'event download suffit).

- [ ] **Step 5: Commit**

```bash
git add src/features/results/ResultsScreen.tsx e2e/pdf.spec.ts
git commit -m "✨ feat(results): bouton Exporter en PDF dans le header + e2e download"
```

---

## Task 5 : Gate complète + mémoire projet

**Files:**
- Modify: `docs/INDEX.md`, `docs/HANDOFF.md`, `docs/QUIRKS.md`, `docs/BACKLOG.md` (si idées), `docs/ENVIRONMENT.md` (si pertinent)

- [ ] **Step 1: Gate complète**

Run: `pnpm before_push`
Expected: PASS (`lint` + `test` + `build` + `test:e2e`). Corriger toute erreur avant de continuer.

- [ ] **Step 2: Mémoire projet** (règle non-négociable de `CLAUDE.md`)

- `docs/INDEX.md` : ligne « Export PDF des résultats » avec liens spec/plan.
- `docs/HANDOFF.md` : entrée datée 2026-06-17 (dernière chose faite / notes future Claude).
- `docs/QUIRKS.md` : quirk « `PDF_TYPE_COLORS` (`pdf/pdfColors.ts`) duplique en hex les tokens `--type-1..6` de `index.css` → garder en phase » + « le test `ResultPdfDocument` tourne en `// @vitest-environment node` (renderToBuffer) » + « react-pdf lazy-loadé au clic, gros chunk séparé ».
- `docs/ENVIRONMENT.md` : noter la nouvelle dépendance `@react-pdf/renderer` (runtime, lazy) si la section dépendances existe.

- [ ] **Step 3: Commit**

```bash
git add docs/
git commit -m "📝 docs: mémoire à jour (export PDF des résultats)"
```

- [ ] **Step 4: Push + surveiller la CI**

```bash
git push origin main
```
Puis surveiller : `gh run watch <run-id> --exit-status` jusqu'au vert (test → build → deploy).

---

## Notes de revue (auto-check)

- **Couverture spec** : dépendance + couleurs (Task 1) ; document vectoriel reconstruit avec immeuble/radar redessinés + contenu réutilisé + SECTION_HINTS + date (Task 2) ; bouton lazy + download 1 clic + nom de fichier + état + icône Download (Task 3) ; intégration header (vue perso ET partagée, le bouton ne dépend pas de `shared`) + e2e download (Task 4) ; gate + mémoire + deploy (Task 5). ✅
- **Non-goals respectés** : pas de `PDFViewer`, pas de html2canvas, pas de police custom, pas d'autre profil. ✅
- **Cohérence des types** : `ResultPdfDocument({ result: DisplayResult; genere: string })`, `PdfImmeuble({ immeuble, socle, phase })`, `PdfRadar({ socle })`, `PDF_TYPE_COLORS: Record<TypeId,string>`, `ExportPdfButton({ result: DisplayResult })`. Noms cohérents entre tâches. ✅
- **Bundle** : react-pdf importé uniquement en `import()` dynamique dans `ExportPdfButton` → chunk séparé, bundle initial intact (vérifié au build, Task 4 Step 3). ✅
- **Verts à chaque commit** : chaque task compile et teste indépendamment ; l'intégration écran (Task 4) n'arrive qu'après que le bouton et le document existent. ✅
