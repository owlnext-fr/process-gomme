import { describe, it, expect } from "vitest"
import { composeInteraction, IMMEUBLE_INTRO } from "./interactions"
import { DESCRIPTIONS } from "./descriptions"
import { TYPE_IDS } from "@/data/types"

describe("DESCRIPTIONS", () => {
  it("a une description base et phase étoffée pour chaque type", () => {
    for (const t of TYPE_IDS) {
      expect(DESCRIPTIONS[t].base.length).toBeGreaterThan(120)
      expect(DESCRIPTIONS[t].phase.length).toBeGreaterThan(120)
    }
  })
})

describe("composeInteraction", () => {
  it("compose un texte non vide pour toute paire base/phase", () => {
    for (const b of TYPE_IDS) {
      for (const p of TYPE_IDS) {
        expect(composeInteraction(b, p).length).toBeGreaterThan(80)
      }
    }
  })

  it("produit une variante spécifique quand base === phase", () => {
    const egal = composeInteraction("reveur", "reveur")
    const diff = composeInteraction("reveur", "promoteur")
    expect(egal).not.toBe(diff)
  })
})

describe("IMMEUBLE_INTRO", () => {
  it("est un texte explicatif non vide", () => {
    expect(IMMEUBLE_INTRO.length).toBeGreaterThan(80)
  })
})
