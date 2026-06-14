import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { PlusLoin } from "./PlusLoin"
import { CANAUX } from "@/content/canaux"
import type { DisplayResult } from "@/lib/scoring"
import type { TypeId } from "@/data/types"

const socle: Record<TypeId, number> = {
  travaillomane: 34, perseverant: 22, empathique: 18, reveur: 12, rebelle: 8, promoteur: 6,
}
const result: DisplayResult = {
  socle,
  base: "travaillomane",
  phase: "empathique",
  immeuble: ["travaillomane", "perseverant", "empathique", "reveur", "rebelle", "promoteur"],
  baseEgalePhase: false,
}

describe("PlusLoin", () => {
  it("affiche les 3 sections et le canal de la base", () => {
    render(<PlusLoin result={result} />)
    expect(screen.getByRole("heading", { name: /canal de communication/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /toi sous stress/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /points de vigilance/i })).toBeInTheDocument()
    expect(screen.getByText(CANAUX[result.base])).toBeInTheDocument()
  })
})
