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
    "Une remarque n'est pas un procès : avant de défendre ta position, vérifie si on attaque vraiment tes valeurs ou si on partage juste un avis",
  empathique:
    "Lire les besoins des autres n'oblige pas à oublier les tiens : ose dire non quand un oui te coûterait trop",
  reveur:
    "Prendre du recul est précieux, disparaître l'est moins : fais un petit pas vers les autres avant qu'on cesse de venir te chercher",
  rebelle:
    "Au lieu de te braquer quand ça coince, mets des mots sur ce qui te pèse : c'est plus léger à porter et plus clair pour les autres",
  promoteur:
    "Aller vite ouvre des portes, foncer en aveugle en referme : accorde-toi un temps d'arrêt pour préserver le rythme et les liens autour de toi",
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
