import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { SplitLayout } from "./SplitLayout"

describe("SplitLayout", () => {
  it("rend les deux volets", () => {
    render(<SplitLayout left={<p>GAUCHE</p>} right={<p>DROITE</p>} />)
    expect(screen.getByText("GAUCHE")).toBeInTheDocument()
    expect(screen.getByText("DROITE")).toBeInTheDocument()
  })

  it("masque le volet droit en mobile quand hideRightOnMobile", () => {
    render(<SplitLayout left={<p>G</p>} right={<p>DROITE</p>} hideRightOnMobile />)
    // le wrapper du volet droit est masqué sous le breakpoint md (`max-md:hidden`)
    const droite = screen.getByText("DROITE").parentElement
    expect(droite?.className).toContain("max-md:hidden")
  })
})
