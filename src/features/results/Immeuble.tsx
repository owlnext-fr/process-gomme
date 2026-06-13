import { motion, useReducedMotion } from "motion/react"
import { TYPES, TYPE_COLORS, type TypeId } from "@/data/types"

export function Immeuble({
  immeuble,
  socle,
  phase,
}: {
  immeuble: TypeId[]
  socle: Record<TypeId, number>
  phase: TypeId
}) {
  const reduce = useReducedMotion()
  const max = Math.max(...immeuble.map((t) => socle[t]), 1)
  // `immeuble` est trié décroissant (index 0 = base, score max). On l'affiche en ascendant
  // pour que la base (score max) se retrouve EN BAS de la pile.
  const ordreAffichage = [...immeuble].reverse() // ascendant : dernier = base, tout en bas
  const n = ordreAffichage.length

  return (
    <div className="flex flex-col items-center gap-1.5" aria-label="Ton immeuble">
      {ordreAffichage.map((t, i) => {
        const largeur = 30 + (socle[t] / max) * 70 // 30%..100%
        const estPhase = t === phase
        // Construction de bas en haut : la base (i = n-1, tout en bas) apparaît en premier.
        const delai = reduce ? 0 : (n - 1 - i) * 0.12
        return (
          <motion.div
            key={t}
            initial={reduce ? false : { width: 0, opacity: 0 }}
            animate={{ width: `${largeur}%`, opacity: 1 }}
            transition={{ delay: delai, duration: 0.4, ease: "easeOut" }}
            style={{ backgroundColor: TYPE_COLORS[t] }}
            className={`flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-white ${
              estPhase ? "ring-2 ring-foreground ring-offset-2" : ""
            }`}
          >
            <span className="truncate">{TYPES[t].nom}</span>
            <span className="tabular-nums opacity-80">{Math.round(socle[t])}%</span>
          </motion.div>
        )
      })}
    </div>
  )
}
