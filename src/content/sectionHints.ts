/**
 * Phrases courtes rappelant à quoi correspond chaque concept, affichées dans
 * l'en-tête des sections de la synthèse de résultats. Volontairement distinctes
 * des textes de `explainer.ts` (registre « rappel contextuel », pas « glossaire
 * autonome ») : pas de préfixe « Ta base, c'est… » qui ferait doublon avec le titre.
 * Contenu 100 % original.
 */
export const SECTION_HINTS = {
  base: "Ta façon la plus stable de percevoir le monde, celle qui bouge peu au fil de ta vie.",
  phase:
    "Ce qui te porte en ce moment : le moteur et les besoins du chapitre que tu traverses.",
  immeuble:
    "L'agencement de tes six facettes, empilées de la plus présente à la plus discrète.",
  interactions:
    "Comment ta base et ta phase dialoguent au quotidien — parfois en accord, parfois en tension.",
} as const
