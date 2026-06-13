import { describe, it, expect } from "vitest"
import { EXPLAINER_TITRE, EXPLAINER_SECTIONS } from "./explainer"

describe("EXPLAINER", () => {
  it("a un titre non vide", () => {
    expect(EXPLAINER_TITRE.length).toBeGreaterThan(0)
  })

  it("contient exactement 3 sections (base, phase, immeuble) avec textes substantiels", () => {
    expect(EXPLAINER_SECTIONS.map((s) => s.cle)).toEqual(["base", "phase", "immeuble"])
    for (const s of EXPLAINER_SECTIONS) {
      expect(s.titre.length).toBeGreaterThan(0)
      expect(s.texte.length).toBeGreaterThan(40)
      expect(s.couleur).toMatch(/^var\(--type-[1-6]\)$/)
    }
  })
})
