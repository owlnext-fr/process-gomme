export type TypeId =
  | "travaillomane"
  | "perseverant"
  | "empathique"
  | "reveur"
  | "rebelle"
  | "promoteur"

export interface TypeMeta {
  id: TypeId
  nom: string
  /** Filtre perceptuel stable (base) — formulation originale. */
  essenceBase: string
  /** Besoin psychologique du moment (phase) — formulation originale. */
  besoinPhase: string
}

export const TYPE_IDS: TypeId[] = [
  "travaillomane",
  "perseverant",
  "empathique",
  "reveur",
  "rebelle",
  "promoteur",
]

export const TYPES: Record<TypeId, TypeMeta> = {
  travaillomane: {
    id: "travaillomane",
    nom: "Travaillomane",
    essenceBase:
      "Lit le monde en pensées et en structures : il trie, planifie et cherche la logique et les faits avant d'avancer.",
    besoinPhase:
      "A besoin que la qualité de son travail soit reconnue et de disposer de repères de temps clairs.",
  },
  perseverant: {
    id: "perseverant",
    nom: "Persévérant",
    essenceBase:
      "Lit le monde en valeurs et en opinions : il jauge ce qui est juste, fiable et digne d'engagement.",
    besoinPhase:
      "A besoin que ses convictions et son engagement soient reconnus et respectés.",
  },
  empathique: {
    id: "empathique",
    nom: "Empathique",
    essenceBase:
      "Lit le monde en émotions et en liens : il ressent l'ambiance et prend soin de la relation.",
    besoinPhase:
      "A besoin d'être reconnu en tant que personne, avec de la chaleur et un contact bienveillant.",
  },
  reveur: {
    id: "reveur",
    nom: "Rêveur",
    essenceBase:
      "Lit le monde en images et en réflexions intérieures : il observe, imagine et prend du recul avant d'agir.",
    besoinPhase:
      "A besoin d'espaces de solitude et de calme pour laisser vivre son imaginaire.",
  },
  rebelle: {
    id: "rebelle",
    nom: "Rebelle",
    essenceBase:
      "Lit le monde en réactions « j'aime / j'aime pas » : spontané et créatif, il carbure au plaisir et à l'humour.",
    besoinPhase:
      "A besoin de contact ludique, de jeu et de légèreté dans son quotidien.",
  },
  promoteur: {
    id: "promoteur",
    nom: "Promoteur",
    essenceBase:
      "Lit le monde en actions et en opportunités : direct et charmeur, il fonce et s'adapte vite.",
    besoinPhase:
      "A besoin d'action, de défi et d'intensité vécue dans l'instant présent.",
  },
}

/**
 * Couleur d'affichage par type — SOURCE UNIQUE de vérité.
 * Consommée par le radar, la pyramide (immeuble) et le panneau d'explications.
 * Pointe vers les tokens CSS `--type-1..6` définis dans src/index.css.
 */
export const TYPE_COLORS: Record<TypeId, string> = {
  travaillomane: "var(--type-1)",
  perseverant: "var(--type-2)",
  empathique: "var(--type-3)",
  reveur: "var(--type-4)",
  rebelle: "var(--type-5)",
  promoteur: "var(--type-6)",
}
