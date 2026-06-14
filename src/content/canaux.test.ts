import { describe, it, expect } from "vitest"
import { CANAUX } from "./canaux"
import { TYPE_IDS } from "@/data/types"

describe("CANAUX", () => {
  it("a un canal étoffé pour chacun des 6 types", () => {
    expect(Object.keys(CANAUX).sort()).toEqual([...TYPE_IDS].sort())
    for (const t of TYPE_IDS) {
      expect(CANAUX[t].length).toBeGreaterThan(60)
    }
  })
})
