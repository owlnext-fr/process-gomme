import type { Answer, Answers } from "@/lib/scoring"
import { QUESTION_STRUCTURE } from "@/data/questions"
import type { Audience } from "@/data/audiences"

export type Screen = "intro" | "quiz" | "results"

export interface QuizState {
  screen: Screen
  index: number
  answers: Answers
  audience: Audience | null
}

export const initialState: QuizState = { screen: "intro", index: 0, answers: {}, audience: null }

export type Action =
  | { type: "start"; audience: Audience }
  | { type: "answer"; id: string; answer: Answer }
  | { type: "next" }
  | { type: "prev" }
  | { type: "restart" }

export function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "start":
      return { ...state, screen: "quiz", index: 0, audience: action.audience }
    case "answer":
      return { ...state, answers: { ...state.answers, [action.id]: action.answer } }
    case "next":
      if (state.index >= QUESTION_STRUCTURE.length - 1) return { ...state, screen: "results" }
      return { ...state, index: state.index + 1 }
    case "prev":
      return { ...state, index: Math.max(0, state.index - 1) }
    case "restart":
      return initialState
    default:
      return state
  }
}
