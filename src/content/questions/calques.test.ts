import { describe, it, expect } from "vitest"
import { AUDIENCES } from "@/data/audiences"
import { getQuestions } from "@/lib/questions"

describe("calques de questions — complétude par public", () => {
  for (const { id: audience } of AUDIENCES) {
    it(`${audience} : 36 questions, textes non vides, cibles préservées`, () => {
      const qs = getQuestions(audience)
      expect(qs).toHaveLength(36)
      for (const q of qs) {
        if (q.kind === "forced") {
          expect(q.prompt.trim().length).toBeGreaterThan(0)
          expect(q.options).toHaveLength(4)
          expect(new Set(q.options.map((o) => o.cible)).size).toBe(4)
          for (const o of q.options) expect(o.label.trim().length).toBeGreaterThan(0)
        } else {
          expect(q.statement.trim().length).toBeGreaterThan(0)
        }
      }
    })
  }

  it("enfant et étudiant diffèrent d'adulte sur la majorité des énoncés", () => {
    const adulte = getQuestions("adulte")
    for (const audience of ["enfant", "etudiant"] as const) {
      const autre = getQuestions(audience)
      const diff = adulte.filter((q, i) => {
        const t1 = q.kind === "forced" ? q.prompt : q.statement
        const o = autre[i]
        const t2 = o.kind === "forced" ? o.prompt : o.statement
        return t1 !== t2
      }).length
      expect(diff, `${audience} doit différer d'adulte`).toBeGreaterThan(adulte.length / 2)
    }
  })
})
