import { QUESTION_STRUCTURE, type Option, type Question } from "@/data/questions"
import type { Audience } from "@/data/audiences"
import type { ForcedText, LikertText, QuestionText } from "@/content/questions/types"
import { ADULTE } from "@/content/questions/adulte"
import { ENFANT } from "@/content/questions/enfant"
import { ETUDIANT } from "@/content/questions/etudiant"

const CALQUES: Record<Audience, Record<string, QuestionText>> = {
  adulte: ADULTE,
  enfant: ENFANT,
  etudiant: ETUDIANT,
}

/** Fusionne le squelette avec le calque du public → questions résolues prêtes pour l'UI. */
export function getQuestions(audience: Audience): Question[] {
  const calque = CALQUES[audience]
  return QUESTION_STRUCTURE.map((s): Question => {
    const t = calque[s.id]
    if (s.kind === "forced") {
      const ft = t as ForcedText
      const options = s.cibles.map((c) => {
        const label = ft.labels[c]
        if (label === undefined) throw new Error(`Calque incomplet : label manquant pour ${s.id} / ${c}`)
        return { cible: c, label }
      }) as [Option, Option, Option, Option]
      return { id: s.id, famille: s.famille, kind: "forced", prompt: ft.prompt, options }
    }
    return { id: s.id, famille: s.famille, kind: "likert", cible: s.cible, statement: (t as LikertText).statement }
  })
}
