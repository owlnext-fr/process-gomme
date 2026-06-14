import { describe, it, expect } from "vitest"
import { SECTION_HINTS } from "./sectionHints"

describe("SECTION_HINTS", () => {
  it("contient exactement les 4 clés attendues", () => {
    expect(Object.keys(SECTION_HINTS)).toEqual([
      "base",
      "phase",
      "immeuble",
      "interactions",
    ])
  })

  it("a une phrase substantielle pour chaque clé", () => {
    for (const phrase of Object.values(SECTION_HINTS)) {
      expect(phrase.length).toBeGreaterThan(40)
    }
  })
})
