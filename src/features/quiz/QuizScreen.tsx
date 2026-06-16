import { useMemo } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SplitLayout } from "@/components/SplitLayout"
import { ProfilExplainer } from "@/components/ProfilExplainer"
import { type Option } from "@/data/questions"
import { getQuestions } from "@/lib/questions"
import { shuffledIndices } from "@/lib/shuffle"
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
  const questions = useMemo(() => getQuestions(state.audience ?? "adulte"), [state.audience])
  const q = questions[state.index]
  const reponse = state.answers[q.id]
  const total = questions.length
  const reponseManquante = !reponse
  const derniere = state.index === total - 1

  // Ordre d'affichage des options mélangé une fois par session (stable pendant le quiz,
  // y compris en revenant en arrière). Cosmétique : le scoring se base sur le type choisi.
  const ordres = useMemo(
    () =>
      Object.fromEntries(
        questions.map((qq) => [
          qq.id,
          qq.kind === "forced" ? shuffledIndices(qq.options.length) : [],
        ]),
      ) as Record<string, number[]>,
    [questions],
  )

  return (
    <SplitLayout
      hideRightOnMobile
      left={
        <div className="flex flex-1 flex-col gap-8">
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
                  question={{
                    ...q,
                    options: ordres[q.id].map((i) => q.options[i]) as [
                      Option,
                      Option,
                      Option,
                      Option,
                    ],
                  }}
                  valeur={reponse?.kind === "forced" ? reponse.cible : undefined}
                  onChange={(cible) =>
                    dispatch({ type: "answer", id: q.id, answer: { kind: "forced", cible } })
                  }
                />
              ) : (
                <LikertScale
                  question={q}
                  valeur={reponse?.kind === "likert" ? reponse.valeur : undefined}
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
              <ChevronLeft className="size-4" aria-hidden />
              Précédent
            </Button>
            <Button onClick={() => dispatch({ type: "next" })} disabled={reponseManquante}>
              {derniere ? "Voir mes résultats" : "Suivant"}
              {derniere ? (
                <Sparkles className="size-4" aria-hidden />
              ) : (
                <ChevronRight className="size-4" aria-hidden />
              )}
            </Button>
          </div>
        </div>
      }
      right={<ProfilExplainer />}
    />
  )
}
