import { lazy, Suspense } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareButton } from "@/components/ShareButton"
import { ExportPdfButton } from "@/components/ExportPdfButton"
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
          <ExportPdfButton result={result} />
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

      <div className="mt-8 flex flex-col gap-8 pb-24 md:flex-row md:items-start md:pb-0">
        {/* Colonne gauche : pyramide + radar — toujours visibles, quel que soit l'onglet */}
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

        {/* Colonne droite : onglets qui basculent uniquement le texte */}
        <div className="w-full md:flex-1">
          <Tabs defaultValue="profil">
            <TabsList className="fixed inset-x-0 bottom-0 z-50 flex w-full justify-center gap-2 rounded-none border-t bg-background/95 p-2 !h-auto backdrop-blur md:static md:inset-auto md:bottom-auto md:z-auto md:w-fit md:gap-0 md:rounded-lg md:border-0 md:bg-muted md:p-[3px] md:!h-8 md:backdrop-blur-none">
              <TabsTrigger
                value="profil"
                className="min-h-12 flex-1 px-4 text-base md:min-h-0 md:flex-none md:px-1.5 md:text-sm"
              >
                Ton profil
              </TabsTrigger>
              <TabsTrigger
                value="plus"
                className="min-h-12 flex-1 px-4 text-base md:min-h-0 md:flex-none md:px-1.5 md:text-sm"
              >
                Pour aller plus loin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profil">
              <div className="rounded-xl border bg-card p-6 md:p-8">
                <Synthese result={result} />
              </div>
            </TabsContent>

            <TabsContent value="plus">
              <div className="rounded-xl border bg-card p-6 md:p-8">
                <PlusLoin result={result} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
