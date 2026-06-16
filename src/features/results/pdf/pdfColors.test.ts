import { describe, it, expect } from "vitest"
import { PDF_TYPE_COLORS } from "./pdfColors"
import { TYPE_IDS } from "@/data/types"

describe("PDF_TYPE_COLORS", () => {
  it("couvre exactement les 6 types", () => {
    expect(Object.keys(PDF_TYPE_COLORS).sort()).toEqual([...TYPE_IDS].sort())
  })
  it("chaque couleur est un hex #rrggbb", () => {
    for (const t of TYPE_IDS) expect(PDF_TYPE_COLORS[t]).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})
