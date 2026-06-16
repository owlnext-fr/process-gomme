import { Briefcase, GraduationCap, ToyBrick, type LucideIcon } from "lucide-react"

export type Audience = "enfant" | "etudiant" | "adulte"

export interface AudienceMeta {
  id: Audience
  /** Label affiché sur la carte de l'accueil. */
  label: string
  icon: LucideIcon
}

export const AUDIENCES: AudienceMeta[] = [
  { id: "enfant", label: "Enfant", icon: ToyBrick },
  { id: "etudiant", label: "Étudiant", icon: GraduationCap },
  { id: "adulte", label: "Adulte", icon: Briefcase },
]
