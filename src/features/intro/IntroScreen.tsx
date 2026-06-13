import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-3xl font-semibold">process gomme</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <p className="text-muted-foreground">
            Un petit inventaire de personnalité inspiré d'une logique en trois couches —
            ta base (ta manière stable de percevoir le monde), ta phase (ce qui te porte
            en ce moment) et ton immeuble (l'agencement de tes six facettes).
          </p>
          <p className="text-muted-foreground">
            36 questions, environ 5 minutes. Tout reste dans ton navigateur :
            aucune réponse n'est envoyée ni enregistrée.
          </p>
          <Button className="w-fit" onClick={onStart}>
            Commencer
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
