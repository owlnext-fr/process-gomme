import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ShareButton } from "./ShareButton"
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

const writeText = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  writeText.mockReset()
  writeText.mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  })
})

describe("ShareButton", () => {
  it("copie l'URL contenant le code et affiche « Lien copié »", async () => {
    render(<ShareButton result={result} />)
    fireEvent.click(screen.getByRole("button", { name: /partager/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledTimes(1)
    })
    const url = writeText.mock.calls[0][0] as string
    expect(url).toContain("?r=" + encodeResult(result))
    expect(await screen.findByRole("button", { name: /lien copié/i })).toBeInTheDocument()
  })

  it("affiche « Copie impossible » si la copie échoue", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"))
    render(<ShareButton result={result} />)
    fireEvent.click(screen.getByRole("button", { name: /partager/i }))
    expect(
      await screen.findByRole("button", { name: /copie impossible/i }),
    ).toBeInTheDocument()
  })
})
