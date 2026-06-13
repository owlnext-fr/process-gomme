import type { QuizState, Action } from "./quizReducer"

export function QuizScreen({ state, dispatch }: { state: QuizState; dispatch: React.Dispatch<Action> }) {
  return (
    <main className="p-6">
      <p>Quiz — question {state.index + 1}</p>
      <button onClick={() => dispatch({ type: "next" })}>Suivant</button>
    </main>
  )
}
