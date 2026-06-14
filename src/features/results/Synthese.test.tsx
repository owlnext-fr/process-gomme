import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Synthese } from "./Synthese"
import { SECTION_HINTS } from "@/content/sectionHints"
import type { ScoreResult } from "@/lib/scoring"
import type { TypeId } from "@/data/types"

const socle: Record<TypeId, number> = {
  travaillomane: 90,
  perseverant: 70,
  empathique: 60,
  reveur: 50,
  rebelle: 40,
  promoteur: 30,
}

const result: ScoreResult = {
  socle,
  motivation: socle,
  base: "travaillomane",
  phase: "empathique",
  immeuble: [
    "travaillomane",
    "perseverant",
    "empathique",
    "reveur",
    "rebelle",
    "promoteur",
  ],
  baseEgalePhase: false,
}

describe("Synthese", () => {
  it("affiche la phrase d'explication de chaque section", () => {
    render(<Synthese result={result} />)
    expect(screen.getByText(SECTION_HINTS.base)).toBeInTheDocument()
    expect(screen.getByText(SECTION_HINTS.phase)).toBeInTheDocument()
    expect(screen.getByText(SECTION_HINTS.immeuble)).toBeInTheDocument()
    expect(screen.getByText(SECTION_HINTS.interactions)).toBeInTheDocument()
  })
})
