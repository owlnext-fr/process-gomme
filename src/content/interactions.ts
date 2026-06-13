import { TYPES, type TypeId } from "@/data/types"

export const IMMEUBLE_INTRO =
  "Imagine tes six types empilés comme les étages d'un même immeuble, rangés selon ton score : " +
  "tout en bas se tient ta base, l'étage fondateur, celui où tu te sens le plus chez toi et qui " +
  "porte ta façon la plus naturelle de percevoir le monde. Au-dessus s'élèvent les autres types, " +
  "des facettes plus discrètes à mesure qu'on monte, mais bien réelles : ce sont des ressources " +
  "que tu peux mobiliser selon les situations, même si elles te demandent un peu plus d'énergie. " +
  "Cet immeuble n'est pas un classement de valeur où le haut vaudrait mieux que le bas : c'est une " +
  "carte de tes appuis intérieurs, qui montre dans quel registre tu puises spontanément et lesquels " +
  "tu peux apprendre à solliciter. Aucun étage n'est de trop ; ensemble, ils dessinent la richesse " +
  "et la nuance de ta personnalité."

const CLAUSE_BASE: Record<TypeId, string> = {
  travaillomane:
    "tu cherches d'abord la structure, la logique et les faits, et tu as besoin de comprendre comment les choses s'articulent avant d'avancer.",
  perseverant:
    "tu lis chaque situation à travers tes valeurs et tes convictions, en jaugeant ce qui te paraît juste et digne de ton engagement.",
  empathique:
    "tu perçois avant tout l'émotion et le lien, attentif à l'ambiance et au confort des personnes qui t'entourent.",
  reveur:
    "tu prends naturellement du recul pour observer et imaginer, en laissant les idées mûrir dans ton univers intérieur.",
  rebelle:
    "tu réagis au monde avec spontanéité, au gré de ce que tu aimes ou non, en y mêlant volontiers humour et créativité.",
  promoteur:
    "tu repères d'instinct les opportunités et passes vite à l'action, direct et adaptable face à l'enjeu.",
}

const CLAUSE_PHASE: Record<TypeId, string> = {
  travaillomane:
    "tu as besoin que la qualité de ton travail soit reconnue et de disposer de repères de temps clairs pour te sentir solide.",
  perseverant:
    "tu as besoin que tes convictions et ton engagement soient reconnus et respectés par ceux qui t'entourent.",
  empathique:
    "tu as besoin d'être reconnu en tant que personne, avec de la chaleur et un contact bienveillant au quotidien.",
  reveur:
    "tu as besoin d'espaces de solitude et de calme pour laisser ton imaginaire respirer à son rythme.",
  rebelle:
    "tu as besoin de contact ludique, de jeu et de légèreté pour retrouver ton énergie.",
  promoteur:
    "tu as besoin d'action, de défi et d'intensité vécue dans l'instant pour te sentir pleinement vivant.",
}

export function composeInteraction(base: TypeId, phase: TypeId): string {
  if (base === phase) {
    return (
      `Ta base et ta phase se rejoignent sur ${TYPES[base].nom} : ${CLAUSE_BASE[base]} ` +
      `En ce moment, ${CLAUSE_PHASE[phase]} Cette cohérence te donne une grande clarté, ` +
      `à condition de veiller à ne pas t'enfermer dans un seul registre.`
    )
  }
  return (
    `Ta base ${TYPES[base].nom} fait que ${CLAUSE_BASE[base]} ` +
    `Mais ces derniers temps, ta phase ${TYPES[phase].nom} demande autre chose : ${CLAUSE_PHASE[phase]} ` +
    `Comprendre cet écart, c'est comprendre ce qui te porte aujourd'hui sans renier qui tu es au fond.`
  )
}
