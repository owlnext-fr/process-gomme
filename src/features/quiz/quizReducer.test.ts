import { describe, it, expect } from "vitest"
import { quizReducer, initialState, type QuizState } from "./quizReducer"
import { QUESTIONS } from "@/data/questions"

const DERNIER = QUESTIONS.length - 1

describe("quizReducer", () => {
  it("démarre sur l'intro", () => {
    expect(initialState.screen).toBe("intro")
    expect(initialState.index).toBe(0)
  })

  it("start passe au quiz à l'index 0", () => {
    const s = quizReducer(initialState, { type: "start" })
    expect(s.screen).toBe("quiz")
    expect(s.index).toBe(0)
  })

  it("answer enregistre la réponse par id", () => {
    const s = quizReducer({ ...initialState, screen: "quiz" }, {
      type: "answer",
      id: "b-fc-01",
      answer: { kind: "forced", cible: "rebelle" },
    })
    expect(s.answers["b-fc-01"]).toEqual({ kind: "forced", cible: "rebelle" })
  })

  it("next avance, prev recule, bornés", () => {
    let s: QuizState = { screen: "quiz", index: 0, answers: {} }
    s = quizReducer(s, { type: "next" })
    expect(s.index).toBe(1)
    s = quizReducer(s, { type: "prev" })
    expect(s.index).toBe(0)
    s = quizReducer(s, { type: "prev" })
    expect(s.index).toBe(0)
  })

  it("next sur la dernière question passe aux résultats", () => {
    const s = quizReducer({ screen: "quiz", index: DERNIER, answers: {} }, { type: "next" })
    expect(s.screen).toBe("results")
  })

  it("restart réinitialise tout", () => {
    const s = quizReducer(
      { screen: "results", index: DERNIER, answers: { x: { kind: "likert", valeur: 5 } } },
      { type: "restart" },
    )
    expect(s).toEqual(initialState)
  })
})
