import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Anchor } from "lucide-react"
import { ResultSection } from "./ResultSection"

describe("ResultSection", () => {
  it("affiche le titre, le hint et le contenu", () => {
    render(
      <ResultSection titre="Mon titre" hint="Mon hint" icon={Anchor}>
        <p>Mon contenu</p>
      </ResultSection>,
    )
    expect(screen.getByRole("heading", { name: /mon titre/i })).toBeInTheDocument()
    expect(screen.getByText("Mon hint")).toBeInTheDocument()
    expect(screen.getByText("Mon contenu")).toBeInTheDocument()
  })
})
