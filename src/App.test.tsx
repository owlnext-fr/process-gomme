import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import App from "./App"

describe("App", () => {
  it("affiche l'écran d'intro avec un bouton Commencer", () => {
    render(<App />)
    expect(screen.getByRole("heading", { name: /process gomme/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /commencer/i })).toBeInTheDocument()
  })
})
