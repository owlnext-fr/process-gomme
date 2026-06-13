import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import App from "./App"

describe("App", () => {
  it("affiche le titre Hello et le sous-titre process gomme", () => {
    render(<App />)
    expect(
      screen.getByRole("heading", { name: /hello/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/process gomme/i)).toBeInTheDocument()
  })
})
