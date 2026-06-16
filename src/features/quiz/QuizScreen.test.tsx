import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { QuizScreen } from "./QuizScreen"
import { getQuestions } from "@/lib/questions"

const questions = getQuestions("adulte")
const premierForced = questions.findIndex((q) => q.kind === "forced")
const premierLikert = questions.findIndex((q) => q.kind === "likert")

describe("QuizScreen", () => {
  it("désactive « Suivant » tant qu'un choix forcé n'est pas répondu", () => {
    const dispatch = vi.fn()
    render(
      <QuizScreen state={{ screen: "quiz", index: premierForced, answers: {}, audience: "adulte" }} dispatch={dispatch} />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeDisabled()
  })

  it("active « Suivant » une fois le choix forcé répondu", () => {
    const q = questions[premierForced]
    const dispatch = vi.fn()
    const cible = q.kind === "forced" ? q.options[0].cible : "travaillomane"
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierForced, answers: { [q.id]: { kind: "forced", cible } }, audience: "adulte" }}
        dispatch={dispatch}
      />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeEnabled()
  })

  it("dispatch next au clic sur Suivant (réponse présente)", async () => {
    const user = userEvent.setup()
    const q = questions[premierForced]
    const dispatch = vi.fn()
    const cible = q.kind === "forced" ? q.options[0].cible : "travaillomane"
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierForced, answers: { [q.id]: { kind: "forced", cible } }, audience: "adulte" }}
        dispatch={dispatch}
      />,
    )
    await user.click(screen.getByRole("button", { name: /suivant|résultats/i }))
    expect(dispatch).toHaveBeenCalledWith({ type: "next" })
  })

  it("désactive « Suivant » tant qu'un Likert n'est pas répondu", () => {
    const dispatch = vi.fn()
    render(
      <QuizScreen state={{ screen: "quiz", index: premierLikert, answers: {}, audience: "adulte" }} dispatch={dispatch} />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeDisabled()
  })

  it("active « Suivant » une fois le Likert répondu", () => {
    const q = questions[premierLikert]
    const dispatch = vi.fn()
    render(
      <QuizScreen
        state={{ screen: "quiz", index: premierLikert, answers: { [q.id]: { kind: "likert", valeur: 4 } }, audience: "adulte" }}
        dispatch={dispatch}
      />,
    )
    expect(screen.getByRole("button", { name: /suivant|résultats/i })).toBeEnabled()
  })
})
