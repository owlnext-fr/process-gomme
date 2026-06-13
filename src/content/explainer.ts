export interface ExplainerSection {
  cle: "base" | "phase" | "immeuble"
  titre: string
  texte: string
  /** Pastille : token de couleur (cohérent avec TYPE_COLORS). */
  couleur: string
}

export const EXPLAINER_TITRE = "Comment lire ton profil"

export const EXPLAINER_SECTIONS: ExplainerSection[] = [
  {
    cle: "base",
    titre: "Ta base",
    texte:
      "Ta base, c'est ta façon la plus stable de percevoir le monde — celle qui bouge peu au fil de ta vie. Elle colore d'emblée ce à quoi tu prêtes attention et la manière dont tu entres en relation.",
    couleur: "var(--type-1)",
  },
  {
    cle: "phase",
    titre: "Ta phase",
    texte:
      "Ta phase, c'est ce qui te porte en ce moment : le moteur et les besoins du chapitre que tu traverses. Contrairement à la base, elle peut évoluer avec le temps et les expériences.",
    couleur: "var(--type-3)",
  },
  {
    cle: "immeuble",
    titre: "Ton immeuble",
    texte:
      "Ton immeuble, c'est l'agencement de tes six facettes, empilées de la plus présente à la plus discrète. Aucune n'est absente : c'est leur ordre qui te rend unique.",
    couleur: "var(--type-6)",
  },
]
