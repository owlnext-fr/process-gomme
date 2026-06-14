import { describe, it, expect } from "vitest"
import { shuffledIndices } from "./shuffle"

describe("shuffledIndices", () => {
  it("retourne une permutation de 0..n-1", () => {
    const out = shuffledIndices(4)
    expect([...out].sort((a, b) => a - b)).toEqual([0, 1, 2, 3])
  })

  it("est déterministe pour un rng donné", () => {
    // rng constant à 0 → Fisher-Yates reproductible
    expect(shuffledIndices(4, () => 0)).toEqual([1, 2, 3, 0])
  })

  it("gère les petits cas", () => {
    expect(shuffledIndices(0)).toEqual([])
    expect(shuffledIndices(1)).toEqual([0])
  })
})
