import { TYPES, type TypeId } from "@/data/types"
import { DESCRIPTIONS } from "@/content/descriptions"
import { IMMEUBLE_INTRO, composeInteraction } from "@/content/interactions"
import type { ScoreResult } from "@/lib/scoring"

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">{titre}</h2>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export function Synthese({ result }: { result: ScoreResult }) {
  const { base, phase, immeuble } = result
  return (
    <div className="flex flex-col gap-8">
      <Section titre={`Ta base — ${TYPES[base].nom}`}>{DESCRIPTIONS[base].base}</Section>
      <Section titre={`Ta phase — ${TYPES[phase].nom}`}>{DESCRIPTIONS[phase].phase}</Section>
      <Section titre="Ton immeuble">
        <p>{IMMEUBLE_INTRO}</p>
        <ol className="mt-2 list-decimal pl-5">
          {immeuble.map((t: TypeId) => (
            <li key={t}>
              {TYPES[t].nom} — {Math.round(result.socle[t])}%
            </li>
          ))}
        </ol>
      </Section>
      <Section titre="Interactions base × phase">{composeInteraction(base, phase)}</Section>
    </div>
  )
}
