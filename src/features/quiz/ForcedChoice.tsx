import { ChoiceGroup } from "./ChoiceGroup"
import type { ForcedChoice as ForcedQuestion } from "@/data/questions"
import type { TypeId } from "@/data/types"

export function ForcedChoice({
  question,
  valeur,
  onChange,
}: {
  question: ForcedQuestion
  valeur: TypeId | undefined
  onChange: (cible: TypeId) => void
}) {
  return (
    <ChoiceGroup
      legend={question.prompt}
      idPrefix={question.id}
      options={question.options.map((opt) => ({ value: opt.cible, label: opt.label }))}
      value={valeur}
      onChange={(v) => onChange(v as TypeId)}
    />
  )
}
