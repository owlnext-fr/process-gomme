import type { TypeId } from "@/data/types"

/**
 * Déclencheur lié à la PHASE : ce qui fait monter la tension, c'est le besoin
 * du moment laissé sans réponse. Complète « Quand … , » → minuscule initiale,
 * pas de ponctuation finale, présent. Ancré sur `besoinPhase`.
 */
export const STRESS_DECLENCHEUR: Record<TypeId, string> = {
  travaillomane:
    "le soin que tu mets dans ton travail passe inaperçu et que les repères de temps deviennent flous",
  perseverant:
    "tes convictions sont balayées et que ton engagement n'est ni pris au sérieux ni respecté",
  empathique:
    "la chaleur disparaît autour de toi et que plus personne ne semble te reconnaître en tant que personne",
  reveur:
    "le calme et les moments à toi se font rares et que les sollicitations ne te laissent plus respirer",
  rebelle:
    "tout devient sérieux et contraint et qu'il n'y a plus la moindre place pour le jeu et la légèreté",
  promoteur:
    "tout s'enlise dans l'attente et que rien ne te donne le défi ni l'intensité dont tu as besoin",
}

/**
 * Réflexe lié à la BASE : le premier automatisme défensif sous tension, propre
 * au filtre perceptuel stable. Complète « ton premier réflexe : … » → minuscule
 * initiale, phrase complète terminée par un point. Ancré sur `essenceBase`.
 */
export const STRESS_REFLEXE: Record<TypeId, string> = {
  travaillomane:
    "tu resserres le contrôle, tu multiplies les vérifications et tu te noies dans les détails pour ne rien laisser au hasard.",
  perseverant:
    "tu te raidis sur tes principes, tu campes sur ta position et tu défends tes convictions comme si tout en dépendait.",
  empathique:
    "tu t'effaces pour arranger les autres, tu dis oui à contrecœur et tu fais passer leurs besoins avant les tiens.",
  reveur:
    "tu te retires dans ta bulle, tu coupes le contact et tu laisses le silence prendre toute la place.",
  rebelle:
    "tu te braques, tu résistes et tu fais retomber sur l'extérieur le poids de ce qui te pèse.",
  promoteur:
    "tu forces le passage, tu accélères et tu bouscules ce qui te ralentit pour reprendre la main.",
}

/**
 * Retour à l'équilibre lié à la PHASE : comment re-nourrir le besoin du moment.
 * Complète « Pour revenir à l'équilibre : … » → minuscule initiale, clause
 * infinitive/nominale terminée par un point. Ancré sur `besoinPhase`.
 */
export const STRESS_RETOUR: Record<TypeId, string> = {
  travaillomane:
    "remettre du cadre, te fixer des échéances nettes et demander qu'on reconnaisse la qualité de ce que tu produis.",
  perseverant:
    "retrouver des interlocuteurs qui prennent ton avis au sérieux et où ton engagement est accueilli plutôt que contesté.",
  empathique:
    "te rapprocher de personnes bienveillantes et accueillir, sans culpabiliser, les marques d'attention qui te disent que tu comptes.",
  reveur:
    "te ménager des bulles de solitude et de calme où tes pensées peuvent de nouveau vagabonder à ton rythme.",
  rebelle:
    "remettre du jeu et de l'humour dans ton quotidien et t'autoriser un vrai moment de légèreté.",
  promoteur:
    "te lancer un défi concret et passer à l'action sur quelque chose qui te rende l'intensité de l'instant.",
}

export function composeStress(base: TypeId, phase: TypeId): string {
  if (base === phase) {
    return (
      `Quand ${STRESS_DECLENCHEUR[phase]}, la tension monte d'autant plus que c'est aussi ton terrain de fond : ` +
      `ton premier réflexe : ${STRESS_REFLEXE[base]} ` +
      `Pour revenir à l'équilibre : ${STRESS_RETOUR[phase]}`
    )
  }
  return (
    `Quand ${STRESS_DECLENCHEUR[phase]}, ton premier réflexe : ${STRESS_REFLEXE[base]} ` +
    `Pour revenir à l'équilibre : ${STRESS_RETOUR[phase]}`
  )
}
