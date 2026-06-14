import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ChoiceGroup({
  legend,
  options,
  value,
  onChange,
  idPrefix,
}: {
  legend: string
  options: { value: string; label: string }[]
  value: string | undefined
  onChange: (value: string) => void
  idPrefix: string
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-lg font-medium">{legend}</legend>
      <RadioGroup value={value ?? ""} onValueChange={onChange}>
        {options.map((opt, i) => {
          const id = `${idPrefix}-${i}`
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent"
            >
              <RadioGroupItem id={id} value={opt.value} />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </RadioGroup>
    </fieldset>
  )
}
