import type { TypeId } from "./types"

export type Famille = "base" | "phase"

interface StructBase {
  id: string
  famille: Famille
}

/** Structure d'un choix forcé : 4 cibles distinctes (l'ordre = l'ordre canonique des options). */
export interface ForcedStruct extends StructBase {
  kind: "forced"
  cibles: [TypeId, TypeId, TypeId, TypeId]
}

export interface LikertStruct extends StructBase {
  kind: "likert"
  cible: TypeId
}

export type QuestionStruct = ForcedStruct | LikertStruct

// ── Types RÉSOLUS (avec texte) produits par getQuestions, consommés par l'UI ──
export interface Option {
  label: string
  cible: TypeId
}
export interface ForcedChoice extends StructBase {
  kind: "forced"
  prompt: string
  options: [Option, Option, Option, Option]
}
export interface Likert extends StructBase {
  kind: "likert"
  statement: string
  cible: TypeId
}
export type Question = ForcedChoice | Likert

export const QUESTION_STRUCTURE: QuestionStruct[] = [
  // ── base : 12 forcés ──
  { id: "b-fc-01", famille: "base", kind: "forced", cibles: ["travaillomane", "rebelle", "perseverant", "promoteur"] },
  { id: "b-fc-02", famille: "base", kind: "forced", cibles: ["travaillomane", "empathique", "reveur", "promoteur"] },
  { id: "b-fc-03", famille: "base", kind: "forced", cibles: ["travaillomane", "promoteur", "perseverant", "rebelle"] },
  { id: "b-fc-04", famille: "base", kind: "forced", cibles: ["travaillomane", "reveur", "empathique", "rebelle"] },
  { id: "b-fc-05", famille: "base", kind: "forced", cibles: ["perseverant", "rebelle", "travaillomane", "empathique"] },
  { id: "b-fc-06", famille: "base", kind: "forced", cibles: ["perseverant", "empathique", "reveur", "promoteur"] },
  { id: "b-fc-07", famille: "base", kind: "forced", cibles: ["perseverant", "promoteur", "travaillomane", "reveur"] },
  { id: "b-fc-08", famille: "base", kind: "forced", cibles: ["perseverant", "reveur", "empathique", "rebelle"] },
  { id: "b-fc-09", famille: "base", kind: "forced", cibles: ["empathique", "reveur", "travaillomane", "rebelle"] },
  { id: "b-fc-10", famille: "base", kind: "forced", cibles: ["empathique", "promoteur", "perseverant", "reveur"] },
  { id: "b-fc-11", famille: "base", kind: "forced", cibles: ["reveur", "rebelle", "travaillomane", "promoteur"] },
  { id: "b-fc-12", famille: "base", kind: "forced", cibles: ["promoteur", "rebelle", "perseverant", "empathique"] },
  // ── base : 6 Likert ──
  { id: "b-lk-01", famille: "base", kind: "likert", cible: "travaillomane" },
  { id: "b-lk-02", famille: "base", kind: "likert", cible: "perseverant" },
  { id: "b-lk-03", famille: "base", kind: "likert", cible: "empathique" },
  { id: "b-lk-04", famille: "base", kind: "likert", cible: "reveur" },
  { id: "b-lk-05", famille: "base", kind: "likert", cible: "rebelle" },
  { id: "b-lk-06", famille: "base", kind: "likert", cible: "promoteur" },
  // ── phase : 12 forcés ──
  { id: "p-fc-01", famille: "phase", kind: "forced", cibles: ["travaillomane", "rebelle", "perseverant", "promoteur"] },
  { id: "p-fc-02", famille: "phase", kind: "forced", cibles: ["travaillomane", "empathique", "reveur", "promoteur"] },
  { id: "p-fc-03", famille: "phase", kind: "forced", cibles: ["travaillomane", "promoteur", "perseverant", "rebelle"] },
  { id: "p-fc-04", famille: "phase", kind: "forced", cibles: ["travaillomane", "reveur", "empathique", "rebelle"] },
  { id: "p-fc-05", famille: "phase", kind: "forced", cibles: ["perseverant", "rebelle", "travaillomane", "empathique"] },
  { id: "p-fc-06", famille: "phase", kind: "forced", cibles: ["perseverant", "empathique", "reveur", "promoteur"] },
  { id: "p-fc-07", famille: "phase", kind: "forced", cibles: ["perseverant", "promoteur", "travaillomane", "reveur"] },
  { id: "p-fc-08", famille: "phase", kind: "forced", cibles: ["perseverant", "reveur", "empathique", "rebelle"] },
  { id: "p-fc-09", famille: "phase", kind: "forced", cibles: ["empathique", "reveur", "travaillomane", "rebelle"] },
  { id: "p-fc-10", famille: "phase", kind: "forced", cibles: ["empathique", "promoteur", "perseverant", "reveur"] },
  { id: "p-fc-11", famille: "phase", kind: "forced", cibles: ["reveur", "rebelle", "travaillomane", "promoteur"] },
  { id: "p-fc-12", famille: "phase", kind: "forced", cibles: ["promoteur", "rebelle", "perseverant", "empathique"] },
  // ── phase : 6 Likert ──
  { id: "p-lk-01", famille: "phase", kind: "likert", cible: "travaillomane" },
  { id: "p-lk-02", famille: "phase", kind: "likert", cible: "perseverant" },
  { id: "p-lk-03", famille: "phase", kind: "likert", cible: "empathique" },
  { id: "p-lk-04", famille: "phase", kind: "likert", cible: "reveur" },
  { id: "p-lk-05", famille: "phase", kind: "likert", cible: "rebelle" },
  { id: "p-lk-06", famille: "phase", kind: "likert", cible: "promoteur" },
]

// TRANSITOIRE — maintient les consommateurs existants verts jusqu'à leur migration (Task 3-5).
// Fusion locale (PAS d'import de lib/questions → pas de cycle). Retiré en Task 5.
import { ADULTE } from "@/content/questions/adulte"
import type { ForcedText, LikertText } from "@/content/questions/types"
export const QUESTIONS: Question[] = QUESTION_STRUCTURE.map((s): Question => {
  const t = ADULTE[s.id]
  if (s.kind === "forced") {
    const ft = t as ForcedText
    const options = s.cibles.map((c) => {
      const label = ft.labels[c]
      if (label === undefined) throw new Error(`Calque incomplet : label manquant pour ${s.id} / ${c}`)
      return { cible: c, label }
    }) as [Option, Option, Option, Option]
    return { id: s.id, famille: s.famille, kind: "forced", prompt: ft.prompt, options }
  }
  return { id: s.id, famille: s.famille, kind: "likert", cible: s.cible, statement: (t as LikertText).statement }
})
