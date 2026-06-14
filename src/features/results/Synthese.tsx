import { Anchor, ArrowLeftRight, Building2, Compass, type LucideIcon } from "lucide-react"
import { TYPES, type TypeId } from "@/data/types"
import { DESCRIPTIONS } from "@/content/descriptions"
import { IMMEUBLE_INTRO, composeInteraction } from "@/content/interactions"
import { SECTION_HINTS } from "@/content/sectionHints"
import type { DisplayResult } from "@/lib/scoring"

function Section({
  titre,
  hint,
  icon: Icon,
  children,
}: {
  titre: string
  hint: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Icon className="size-5 flex-none" aria-hidden />
          {titre}
        </h2>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export function Synthese({ result }: { result: DisplayResult }) {
  const { base, phase, immeuble } = result
  return (
    <div className="flex flex-col gap-8">
      <Section titre={`Ta base — ${TYPES[base].nom}`} hint={SECTION_HINTS.base} icon={Anchor}>
        {DESCRIPTIONS[base].base}
      </Section>
      <Section titre={`Ta phase — ${TYPES[phase].nom}`} hint={SECTION_HINTS.phase} icon={Compass}>
        {DESCRIPTIONS[phase].phase}
      </Section>
      <Section titre="Ton immeuble" hint={SECTION_HINTS.immeuble} icon={Building2}>
        <p>{IMMEUBLE_INTRO}</p>
        <ol className="mt-2 list-decimal pl-5">
          {immeuble.map((t: TypeId) => (
            <li key={t}>
              {TYPES[t].nom} — {Math.round(result.socle[t])}%
            </li>
          ))}
        </ol>
      </Section>
      <Section
        titre="Interactions base × phase"
        hint={SECTION_HINTS.interactions}
        icon={ArrowLeftRight}
      >
        {composeInteraction(base, phase)}
      </Section>
    </div>
  )
}
