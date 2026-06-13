import { describe, it, expect } from "vitest"
import { TYPES, TYPE_IDS, TYPE_COLORS } from "./types"

describe("TYPES", () => {
  it("contient exactement les 6 types dans l'ordre canonique", () => {
    expect(TYPE_IDS).toEqual([
      "travaillomane",
      "perseverant",
      "empathique",
      "reveur",
      "rebelle",
      "promoteur",
    ])
  })

  it("chaque type a un nom, une essence base et un besoin phase non vides", () => {
    for (const id of TYPE_IDS) {
      const t = TYPES[id]
      expect(t.id).toBe(id)
      expect(t.nom.length).toBeGreaterThan(0)
      expect(t.essenceBase.length).toBeGreaterThan(20)
      expect(t.besoinPhase.length).toBeGreaterThan(20)
    }
  })

  it("les ids de TYPES correspondent à TYPE_IDS", () => {
    expect(Object.keys(TYPES).sort()).toEqual([...TYPE_IDS].sort())
  })
})

describe("TYPE_COLORS", () => {
  it("définit une couleur non vide pour chacun des 6 types", () => {
    expect(Object.keys(TYPE_COLORS).sort()).toEqual([...TYPE_IDS].sort())
    for (const id of TYPE_IDS) {
      expect(TYPE_COLORS[id]).toMatch(/^var\(--type-[1-6]\)$/)
    }
  })

  it("attribue une couleur distincte à chaque type", () => {
    const valeurs = TYPE_IDS.map((id) => TYPE_COLORS[id])
    expect(new Set(valeurs).size).toBe(TYPE_IDS.length)
  })
})
