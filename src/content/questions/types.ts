import type { TypeId } from "@/data/types"

/** Texte d'une question forcée : énoncé + label par cible. */
export interface ForcedText {
  prompt: string
  labels: Partial<Record<TypeId, string>>
}

/** Texte d'une question Likert : l'énoncé. */
export interface LikertText {
  statement: string
}

export type QuestionText = ForcedText | LikertText
