import { describe, it, expect } from "vitest"
import { STRESS_DECLENCHEUR, STRESS_REFLEXE, STRESS_RETOUR, composeStress } from "./stress"
import { TYPE_IDS } from "@/data/types"

describe("stress", () => {
  it("a des clauses non vides pour chaque type", () => {
    for (const t of TYPE_IDS) {
      expect(STRESS_DECLENCHEUR[t].length).toBeGreaterThan(0)
      expect(STRESS_REFLEXE[t].length).toBeGreaterThan(0)
      expect(STRESS_RETOUR[t].length).toBeGreaterThan(0)
    }
  })
  it("compose un texte substantiel pour toute paire base × phase", () => {
    for (const base of TYPE_IDS) for (const phase of TYPE_IDS) {
      expect(composeStress(base, phase).length).toBeGreaterThan(60)
    }
  })
  it("produit une variante spécifique quand base === phase", () => {
    expect(composeStress("empathique", "empathique")).not.toBe(composeStress("travaillomane", "empathique"))
  })
})
