import { describe, it, expect } from "vitest"
import { computeResult, deriveFromSocle, type Answers } from "./scoring"
import { QUESTIONS } from "@/data/questions"
import { TYPE_IDS, type TypeId } from "@/data/types"

function answersFavorisant(cibleBase: TypeId, ciblePhase: TypeId): Answers {
  const a: Answers = {}
  for (const q of QUESTIONS) {
    const cible = q.famille === "base" ? cibleBase : ciblePhase
    if (q.kind === "forced") {
      const match = q.options.find((o) => o.cible === cible)
      a[q.id] = { kind: "forced", cible: (match ?? q.options[0]).cible }
    } else {
      a[q.id] = { kind: "likert", valeur: q.cible === cible ? 5 : 1 }
    }
  }
  return a
}

describe("computeResult", () => {
  it("la base et la phase sont les types favorisés", () => {
    const r = computeResult(answersFavorisant("travaillomane", "empathique"))
    expect(r.base).toBe("travaillomane")
    expect(r.phase).toBe("empathique")
    expect(r.baseEgalePhase).toBe(false)
  })

  it("chaque vecteur est normalisé en % (somme ≈ 100)", () => {
    const r = computeResult(answersFavorisant("perseverant", "rebelle"))
    const somme = (v: Record<TypeId, number>) => TYPE_IDS.reduce((s, t) => s + v[t], 0)
    expect(somme(r.socle)).toBeCloseTo(100, 5)
    expect(somme(r.motivation)).toBeCloseTo(100, 5)
  })

  it("l'immeuble classe les 6 types par score socle décroissant", () => {
    const r = computeResult(answersFavorisant("reveur", "reveur"))
    for (let i = 1; i < r.immeuble.length; i++) {
      expect(r.socle[r.immeuble[i - 1]]).toBeGreaterThanOrEqual(r.socle[r.immeuble[i]])
    }
    expect(r.immeuble).toHaveLength(6)
    expect(new Set(r.immeuble).size).toBe(6)
  })

  it("gère le cas base === phase", () => {
    const r = computeResult(answersFavorisant("promoteur", "promoteur"))
    expect(r.base).toBe("promoteur")
    expect(r.phase).toBe("promoteur")
    expect(r.baseEgalePhase).toBe(true)
  })

  it("ne plante pas sur des réponses vides et départage par l'ordre canonique", () => {
    const r = computeResult({})
    expect(r.base).toBe(TYPE_IDS[0])
    expect(r.phase).toBe(TYPE_IDS[0])
    expect(r.immeuble).toEqual(TYPE_IDS)
  })
})

describe("deriveFromSocle", () => {
  it("dérive base = max et immeuble = tri décroissant (tie-break canonique)", () => {
    const socle: Record<TypeId, number> = {
      travaillomane: 30,
      perseverant: 30,
      empathique: 20,
      reveur: 10,
      rebelle: 6,
      promoteur: 4,
    }
    const { base, immeuble } = deriveFromSocle(socle)
    expect(base).toBe("travaillomane")
    expect(immeuble).toEqual([
      "travaillomane",
      "perseverant",
      "empathique",
      "reveur",
      "rebelle",
      "promoteur",
    ])
    expect(TYPE_IDS.indexOf(base)).toBeLessThan(TYPE_IDS.indexOf("perseverant"))
  })
})
