import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="font-heading text-3xl leading-snug font-medium">
            Hello 👋
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            process gomme — squelette déployé. Le contenu arrive aux blocs suivants.
          </p>
          <Button className="w-fit">Bientôt : le test</Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
