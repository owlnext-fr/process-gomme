import type { TypeId } from "@/data/types"

// Miroir hex des tokens --type-1..6 (thème clair) de src/index.css.
// @react-pdf/renderer ne peut pas lire les CSS vars → on duplique en hex.
// ⚠️ Garder en phase avec src/index.css (voir QUIRKS).
export const PDF_TYPE_COLORS: Record<TypeId, string> = {
  travaillomane: "#4f46e5",
  perseverant: "#7c3aed",
  empathique: "#be185d",
  reveur: "#0e7490",
  rebelle: "#b45309",
  promoteur: "#047857",
}
