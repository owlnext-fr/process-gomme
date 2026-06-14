import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { QuizScreen } from "./QuizScreen"
import { QUESTIONS } from "@/data/questions"

const premierForced = QUESTIONS.findIndex((q) => q.kind === "forced")
const premierLikert = QUESTIONS.findIndex((q) => q.kind === "likert")

describe("QuizScreen", () => {
  it("désactive « Suivant » tant qu'un choix forcé n'est pas répondu", () => {
    const dispatch = vi.fn()
    render(
      <QuizScreen state={{ screen: "quiz", index: premierForced, answers: {} }} dispatch={dispatch} />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeDisabled()
  })

  it("active « Suivant » une fois le choix forcé répondu", () => {
    const q = QUESTIONS[premierForced]
    const dispatch = vi.fn()
    const cible = q.kind === "forced" ? q.options[0].cible : "travaillomane"
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierForced, answers: { [q.id]: { kind: "forced", cible } } }}
        dispatch={dispatch}
      />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeEnabled()
  })

  it("dispatch next au clic sur Suivant (réponse présente)", async () => {
    const user = userEvent.setup()
    const q = QUESTIONS[premierForced]
    const dispatch = vi.fn()
    const cible = q.kind === "forced" ? q.options[0].cible : "travaillomane"
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierForced, answers: { [q.id]: { kind: "forced", cible } } }}
        dispatch={dispatch}
      />,
    )
    await user.click(screen.getByRole("button", { name: /suivant|résultats/i }))
    expect(dispatch).toHaveBeenCalledWith({ type: "next" })
  })

  it("désactive « Suivant » tant qu'un Likert n'est pas répondu", () => {
    const dispatch = vi.fn()
    render(
      <QuizScreen state={{ screen: "quiz", index: premierLikert, answers: {} }} dispatch={dispatch} />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeDisabled()
  })

  it("active « Suivant » une fois le Likert répondu", () => {
    const q = QUESTIONS[premierLikert]
    const dispatch = vi.fn()
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierLikert, answers: { [q.id]: { kind: "likert", valeur: 4 } } }}
        dispatch={dispatch}
      />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeEnabled()
  })
})
