// @vitest-environment node
import { describe, it, expect } from "vitest"
import { renderToBuffer } from "@react-pdf/renderer"
import { ResultPdfDocument } from "./ResultPdfDocument"
import { computeResult, type DisplayResult } from "@/lib/scoring"
import { QUESTION_STRUCTURE } from "@/data/questions"
import type { TypeId } from "@/data/types"

function profil(base: TypeId, phase: TypeId): DisplayResult {
  const answers: Record<string, { kind: "forced"; cible: TypeId } | { kind: "likert"; valeur: 1 | 2 | 3 | 4 | 5 }> = {}
  for (const q of QUESTION_STRUCTURE) {
    const cible = q.famille === "base" ? base : phase
    if (q.kind === "forced") {
      answers[q.id] = { kind: "forced", cible: q.cibles.includes(cible) ? cible : q.cibles[0] }
    } else {
      answers[q.id] = { kind: "likert", valeur: q.cible === cible ? 5 : 1 }
    }
  }
  const r = computeResult(answers)
  return { socle: r.socle, base: r.base, phase: r.phase, immeuble: r.immeuble, baseEgalePhase: r.baseEgalePhase }
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
