import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ProfilExplainer } from "./ProfilExplainer"
import { EXPLAINER_TITRE, EXPLAINER_SECTIONS } from "@/content/explainer"

describe("ProfilExplainer", () => {
  it("affiche le titre et les 3 sections", () => {
    render(<ProfilExplainer />)
    expect(screen.getByRole("heading", { name: EXPLAINER_TITRE })).toBeInTheDocument()
    for (const s of EXPLAINER_SECTIONS) {
      expect(screen.getByText(s.titre)).toBeInTheDocument()
    }
  })
})
