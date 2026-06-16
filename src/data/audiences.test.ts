import { describe, it, expect } from "vitest"
import { AUDIENCES, type Audience } from "./audiences"

describe("AUDIENCES", () => {
  it("liste exactement les 3 publics, dans l'ordre enfant → étudiant → adulte", () => {
    expect(AUDIENCES.map((a) => a.id)).toEqual<Audience[]>(["enfant", "etudiant", "adulte"])
  })

  it("chaque public a un label non vide et une icône", () => {
    for (const a of AUDIENCES) {
      expect(a.label.length).toBeGreaterThan(0)
      // lucide-react utilise forwardRef → typeof est "object", pas "function"
      expect(a.icon).toBeTruthy() // composant lucide (forwardRef wrappé)
    }
  })

  it("ids uniques", () => {
    const ids = AUDIENCES.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
