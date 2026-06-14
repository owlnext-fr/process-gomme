import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export function ResultSection({
  titre,
  hint,
  icon: Icon,
  children,
}: {
  titre: string
  hint: string
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Icon className="size-5 flex-none" aria-hidden />
          {titre}
        </h2>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}
