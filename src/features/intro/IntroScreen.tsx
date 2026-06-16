import { AUDIENCES, type Audience } from "@/data/audiences"
import { SplitLayout } from "@/components/SplitLayout"
import { ProfilExplainer } from "@/components/ProfilExplainer"

export function IntroScreen({ onStart }: { onStart: (audience: Audience) => void }) {
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
          <div className="flex flex-col gap-3 max-md:w-full">
            <p className="text-sm font-medium">Pour qui ?</p>
            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
              {AUDIENCES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onStart(id)}
                  className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center transition hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-md:flex-row max-md:justify-center"
                >
                  <Icon className="size-8 text-primary" aria-hidden />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      right={<ProfilExplainer />}
    />
  )
}
