import { describe, it, expect } from "vitest"
import { ENERGIE } from "./energie"
import { TYPE_IDS } from "@/data/types"

describe("ENERGIE", () => {
  it("a une phrase pour chacun des 6 types", () => {
    expect(Object.keys(ENERGIE).sort()).toEqual([...TYPE_IDS].sort())
    for (const t of TYPE_IDS) {
      expect(ENERGIE[t].length).toBeGreaterThan(20)
    }
  })
})
