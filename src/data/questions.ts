import type { TypeId } from "./types"

export type Famille = "base" | "phase"

interface QuestionBase {
  id: string
  famille: Famille
}

export interface Option {
  label: string
  cible: TypeId
}

export interface ForcedChoice extends QuestionBase {
  kind: "forced"
  prompt: string
  options: [Option, Option, Option, Option]
}

export interface Likert extends QuestionBase {
  kind: "likert"
  statement: string
  cible: TypeId
}

export type Question = ForcedChoice | Likert

export const QUESTIONS: Question[] = [
  // ── Famille « base » : 12 choix forcés (4 options) ───────────────────
  {
    id: "b-fc-01",
    famille: "base",
    kind: "forced",
    prompt: "Quand je monte un meuble livré en kit, par nature je…",
    options: [
      { label: "lis toute la notice et trie les pièces avant la première vis.", cible: "travaillomane" },
      { label: "attaque direct sans la notice, c'est bien plus drôle d'improviser.", cible: "rebelle" },
      { label: "le monte nickel, même la face cachée, parce que le travail bâclé je ne supporte pas.", cible: "perseverant" },
      { label: "l'assemble en vitesse et envoie déjà une photo pour épater.", cible: "promoteur" },
    ],
  },
  {
    id: "b-fc-02",
    famille: "base",
    kind: "forced",
    prompt: "Pour organiser un dîner entre amis chez moi, le plus souvent je…",
    options: [
      { label: "verrouille le menu, les horaires et les courses bien en amont.", cible: "travaillomane" },
      { label: "choisis surtout les invités pour que le courant passe entre tout le monde.", cible: "empathique" },
      { label: "savoure longtemps l'ambiance dans ma tête avant de bouger le petit doigt.", cible: "reveur" },
      { label: "rameute la bande et vise une soirée dont on reparlera longtemps.", cible: "promoteur" },
    ],
  },
  {
    id: "b-fc-03",
    famille: "base",
    kind: "forced",
    prompt: "Au lancement d'un nouveau projet au travail, par nature je…",
    options: [
      { label: "liste d'abord les étapes et les infos qui me manquent.", cible: "travaillomane" },
      { label: "flaire le bon coup et pousse pour qu'on embarque sans attendre.", cible: "promoteur" },
      { label: "vérifie que l'objectif tient la route et mérite qu'on s'y donne.", cible: "perseverant" },
      { label: "fonce vers ce qui m'attire, sans me casser la tête.", cible: "rebelle" },
    ],
  },
  {
    id: "b-fc-04",
    famille: "base",
    kind: "forced",
    prompt: "Face à un problème compliqué, depuis toujours je…",
    options: [
      { label: "le découpe en petites questions claires pour avancer pas à pas.", cible: "travaillomane" },
      { label: "le laisse infuser tout seul en pensant à autre chose.", cible: "reveur" },
      { label: "capte d'abord ce que ça remue chez les gens autour.", cible: "empathique" },
      { label: "m'amuse à le retourner avec l'idée à contre-courant qui me vient.", cible: "rebelle" },
    ],
  },
  {
    id: "b-fc-05",
    famille: "base",
    kind: "forced",
    prompt: "Au moment de choisir un film pour la soirée, en général je…",
    options: [
      { label: "choisis un film qui porte un message qui me tient vraiment à cœur.", cible: "perseverant" },
      { label: "attrape le titre qui me tente à la seconde, sans réfléchir.", cible: "rebelle" },
      { label: "compare les avis et les notes avant de trancher.", cible: "travaillomane" },
      { label: "vise ce qui ferait plaisir à toute la tablée.", cible: "empathique" },
    ],
  },
  {
    id: "b-fc-06",
    famille: "base",
    kind: "forced",
    prompt: "Quand un collègue commet une erreur sur un dossier commun, par nature je…",
    options: [
      { label: "me demande surtout si le travail rendu restait honnête malgré tout.", cible: "perseverant" },
      { label: "jauge son état avant même d'aborder le sujet.", cible: "empathique" },
      { label: "laisse passer un peu de temps avant de réagir.", cible: "reveur" },
      { label: "vais droit au but pour rattraper le coup et repartir vite.", cible: "promoteur" },
    ],
  },
  {
    id: "b-fc-07",
    famille: "base",
    kind: "forced",
    prompt: "Dans une discussion animée entre amis, le plus souvent je…",
    options: [
      { label: "défends calmement le point de vue qui me semble le plus juste.", cible: "perseverant" },
      { label: "trouve l'argument qui frappe et relance le débat.", cible: "promoteur" },
      { label: "remets les faits au clair pour qu'on raisonne sur du concret.", cible: "travaillomane" },
      { label: "décroche du brouhaha et suis le fil de mes propres idées.", cible: "reveur" },
    ],
  },
  {
    id: "b-fc-08",
    famille: "base",
    kind: "forced",
    prompt: "En lisant une actualité qui me marque, depuis toujours je…",
    options: [
      { label: "me demande tout de suite si c'est droit et conforme à ce que je crois.", cible: "perseverant" },
      { label: "y repense seul, par bribes, bien des jours plus tard.", cible: "reveur" },
      { label: "pense aussitôt aux personnes touchées et à leur peine.", cible: "empathique" },
      { label: "réagis du tac au tac, souvent avec une pointe d'ironie.", cible: "rebelle" },
    ],
  },
  {
    id: "b-fc-09",
    famille: "base",
    kind: "forced",
    prompt: "En arrivant à une fête où je ne connais presque personne, par nature je…",
    options: [
      { label: "rejoins celui qui a l'air un peu isolé pour lui tenir compagnie.", cible: "empathique" },
      { label: "m'installe dans un coin pour observer la scène tranquillement.", cible: "reveur" },
      { label: "repère les rares personnes avec qui parler de vrais sujets.", cible: "travaillomane" },
      { label: "lance une vanne pour briser la glace et voir qui suit.", cible: "rebelle" },
    ],
  },
  {
    id: "b-fc-10",
    famille: "base",
    kind: "forced",
    prompt: "Quand un coéquipier perd visiblement sa motivation, en général je…",
    options: [
      { label: "m'assois avec lui pour comprendre ce qui le plombe.", cible: "empathique" },
      { label: "lui lance un défi concret qui rallume son énergie d'un coup.", cible: "promoteur" },
      { label: "lui rappelle l'engagement pris et la fierté de tenir bon.", cible: "perseverant" },
      { label: "prends de la hauteur et lui propose un autre angle de vue.", cible: "reveur" },
    ],
  },
  {
    id: "b-fc-11",
    famille: "base",
    kind: "forced",
    prompt: "Devant un dimanche après-midi entièrement libre, le plus souvent je…",
    options: [
      { label: "savoure de ne rien prévoir et laisse filer mon imagination.", cible: "reveur" },
      { label: "improvise une lubie sur un coup de tête, juste pour voir.", cible: "rebelle" },
      { label: "avance tranquillement sur ma liste et coche deux ou trois choses.", cible: "travaillomane" },
      { label: "appelle mes potes pour monter une sortie qui décoiffe.", cible: "promoteur" },
    ],
  },
  {
    id: "b-fc-12",
    famille: "base",
    kind: "forced",
    prompt: "Si un imprévu chamboule mon programme de voyage, par nature je…",
    options: [
      { label: "rebondis sur-le-champ et tourne le contretemps à mon avantage.", cible: "promoteur" },
      { label: "souris et bifurque ailleurs, l'imprévu rend le voyage savoureux.", cible: "rebelle" },
      { label: "garde le cap et trouve coûte que coûte comment tenir mon plan.", cible: "perseverant" },
      { label: "sonde l'humeur de chacun avant qu'on décide de la suite ensemble.", cible: "empathique" },
    ],
  },

  // ── Famille « base » : 6 Likert introspectifs ────────────────────────
  {
    id: "b-lk-01",
    famille: "base",
    kind: "likert",
    statement:
      "En général, j'ai besoin de comprendre la logique d'une chose et d'avoir les faits avant de me prononcer.",
    cible: "travaillomane",
  },
  {
    id: "b-lk-02",
    famille: "base",
    kind: "likert",
    statement:
      "Par nature, je juge les situations à l'aune de mes valeurs et de ce qui me paraît juste.",
    cible: "perseverant",
  },
  {
    id: "b-lk-03",
    famille: "base",
    kind: "likert",
    statement:
      "En général, je perçois vite l'humeur des gens et l'ambiance qui règne autour de moi.",
    cible: "empathique",
  },
  {
    id: "b-lk-04",
    famille: "base",
    kind: "likert",
    statement:
      "Depuis toujours, j'ai besoin de me retirer pour réfléchir et laisser vivre mon imaginaire.",
    cible: "reveur",
  },
  {
    id: "b-lk-05",
    famille: "base",
    kind: "likert",
    statement:
      "Par nature, je dis spontanément ce qui me plaît ou non, souvent avec une bonne dose d'humour.",
    cible: "rebelle",
  },
  {
    id: "b-lk-06",
    famille: "base",
    kind: "likert",
    statement:
      "En général, je vais droit au but et je me sens pleinement vivant quand il y a de l'action et un enjeu.",
    cible: "promoteur",
  },

  // ── Famille « phase » : 12 choix forcés (4 options) ──────────────────
  {
    id: "p-fc-01",
    famille: "phase",
    kind: "forced",
    prompt: "Après une semaine bien chargée, ces derniers temps, pour récupérer j'aurais surtout envie de…",
    options: [
      { label: "poser un cadre net, tout remettre en ordre et savourer le calme d'un espace bien rangé.", cible: "travaillomane" },
      { label: "tout lâcher, sortir sur un coup de tête et m'offrir un éclat de rire.", cible: "rebelle" },
      { label: "me recentrer sur l'essentiel et avancer dans la direction qui me semble juste.", cible: "perseverant" },
      { label: "plonger dans une activité grisante qui me regonfle à bloc.", cible: "promoteur" },
    ],
  },
  {
    id: "p-fc-02",
    famille: "phase",
    kind: "forced",
    prompt: "En ce moment, ce que j'aimerais le plus recevoir de mon entourage, c'est…",
    options: [
      { label: "qu'on remarque le soin et la rigueur que je mets dans mon travail.", cible: "travaillomane" },
      { label: "un peu de chaleur et d'attention pour qui je suis, tout simplement.", cible: "empathique" },
      { label: "qu'on me laisse respirer, sans rien attendre de moi pour l'instant.", cible: "reveur" },
      { label: "qu'on me suive sans hésiter quand je propose de foncer.", cible: "promoteur" },
    ],
  },
  {
    id: "p-fc-03",
    famille: "phase",
    kind: "forced",
    prompt: "Si une soirée se libérait cette semaine, là tout de suite j'aurais envie de…",
    options: [
      { label: "avancer méthodiquement sur un dossier et valider ce que j'avais planifié.", cible: "travaillomane" },
      { label: "me lancer dans quelque chose d'intense, avec une vraie pression à gérer.", cible: "promoteur" },
      { label: "m'engager pour une cause à laquelle je crois et défendre ce qui compte à mes yeux.", cible: "perseverant" },
      { label: "ne rien prévoir et suivre l'envie du moment, comme ça vient.", cible: "rebelle" },
    ],
  },
  {
    id: "p-fc-04",
    famille: "phase",
    kind: "forced",
    prompt: "Ce qui m'a le plus manqué ces dernières semaines, c'est…",
    options: [
      { label: "la satisfaction tranquille de voir mes tâches abouties et tout en ordre.", cible: "travaillomane" },
      { label: "des heures à moi pour laisser flotter mes pensées sans contrainte.", cible: "reveur" },
      { label: "ces instants simples où l'on se demande sincèrement comment va l'autre.", cible: "empathique" },
      { label: "un bon coup de folie, un fou rire qui sort de l'ordinaire.", cible: "rebelle" },
    ],
  },
  {
    id: "p-fc-05",
    famille: "phase",
    kind: "forced",
    prompt: "Pour une journée de congé qui approche, ces derniers temps j'aurais envie de…",
    options: [
      { label: "la mettre au service d'une cause qui me tient à cœur.", cible: "perseverant" },
      { label: "improviser et faire ce qui me chante, sans aucun programme.", cible: "rebelle" },
      { label: "la planifier dans le détail pour mieux la savourer ensuite.", cible: "travaillomane" },
      { label: "la passer entouré des miens, dans un moment où nos liens se resserrent.", cible: "empathique" },
    ],
  },
  {
    id: "p-fc-06",
    famille: "phase",
    kind: "forced",
    prompt: "Ce qui me ferait du bien au travail en ce moment, ce serait…",
    options: [
      { label: "qu'on reconnaisse l'engagement que je mets dans ce en quoi je crois.", cible: "perseverant" },
      { label: "des échanges plus humains, où l'on prenne le temps de se parler vraiment.", cible: "empathique" },
      { label: "un peu de répit pour réfléchir à ma façon, sans qu'on me presse.", cible: "reveur" },
      { label: "de l'action, des défis concrets à relever et la liberté de foncer.", cible: "promoteur" },
    ],
  },
  {
    id: "p-fc-07",
    famille: "phase",
    kind: "forced",
    prompt: "Devant un week-end prolongé qui s'annonce, là maintenant j'aurais envie de…",
    options: [
      { label: "m'investir dans quelque chose d'utile, fidèle à mes valeurs.", cible: "perseverant" },
      { label: "partir à l'aventure et vivre des moments forts, pleins d'adrénaline.", cible: "promoteur" },
      { label: "mener à terme une réalisation soignée et savourer le travail accompli.", cible: "travaillomane" },
      { label: "me retirer loin du bruit, avec tout le temps qu'il me faut pour rêver.", cible: "reveur" },
    ],
  },
  {
    id: "p-fc-08",
    famille: "phase",
    kind: "forced",
    prompt: "Si j'avais une matinée entière pour moi cette période, j'aimerais surtout…",
    options: [
      { label: "approfondir un combat qui compte et défendre ce en quoi je crois.", cible: "perseverant" },
      { label: "flâner seul, l'esprit libre, à laisser vagabonder mon imaginaire.", cible: "reveur" },
      { label: "m'offrir un vrai moment de douceur avec ceux qui me sont chers.", cible: "empathique" },
      { label: "céder à une lubie du moment, juste pour m'amuser un peu.", cible: "rebelle" },
    ],
  },
  {
    id: "p-fc-09",
    famille: "phase",
    kind: "forced",
    prompt: "En rentrant chez moi après une journée bien remplie, ces derniers temps j'aspire à…",
    options: [
      { label: "retrouver une présence affectueuse et un vrai moment de complicité.", cible: "empathique" },
      { label: "me poser dans mon coin pour me ressourcer en silence.", cible: "reveur" },
      { label: "régler ce qu'il me reste à faire avant de pouvoir décrocher.", cible: "travaillomane" },
      { label: "tout envoyer balader et m'amuser sans aucune contrainte.", cible: "rebelle" },
    ],
  },
  {
    id: "p-fc-10",
    famille: "phase",
    kind: "forced",
    prompt: "D'une retrouvaille avec mes proches qui se prépare, en ce moment j'attends surtout…",
    options: [
      { label: "de l'affection sincère et le sentiment d'être accueilli comme je suis.", cible: "empathique" },
      { label: "de l'énergie, du mouvement et quelque chose qui décoiffe ensemble.", cible: "promoteur" },
      { label: "de vrais échanges sincères, où chacun défend ce en quoi il croit.", cible: "perseverant" },
      { label: "un recoin paisible pour me poser, observer et savourer l'instant.", cible: "reveur" },
    ],
  },
  {
    id: "p-fc-11",
    famille: "phase",
    kind: "forced",
    prompt: "Quand un créneau de temps libre s'ouvre à l'improviste ces jours-ci, j'ai envie de…",
    options: [
      { label: "me glisser dans une bulle à moi, seul avec mon imaginaire.", cible: "reveur" },
      { label: "sauter sur l'occasion pour un truc léger et fun, là, tout de suite.", cible: "rebelle" },
      { label: "m'attaquer enfin à un projet concret qui me trotte en tête.", cible: "travaillomane" },
      { label: "tenter une expérience qui bouge, avec du monde autour.", cible: "promoteur" },
    ],
  },
  {
    id: "p-fc-12",
    famille: "phase",
    kind: "forced",
    prompt: "Ces derniers temps, pour me sentir vraiment bien, j'aurais surtout besoin de…",
    options: [
      { label: "relever un défi qui me pousse dans mes retranchements.", cible: "promoteur" },
      { label: "lâcher prise, rire et m'autoriser quelques fantaisies.", cible: "rebelle" },
      { label: "m'engager dans quelque chose qui a du sens et qu'on reconnaît.", cible: "perseverant" },
      { label: "de la tendresse et des instants doux avec ceux qui me sont chers.", cible: "empathique" },
    ],
  },

  // ── Famille « phase » : 6 Likert (besoin du moment) ──────────────────
  {
    id: "p-lk-01",
    famille: "phase",
    kind: "likert",
    statement:
      "Ces derniers temps, j'ai surtout besoin qu'on reconnaisse la qualité de mon travail et d'avoir des échéances et des repères clairs.",
    cible: "travaillomane",
  },
  {
    id: "p-lk-02",
    famille: "phase",
    kind: "likert",
    statement:
      "En ce moment, j'ai besoin que mes convictions et mon engagement soient reconnus et respectés.",
    cible: "perseverant",
  },
  {
    id: "p-lk-03",
    famille: "phase",
    kind: "likert",
    statement:
      "Ces derniers temps, j'ai surtout besoin qu'on me reconnaisse comme personne, avec de la chaleur et de l'attention.",
    cible: "empathique",
  },
  {
    id: "p-lk-04",
    famille: "phase",
    kind: "likert",
    statement:
      "En ce moment, j'ai particulièrement besoin de moments de solitude et de calme pour laisser vivre mon imaginaire.",
    cible: "reveur",
  },
  {
    id: "p-lk-05",
    famille: "phase",
    kind: "likert",
    statement:
      "Ces derniers temps, j'ai surtout besoin de légèreté, de jeu et de contacts qui me fassent rire.",
    cible: "rebelle",
  },
  {
    id: "p-lk-06",
    famille: "phase",
    kind: "likert",
    statement:
      "En ce moment, j'ai besoin d'action, de défis et d'intensité à vivre dans l'instant.",
    cible: "promoteur",
  },
]
