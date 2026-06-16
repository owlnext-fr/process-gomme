import { render, screen } from "@testing-library/react"
import { describe, it, expect, afterEach } from "vitest"
import App from "./App"
import { encodeResult } from "@/lib/shareCode"
import type { DisplayResult } from "@/lib/scoring"
import type { TypeId } from "@/data/types"

const socle: Record<TypeId, number> = {
  travaillomane: 34,
  perseverant: 22,
  empathique: 18,
  reveur: 12,
  rebelle: 8,
  promoteur: 6,
}
const result: DisplayResult = {
  socle,
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

afterEach(() => {
  window.history.replaceState({}, "", "/")
})

describe("App", () => {
  it("affiche l'écran d'intro avec les 3 cartes de public", () => {
    render(<App />)
    expect(screen.getByRole("heading", { name: /process gomme/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /enfant/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /étudiant/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /adulte/i })).toBeInTheDocument()
  })

  it("ouvre directement les résultats partagés quand ?r= est valide", () => {
    window.history.pushState({}, "", "?r=" + encodeResult(result))
    render(<App />)
    expect(screen.getByRole("heading", { name: /tes résultats/i })).toBeInTheDocument()
    expect(screen.getByText(/profil partagé/i)).toBeInTheDocument()
  })

  it("ignore un ?r= invalide et affiche l'intro", () => {
    window.history.pushState({}, "", "?r=corrompu!!!")
    render(<App />)
    expect(screen.getByRole("button", { name: /enfant/i })).toBeInTheDocument()
  })
})
