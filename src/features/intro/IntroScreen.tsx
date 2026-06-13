import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SplitLayout } from "@/components/SplitLayout"
import { ProfilExplainer } from "@/components/ProfilExplainer"

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <SplitLayout
      hideRightOnMobile
      left={
        <div className="flex flex-1 flex-col justify-center gap-6 max-md:items-center max-md:text-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">process gomme</h1>
            <p className="text-muted-foreground">
              36 questions, environ 5 minutes. Tout reste dans ton navigateur :
              aucune réponse n'est envoyée ni enregistrée.
            </p>
          </div>
          <Button size="lg" className="w-fit" onClick={onStart}>
            Commencer
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      }
      right={<ProfilExplainer />}
    />
  )
}
