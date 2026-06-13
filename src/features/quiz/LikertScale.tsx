import { Slider } from "@/components/ui/slider"
import type { Likert as LikertQuestion } from "@/data/questions"

export function LikertScale({
  question,
  valeur,
  onChange,
}: {
  question: LikertQuestion
  valeur: number
  onChange: (valeur: 1 | 2 | 3 | 4 | 5) => void
}) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="mb-1 text-lg font-medium">{question.statement}</legend>
      <Slider
        min={1}
        max={5}
        step={1}
        value={[valeur]}
        onValueChange={([v]) => onChange(v as 1 | 2 | 3 | 4 | 5)}
        aria-label="Niveau d'accord de 1 à 5"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Pas du tout</span>
        <span>Tout à fait</span>
      </div>
    </fieldset>
  )
}
