import { describe, it, expect } from "vitest"
import { TYPES, TYPE_IDS } from "./types"

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
