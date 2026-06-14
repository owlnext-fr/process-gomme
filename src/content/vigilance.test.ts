import { describe, it, expect } from "vitest"
import { VIGILANCE_BASE, VIGILANCE_PHASE, composeVigilance } from "./vigilance"
import { TYPE_IDS } from "@/data/types"

describe("vigilance", () => {
  it("a des punchlines non vides pour chaque type", () => {
    for (const t of TYPE_IDS) {
      expect(VIGILANCE_BASE[t].length).toBeGreaterThan(10)
      expect(VIGILANCE_PHASE[t].length).toBeGreaterThan(10)
    }
  })
  it("composeVigilance retourne 2 puces non vides pour toute paire", () => {
    for (const base of TYPE_IDS) for (const phase of TYPE_IDS) {
      const v = composeVigilance(base, phase)
      expect(v.base.length).toBeGreaterThan(10)
      expect(v.phase.length).toBeGreaterThan(10)
    }
  })
})
