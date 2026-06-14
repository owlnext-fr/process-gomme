import { ChoiceGroup } from "./ChoiceGroup"
import type { Likert as LikertQuestion } from "@/data/questions"

// Échelle d'accord. value = niveau (5 = tout à fait d'accord). Affichée en ordre DESCENDANT
// (adhésion forte en haut). Le scoring stocke la value, pas la position → ordre purement cosmétique.
const LIKERT_OPTIONS: { value: string; label: string }[] = [
  { value: "5", label: "Tout à fait d'accord" },
  { value: "4", label: "Plutôt d'accord" },
  { value: "3", label: "Mitigé" },
  { value: "2", label: "Plutôt pas d'accord" },
  { value: "1", label: "Pas du tout d'accord" },
]

export function LikertScale({
  question,
  valeur,
  onChange,
}: {
  question: LikertQuestion
  valeur: number | undefined
  onChange: (valeur: 1 | 2 | 3 | 4 | 5) => void
}) {
  return (
    <ChoiceGroup
      legend={question.statement}
      idPrefix={question.id}
      options={LIKERT_OPTIONS}
      value={valeur != null ? String(valeur) : undefined}
      onChange={(v) => onChange(Number(v) as 1 | 2 | 3 | 4 | 5)}
    />
  )
}
