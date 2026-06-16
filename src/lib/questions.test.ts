import { describe, it, expect } from "vitest"
import { getQuestions } from "./questions"
import { QUESTION_STRUCTURE } from "@/data/questions"

describe("getQuestions", () => {
  it("rend 36 questions pour adulte, alignées sur la structure", () => {
    const qs = getQuestions("adulte")
    expect(qs).toHaveLength(QUESTION_STRUCTURE.length)
    qs.forEach((q, i) => {
      const s = QUESTION_STRUCTURE[i]
      expect(q.id).toBe(s.id)
      expect(q.kind).toBe(s.kind)
      expect(q.famille).toBe(s.famille)
    })
  })

  it("réassocie chaque label à sa cible, dans l'ordre canonique de la structure", () => {
    const qs = getQuestions("adulte")
    const q = qs.find((x) => x.id === "b-fc-01")
    expect(q?.kind).toBe("forced")
    if (q?.kind === "forced") {
      expect(q.options.map((o) => o.cible)).toEqual(["travaillomane", "rebelle", "perseverant", "promoteur"])
      expect(q.options[0].label.length).toBeGreaterThan(0)
    }
  })
})
