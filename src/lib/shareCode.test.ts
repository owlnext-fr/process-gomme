import { describe, it, expect } from "vitest"
import { encodeResult, decodeResult } from "./shareCode"
import type { DisplayResult } from "./scoring"
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

describe("shareCode", () => {
  it("round-trip : decode(encode(x)) reconstruit socle, phase, base et immeuble", () => {
    const decoded = decodeResult(encodeResult(result))
    expect(decoded).not.toBeNull()
    expect(decoded!.socle).toEqual(socle)
    expect(decoded!.phase).toBe("empathique")
    expect(decoded!.base).toBe("travaillomane")
    expect(decoded!.immeuble).toEqual(result.immeuble)
    expect(decoded!.baseEgalePhase).toBe(false)
  })

  it("produit un code URL-safe (pas de + / =)", () => {
    expect(encodeResult(result)).not.toMatch(/[+/=]/)
  })

  it("renvoie null sur un code invalide", () => {
    expect(decodeResult("")).toBeNull()
    expect(decodeResult("!!!pas-du-base64!!!")).toBeNull()
    expect(decodeResult(btoa(JSON.stringify({ s: [1, 2, 3], p: 0 })))).toBeNull()
    expect(decodeResult(btoa(JSON.stringify({ s: [0, 0, 0, 0, 0, 0], p: 9 })))).toBeNull()
    expect(decodeResult(btoa(JSON.stringify({ s: [0, 0, 0, 0, 0, 0], p: 0 })))).toBeNull() // socle tout à zéro
    expect(
      decodeResult(btoa(JSON.stringify({ s: [0, 0, 0, 0, 0, 200], p: 0 }))),
    ).toBeNull()
  })
})
