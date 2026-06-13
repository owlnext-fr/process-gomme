import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QUESTIONS } from "@/data/questions"
import type { QuizState, Action } from "./quizReducer"
import { ForcedChoice } from "./ForcedChoice"
import { LikertScale } from "./LikertScale"

export function QuizScreen({
  state,
  dispatch,
}: {
  state: QuizState
  dispatch: React.Dispatch<Action>
}) {
  const reduce = useReducedMotion()
  const q = QUESTIONS[state.index]
  const reponse = state.answers[q.id]
  const total = QUESTIONS.length
  const forcedManquant = q.kind === "forced" && !reponse

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <Progress value={((state.index + 1) / total) * 100} />
        <p className="text-sm text-muted-foreground">
          Question {state.index + 1} / {total}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          {q.kind === "forced" ? (
            <ForcedChoice
              question={q}
              valeur={reponse?.kind === "forced" ? reponse.cible : undefined}
              onChange={(cible) =>
                dispatch({ type: "answer", id: q.id, answer: { kind: "forced", cible } })
              }
            />
          ) : (
            <LikertScale
              question={q}
              valeur={reponse?.kind === "likert" ? reponse.valeur : 3}
              onChange={(valeur) =>
                dispatch({ type: "answer", id: q.id, answer: { kind: "likert", valeur } })
              }
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "prev" })}
          disabled={state.index === 0}
        >
          Précédent
        </Button>
        <Button onClick={() => dispatch({ type: "next" })} disabled={forcedManquant}>
          {state.index === total - 1 ? "Voir mes résultats" : "Suivant"}
        </Button>
      </div>
    </main>
  )
}
