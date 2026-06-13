import { lazy, Suspense } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { computeResult, type Answers } from "@/lib/scoring"
import { TYPES } from "@/data/types"
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
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Tes résultats</h1>
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden />
          Recommencer
        </Button>
      </header>

      <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-100 p-5">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Ta base · ta phase
        </p>
        <p className="mt-1 text-xl font-semibold text-primary">
          {TYPES[result.base].nom} · {TYPES[result.phase].nom}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex w-full flex-col gap-8 md:sticky md:top-6 md:w-[38%]">
          <Immeuble immeuble={result.immeuble} socle={result.socle} phase={result.phase} />
          <Suspense fallback={<div className="h-64 w-full" aria-label="Radar de ton profil" />}>
            <RadarProfil socle={result.socle} />
          </Suspense>
        </div>
        <div className="w-full md:flex-1">
          <Synthese result={result} />
        </div>
      </div>
    </main>
  )
}
