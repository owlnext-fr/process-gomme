import { useReducer, useState } from "react"
import { quizReducer, initialState } from "@/features/quiz/quizReducer"
import { computeResult } from "@/lib/scoring"
import { readSharedFromLocation } from "@/lib/shareCode"
import { IntroScreen } from "@/features/intro/IntroScreen"
import { QuizScreen } from "@/features/quiz/QuizScreen"
import { ResultsScreen } from "@/features/results/ResultsScreen"

function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState)
  const [shared, setShared] = useState(() => readSharedFromLocation())

  if (shared) {
    return (
      <ResultsScreen
        result={shared}
        shared
        onRestart={() => {
          window.history.replaceState({}, "", import.meta.env.BASE_URL)
          setShared(null)
        }}
      />
    )
  }

  if (state.screen === "intro") {
    return <IntroScreen onStart={(audience) => dispatch({ type: "start", audience })} />
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
