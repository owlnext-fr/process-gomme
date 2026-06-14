import { Anchor, ArrowLeftRight, Building2, Compass } from "lucide-react"
import { TYPES, type TypeId } from "@/data/types"
import { DESCRIPTIONS } from "@/content/descriptions"
import { ENERGIE } from "@/content/energie"
import { IMMEUBLE_INTRO, composeInteraction } from "@/content/interactions"
import { SECTION_HINTS } from "@/content/sectionHints"
import type { DisplayResult } from "@/lib/scoring"
import { ResultSection } from "@/components/ResultSection"

export function Synthese({ result }: { result: DisplayResult }) {
  const { base, phase, immeuble } = result
  return (
    <div className="flex flex-col gap-8">
      <ResultSection titre={`Ta base — ${TYPES[base].nom}`} hint={SECTION_HINTS.base} icon={Anchor}>
        {DESCRIPTIONS[base].base}
      </ResultSection>
      <ResultSection titre={`Ta phase — ${TYPES[phase].nom}`} hint={SECTION_HINTS.phase} icon={Compass}>
        {DESCRIPTIONS[phase].phase}
      </ResultSection>
      <ResultSection titre="Ton immeuble" hint={SECTION_HINTS.immeuble} icon={Building2}>
        <p>{IMMEUBLE_INTRO}</p>
        <ol className="mt-2 flex flex-col gap-1.5 list-decimal pl-5">
          {immeuble.map((t: TypeId) => (
            <li key={t}>
              <span className="font-medium text-foreground">
                {TYPES[t].nom} — {Math.round(result.socle[t])}%
              </span>{" "}
              — {ENERGIE[t]}
            </li>
          ))}
        </ol>
      </ResultSection>
      <ResultSection
        titre="Interactions base × phase"
        hint={SECTION_HINTS.interactions}
        icon={ArrowLeftRight}
      >
        {composeInteraction(base, phase)}
      </ResultSection>
    </div>
  )
}
