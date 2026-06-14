import { CloudRain, Eye, MessageCircle } from "lucide-react"
import { ResultSection } from "@/components/ResultSection"
import { CANAUX } from "@/content/canaux"
import { composeStress } from "@/content/stress"
import { composeVigilance } from "@/content/vigilance"
import { SECTION_HINTS } from "@/content/sectionHints"
import type { DisplayResult } from "@/lib/scoring"

export function PlusLoin({ result }: { result: DisplayResult }) {
  const { base, phase } = result
  const vigilance = composeVigilance(base, phase)
  return (
    <div className="flex flex-col gap-8">
      <ResultSection titre="Ton canal de communication" hint={SECTION_HINTS.canal} icon={MessageCircle}>
        {CANAUX[base]}
      </ResultSection>
      <ResultSection titre="Toi sous stress" hint={SECTION_HINTS.stress} icon={CloudRain}>
        {composeStress(base, phase)}
      </ResultSection>
      <ResultSection titre="Points de vigilance" hint={SECTION_HINTS.vigilance} icon={Eye}>
        <ul className="flex flex-col gap-1.5 list-disc pl-5">
          <li>{vigilance.base}</li>
          <li>{vigilance.phase}</li>
        </ul>
      </ResultSection>
    </div>
  )
}
