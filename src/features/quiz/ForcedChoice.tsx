import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-lg font-medium">{question.prompt}</legend>
      <RadioGroup value={valeur ?? ""} onValueChange={(v) => onChange(v as TypeId)}>
        {question.options.map((opt, i) => {
          const id = `${question.id}-${i}`
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent"
            >
              <RadioGroupItem id={id} value={opt.cible} />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </RadioGroup>
    </fieldset>
  )
}
