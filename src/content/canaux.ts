import type { TypeId } from "@/data/types"

/**
 * Canal de communication par BASE — « comment on te parle le mieux ».
 * Une à deux phrases décrivant le registre que cette personne reçoit le plus
 * naturellement, ancré sur essenceBase / besoinPhase de chaque type.
 * Prose 100 % originale, voix de descriptions.ts (tutoiement, bienveillant).
 */
export const CANAUX: Record<TypeId, string> = {
  travaillomane:
    "On t'atteint le mieux par la clarté : des informations nettes, des faits vérifiables, un raisonnement qui se tient et un cadre où l'on sait où l'on va. Tu accueilles volontiers les questions précises, les chiffres, les consignes explicites et le temps de comprendre avant de t'engager. Va à l'essentiel mais structure ton propos, et tu te sentiras pleinement en phase.",
  perseverant:
    "On te touche en s'adressant à tes convictions : on te demande ton avis, on s'intéresse à ce en quoi tu crois, on respecte tes valeurs au lieu de les contourner. Tu reçois bien ce qui te reconnaît comme quelqu'un d'engagé et de fiable, à qui l'on fait confiance sur le fond. Parle-lui de sens et de principes, sincèrement, et son écoute s'ouvre en grand.",
  empathique:
    "On t'atteint le mieux par la chaleur : un ton doux, une attention sincère, le sentiment qu'on prend soin de toi en tant que personne et pas seulement de la tâche. Tu reçois pleinement ce qui est dit avec bienveillance, sans brusquerie, dans une relation où ta présence compte. Un mot gentil, un regard attentif, et le message passe d'autant mieux qu'il est porté avec tendresse.",
  reveur:
    "On te parle le mieux avec des consignes claires et beaucoup d'espace : on te dit posément ce qu'on attend, puis on te laisse le calme de t'y mettre à ton rythme. Tu reçois bien une demande simple et respectueuse, sans surenchère ni sollicitation pressante qui t'envahirait. Donne-lui une direction nette, du temps et de la tranquillité, et il avancera sans qu'on ait à le relancer.",
  rebelle:
    "On t'atteint le mieux sur le ton du jeu : une pointe d'humour, de la légèreté, une complicité où l'on peut réagir au quart de tour et rire ensemble. Tu reçois bien ce qui est vivant et spontané, ce qui te parle avec énergie plutôt qu'avec gravité. Glisse une touche de fantaisie, accueille ta vivacité au lieu de la brider, et l'échange devient tout de suite plus fluide.",
  promoteur:
    "On te parle le mieux en allant droit au but : un message direct, un enjeu réel à relever ici et maintenant, sans détours ni longs préambules. Tu reçois bien ce qui pose clairement le défi et te laisse l'espace de foncer. Annonce la couleur, dis ce qu'il y a à gagner, et tu seras déjà partie prenante avant la fin de la phrase.",
}
