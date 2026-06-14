import { useReducer } from "react"
import { quizReducer, initialState } from "@/features/quiz/quizReducer"
import { computeResult } from "@/lib/scoring"
import { IntroScreen } from "@/features/intro/IntroScreen"
import { QuizScreen } from "@/features/quiz/QuizScreen"
import { ResultsScreen } from "@/features/results/ResultsScreen"

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  if (state.screen === "intro") {
    return <IntroScreen onStart={() => dispatch({ type: "start" })} />
  }
  if (state.screen === "quiz") {
    return <QuizScreen state={state} dispatch={dispatch} />
  }
  return (
    <ResultsScreen
      result={computeResult(state.answers)}
      onRestart={() => dispatch({ type: "restart" })}
    />
  )
}

export default App
