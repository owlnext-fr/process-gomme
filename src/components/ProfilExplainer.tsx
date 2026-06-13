import { EXPLAINER_TITRE, EXPLAINER_SECTIONS } from "@/content/explainer"

export function ProfilExplainer({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`mx-auto w-full max-w-lg rounded-xl border border-indigo-200 bg-indigo-100 p-8 ${className}`}
      aria-label={EXPLAINER_TITRE}
    >
      <h2 className="text-lg font-semibold">{EXPLAINER_TITRE}</h2>
      <dl className="mt-4 flex flex-col gap-5">
        {EXPLAINER_SECTIONS.map((s) => (
          <div key={s.cle} className="flex gap-3">
            <span
              className="mt-1.5 size-3 flex-none rounded-full"
              style={{ backgroundColor: s.couleur }}
              aria-hidden
            />
            <div>
              <dt className="font-medium">{s.titre}</dt>
              <dd className="leading-relaxed text-muted-foreground">{s.texte}</dd>
            </div>
          </div>
        ))}
      </dl>
    </aside>
  )
}
