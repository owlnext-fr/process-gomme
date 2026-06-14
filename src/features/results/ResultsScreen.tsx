import { lazy, Suspense } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareButton } from "@/components/ShareButton"
import type { DisplayResult } from "@/lib/scoring"
import { TYPES } from "@/data/types"
import { Immeuble } from "./Immeuble"
import { Synthese } from "./Synthese"
import { PlusLoin } from "./PlusLoin"

const RadarProfil = lazy(() =>
  import("./RadarProfil").then((m) => ({ default: m.RadarProfil })),
)

export function ResultsScreen({
  result,
  shared = false,
  onRestart,
}: {
  result: DisplayResult
  shared?: boolean
  onRestart: () => void
}) {
  return (
    <main className="min-h-svh w-full p-6 md:p-10">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Tes résultats</h1>
        <div className="flex gap-2">
          <ShareButton result={result} />
          {!shared && (
            <Button variant="outline" onClick={onRestart}>
              <RotateCcw className="size-4" aria-hidden />
              Recommencer
            </Button>
          )}
        </div>
      </header>

      {shared && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm text-muted-foreground">
            Tu regardes un profil partagé.
          </p>
          <Button onClick={onRestart}>Faire mon test</Button>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-100 p-5">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Ta base · ta phase
        </p>
        <p className="mt-1 text-xl font-semibold text-primary">
          {TYPES[result.base].nom} · {TYPES[result.phase].nom}
        </p>
      </div>

      <Tabs defaultValue="profil" className="mt-8">
        <TabsList>
          <TabsTrigger value="profil">Ton profil</TabsTrigger>
          <TabsTrigger value="plus">Pour aller plus loin</TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="flex w-full flex-col gap-8 md:sticky md:top-6 md:w-[38%]">
              <section className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold">Ton immeuble</h2>
                <p className="mt-1 mb-5 text-sm text-muted-foreground">
                  Tes six facettes empilées de la plus marquée (en bas) à la plus discrète.
                  La largeur reflète l'intensité ; l'étage encadré est ta phase actuelle.
                </p>
                <Immeuble immeuble={result.immeuble} socle={result.socle} phase={result.phase} />
              </section>
              <section className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold">Ton profil en relief</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  La même information vue d'ensemble : plus une branche s'étire, plus la
                  facette correspondante pèse dans ta manière de fonctionner.
                </p>
                <Suspense fallback={<div className="h-80 w-full" aria-label="Radar de ton profil" />}>
                  <RadarProfil socle={result.socle} />
                </Suspense>
              </section>
            </div>
            <div className="w-full md:flex-1">
              <div className="rounded-xl border bg-card p-6 md:p-8">
                <Synthese result={result} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plus">
          <div className="rounded-xl border bg-card p-6 md:p-8">
            <PlusLoin result={result} />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
