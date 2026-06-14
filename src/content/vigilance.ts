import type { TypeId } from "@/data/types"

/**
 * Point de vigilance lié à la BASE : le piège récurrent du filtre perceptuel
 * stable, doublé d'un soupçon d'antidote. UNE phrase courte et actionnable
 * (~15-30 mots), distincte de la longue « zone de vigilance » des descriptions.
 * Ancré sur `essenceBase`. Initiale majuscule, sans point final.
 */
export const VIGILANCE_BASE: Record<TypeId, string> = {
  travaillomane:
    "Tout comprendre n'est pas tout décider : autorise-toi à trancher avec les pièces que tu as déjà, sans attendre le tableau parfait",
  perseverant:
    "Un avis qui diffère du tien n'est pas une menace mais un matériau : pose une question pour le comprendre avant d'en faire un débat de principes",
  empathique:
    "Avant de te mettre au service de l'échange, dis tôt ce que toi tu veux : un accord posé clairement vaut mieux qu'un arrangement deviné",
  reveur:
    "Tes idées n'ont pas à être finies pour valoir le partage : ose les déposer en chantier, c'est aussi une façon d'être là pour les autres",
  rebelle:
    "Plutôt que de laisser le ras-le-bol s'installer en sourdine, traduis-le en une proposition concrète : tu reprends la main au lieu de subir le cadre",
  promoteur:
    "Une victoire que tu portes seul rassemble moins qu'un cap partagé : explique où tu veux emmener les autres, ils avanceront avec toi, pas derrière",
}

/**
 * Point d'attention lié à la PHASE : ce sur quoi veiller en ce moment, en lien
 * direct avec le besoin du moment. UNE phrase courte (~15-30 mots), tournée
 * vers l'action. Ancré sur `besoinPhase`. Initiale majuscule, sans point final.
 */
export const VIGILANCE_PHASE: Record<TypeId, string> = {
  travaillomane:
    "N'attends pas qu'on devine la qualité de ton travail : demande la reconnaissance et les repères de temps clairs dont tu as besoin",
  perseverant:
    "Cherche des lieux où ton engagement est accueilli plutôt qu'à prouver : tu n'as pas à défendre tes convictions à chaque instant",
  empathique:
    "La chaleur que tu offres, tu as le droit d'en recevoir aussi : accueille les marques d'attention sans les juger superflues",
  reveur:
    "Protège tes bulles de calme comme un vrai besoin, pas comme un luxe : ménage-toi des moments à toi avant la saturation",
  rebelle:
    "Si tout devient sérieux autour de toi, réclame ta part de jeu : un peu de légèreté te recharge au lieu de te vider",
  promoteur:
    "Quand tout s'enlise, plutôt que de t'agiter à vide, vise un défi concret : choisis un terrain qui te rende l'intensité sans te brûler",
}

export function composeVigilance(
  base: TypeId,
  phase: TypeId,
): { base: string; phase: string } {
  return { base: VIGILANCE_BASE[base], phase: VIGILANCE_PHASE[phase] }
}
