import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ExportPdfButton } from "./ExportPdfButton"
import type { DisplayResult } from "@/lib/scoring"
import type { TypeId } from "@/data/types"

const okBlob = async () => new Blob(["%PDF-1.7"], { type: "application/pdf" })
let toBlob: () => Promise<Blob> = okBlob

vi.mock("@react-pdf/renderer", () => ({
  pdf: () => ({ toBlob: () => toBlob() }),
}))
vi.mock("@/features/results/pdf/ResultPdfDocument", () => ({
  ResultPdfDocument: () => null,
}))

const socle: Record<TypeId, number> = {
  travaillomane: 34, perseverant: 22, empathique: 18, reveur: 12, rebelle: 8, promoteur: 6,
}
const result: DisplayResult = {
  socle, base: "travaillomane", phase: "empathique",
  immeuble: ["travaillomane", "perseverant", "empathique", "reveur", "rebelle", "promoteur"],
  baseEgalePhase: false,
}

describe("ExportPdfButton", () => {
  beforeEach(() => {
    toBlob = okBlob
    globalThis.URL.createObjectURL = vi.fn(() => "blob:fake")
    globalThis.URL.revokeObjectURL = vi.fn()
  })

  it("génère le PDF et déclenche un téléchargement nommé", async () => {
    const user = userEvent.setup()
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
    let captured: HTMLAnchorElement | undefined
    const realCreate = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = realCreate(tag) as HTMLElement
      if (tag === "a") captured = el as HTMLAnchorElement
      return el
    })

    render(<ExportPdfButton result={result} />)
    await user.click(screen.getByRole("button", { name: /exporter en pdf/i }))

    await waitFor(() => expect(click).toHaveBeenCalled())
    expect(globalThis.URL.createObjectURL).toHaveBeenCalled()
    expect(captured?.getAttribute("download")).toBe("process-gomme-travaillomane-empathique.pdf")

    vi.restoreAllMocks()
  })

  it("affiche « Export PDF impossible » et réactive le bouton si la génération échoue", async () => {
    const user = userEvent.setup()
    toBlob = async () => {
      throw new Error("boom")
    }

    render(<ExportPdfButton result={result} />)
    await user.click(screen.getByRole("button", { name: /exporter en pdf/i }))

    expect(await screen.findByText(/export pdf impossible/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /exporter en pdf/i })).toBeEnabled()
  })
})
