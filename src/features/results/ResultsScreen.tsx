import { lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { computeResult, type Answers } from "@/lib/scoring"
import { Immeuble } from "./Immeuble"
import { Synthese } from "./Synthese"

// Recharts est lourd et n'est utilisé que sur cet écran : on le charge à la demande
// (chunk séparé) pour alléger le bundle initial (intro + quiz).
const RadarProfil = lazy(() =>
  import("./RadarProfil").then((m) => ({ default: m.RadarProfil })),
)

export function ResultsScreen({
  answers,
  onRestart,
}: {
  answers: Answers
  onRestart: () => void
}) {
  const result = computeResult(answers)
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex w-full flex-col gap-8 md:sticky md:top-6 md:w-[38%]">
          <Immeuble immeuble={result.immeuble} socle={result.socle} phase={result.phase} />
          <Suspense fallback={<div className="h-64 w-full" aria-label="Radar de ton profil" />}>
            <RadarProfil socle={result.socle} />
          </Suspense>
        </div>
        <div className="w-full md:flex-1">
          <Synthese result={result} />
          <Button variant="outline" className="mt-8" onClick={onRestart}>
            Recommencer le test
          </Button>
        </div>
      </div>
    </main>
  )
}
