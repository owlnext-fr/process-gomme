import { QUESTION_STRUCTURE } from "@/data/questions"
import { TYPE_IDS, type TypeId } from "@/data/types"

export type Answer =
  | { kind: "forced"; cible: TypeId }
  | { kind: "likert"; valeur: 1 | 2 | 3 | 4 | 5 }

export type Answers = Record<string, Answer>

export interface ScoreResult {
  socle: Record<TypeId, number>
  motivation: Record<TypeId, number>
  base: TypeId
  phase: TypeId
  immeuble: TypeId[]
  baseEgalePhase: boolean
}

export type DisplayResult = Omit<ScoreResult, "motivation">

function vecteurNul(): Record<TypeId, number> {
  return Object.fromEntries(TYPE_IDS.map((t) => [t, 0])) as Record<TypeId, number>
}

function normaliser(v: Record<TypeId, number>): Record<TypeId, number> {
  const total = TYPE_IDS.reduce((s, t) => s + v[t], 0)
  const out = vecteurNul()
  if (total > 0) {
    for (const t of TYPE_IDS) out[t] = (v[t] / total) * 100
  }
  return out
}

function argmax(v: Record<TypeId, number>): TypeId {
  let best = TYPE_IDS[0]
  for (const t of TYPE_IDS) if (v[t] > v[best]) best = t
  return best
}

export function deriveFromSocle(socle: Record<TypeId, number>): {
  base: TypeId
  immeuble: TypeId[]
} {
  const base = argmax(socle)
  const immeuble = [...TYPE_IDS].sort(
    (a, b) => socle[b] - socle[a] || TYPE_IDS.indexOf(a) - TYPE_IDS.indexOf(b),
  )
  return { base, immeuble }
}

export function computeResult(answers: Answers): ScoreResult {
  const socleRaw = vecteurNul()
  const motivationRaw = vecteurNul()

  for (const q of QUESTION_STRUCTURE) {
    const cible = q.famille === "base" ? socleRaw : motivationRaw
    const a = answers[q.id]
    if (q.kind === "forced") {
      if (a && a.kind === "forced") cible[a.cible] += 1
    } else {
      const valeur = a && a.kind === "likert" ? a.valeur : 3
      cible[q.cible] += (valeur - 1) / 4
    }
  }

  const socle = normaliser(socleRaw)
  const motivation = normaliser(motivationRaw)
  const { base, immeuble } = deriveFromSocle(socle)
  const phase = argmax(motivation)

  return { socle, motivation, base, phase, immeuble, baseEgalePhase: base === phase }
}
