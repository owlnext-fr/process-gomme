import type { TypeId } from "@/data/types"

/**
 * Ressource mobilisable à chaque étage de ton immeuble.
 * Une phrase courte par type, conçue pour s'afficher après le préfixe
 * « Nom — X% — » dans la liste « Ton immeuble ».
 * Plus l'étage est haut, plus la ressource est spontanée ; plus il est bas,
 * plus elle reste accessible mais demande un effort conscient.
 * Prose 100 % originale, voix des descriptions (tutoiement, bienveillant).
 */
export const ENERGIE: Record<TypeId, string> = {
  travaillomane:
    "tu y puises ta rigueur et ton sens de la structure pour clarifier le flou et remettre de l'ordre.",
  perseverant:
    "tu y trouves la fermeté de tes convictions et la loyauté qui te font tenir le cap.",
  empathique:
    "tu y captes ta chaleur et ton soin de la relation, cette écoute qui rassure les autres.",
  reveur:
    "tu y retrouves ton recul, ton imagination et ce calme intérieur qui éclaire les choses autrement.",
  rebelle:
    "tu y réveilles ta spontanéité, ton humour et ta créativité vive qui allègent l'instant.",
  promoteur:
    "tu y trouves ton audace et ton élan vers l'action, ce flair pour saisir l'opportunité.",
}
