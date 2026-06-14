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
      { label: "lis la notice du début à la fin et je trie les pièces une à une.", cible: "travaillomane" },
      { label: "laisse la notice de côté et je monte selon mon envie du moment.", cible: "rebelle" },
      { label: "le monte par principe jusqu'au bout, sans tricher même sur ce qui ne se voit pas.", cible: "perseverant" },
      { label: "vise le montage entier et je relève le défi sans m'arrêter.", cible: "promoteur" },
    ],
  },
  {
    id: "b-fc-02",
    famille: "base",
    kind: "forced",
    prompt: "Pour organiser un dîner entre amis chez moi, le plus souvent je…",
    options: [
      { label: "prépare le menu, les horaires et la liste des courses à l'avance.", cible: "travaillomane" },
      { label: "place chacun à table pour que tout le monde se sente bien.", cible: "empathique" },
      { label: "imagine l'ambiance dans ma tête avant de passer à la cuisine.", cible: "reveur" },
      { label: "rassemble tout le monde et lance une soirée pleine d'énergie.", cible: "promoteur" },
    ],
  },
  {
    id: "b-fc-03",
    famille: "base",
    kind: "forced",
    prompt: "Au lancement d'un nouveau projet au travail, par nature je…",
    options: [
      { label: "pose les étapes et repère les informations qui me manquent encore.", cible: "travaillomane" },
      { label: "saisis l'occasion et lance tout de suite la machine.", cible: "promoteur" },
      { label: "regarde si l'objectif tient debout et vaut vraiment qu'on s'engage.", cible: "perseverant" },
      { label: "suis ce qui m'attire et plonge là où l'envie me porte.", cible: "rebelle" },
    ],
  },
  {
    id: "b-fc-04",
    famille: "base",
    kind: "forced",
    prompt: "Face à un problème compliqué, depuis toujours je…",
    options: [
      { label: "le découpe en étapes claires et j'avance dans l'ordre.", cible: "travaillomane" },
      { label: "le mets de côté et je le laisse infuser dans ma tête.", cible: "reveur" },
      { label: "regarde d'abord ce qu'il provoque chez les gens autour.", cible: "empathique" },
      { label: "le retourne dans tous les sens avec l'idée du moment.", cible: "rebelle" },
    ],
  },
  {
    id: "b-fc-05",
    famille: "base",
    kind: "forced",
    prompt: "Au moment de choisir un film pour la soirée, en général je…",
    options: [
      { label: "choisis un film qui porte un message qui me tient à cœur.", cible: "perseverant" },
      { label: "choisis le film qui attire mon regard à cet instant précis.", cible: "rebelle" },
      { label: "choisis un film bien noté après avoir comparé les critiques.", cible: "travaillomane" },
      { label: "choisis un film qui rassemble les gens présents autour de moi.", cible: "empathique" },
    ],
  },
  {
    id: "b-fc-06",
    famille: "base",
    kind: "forced",
    prompt: "Quand un collègue commet une erreur sur un dossier commun, par nature je…",
    options: [
      { label: "regarde d'abord si le travail rendu tient debout sur le fond des choses.", cible: "perseverant" },
      { label: "regarde d'abord comment il traverse la situation et comment il le ressent.", cible: "empathique" },
      { label: "prends d'abord un temps de recul avant de dire quoi que ce soit.", cible: "reveur" },
      { label: "cherche d'abord comment reprendre le dossier en main et le relancer.", cible: "promoteur" },
    ],
  },
  {
    id: "b-fc-07",
    famille: "base",
    kind: "forced",
    prompt: "Dans une discussion animée entre amis, le plus souvent je…",
    options: [
      { label: "défends le point de vue qui me semble juste.", cible: "perseverant" },
      { label: "pousse mon idée et je relance le débat.", cible: "promoteur" },
      { label: "remets les faits en ordre pour clarifier le sujet.", cible: "travaillomane" },
      { label: "m'écarte du bruit et je suis le fil de mes idées.", cible: "reveur" },
    ],
  },
  {
    id: "b-fc-08",
    famille: "base",
    kind: "forced",
    prompt: "En lisant une actualité qui me marque, depuis toujours je…",
    options: [
      { label: "la confronte aussitôt à ce que je crois juste et important.", cible: "perseverant" },
      { label: "la laisse infuser et j'y repense seul quelques jours plus tard.", cible: "reveur" },
      { label: "pense d'abord aux personnes touchées et à ce qu'elles vivent.", cible: "empathique" },
      { label: "réagis dans l'instant, au gré de mon humeur du moment.", cible: "rebelle" },
    ],
  },
  {
    id: "b-fc-09",
    famille: "base",
    kind: "forced",
    prompt: "En arrivant à une fête où je ne connais presque personne, par nature je…",
    options: [
      { label: "repère une personne isolée et je viens lui parler tranquillement.", cible: "empathique" },
      { label: "m'installe un peu en retrait et j'observe l'ambiance se former.", cible: "reveur" },
      { label: "cherche un groupe où aborder un sujet un peu de fond.", cible: "travaillomane" },
      { label: "lance une remarque légère et je vois qui me répond.", cible: "rebelle" },
    ],
  },
  {
    id: "b-fc-10",
    famille: "base",
    kind: "forced",
    prompt: "Quand un coéquipier perd visiblement sa motivation, en général je…",
    options: [
      { label: "m'assois avec lui pour comprendre ce qui le traverse en ce moment.", cible: "empathique" },
      { label: "lui propose une action à mener pour remettre du mouvement maintenant.", cible: "promoteur" },
      { label: "lui rappelle l'engagement pris et le sens de tenir bon.", cible: "perseverant" },
      { label: "prends du recul et lui propose un autre angle sur la situation.", cible: "reveur" },
    ],
  },
  {
    id: "b-fc-11",
    famille: "base",
    kind: "forced",
    prompt: "Devant un dimanche après-midi entièrement libre, le plus souvent je…",
    options: [
      { label: "laisse les heures filer au gré de mon esprit et de mes envies vagues.", cible: "reveur" },
      { label: "suis l'envie du moment et me lance dans une idée venue d'un coup.", cible: "rebelle" },
      { label: "reprends ma liste et avance posément sur deux ou trois tâches en attente.", cible: "travaillomane" },
      { label: "appelle des amis et lance une sortie pour occuper l'après-midi ensemble.", cible: "promoteur" },
    ],
  },
  {
    id: "b-fc-12",
    famille: "base",
    kind: "forced",
    prompt: "Si un imprévu chamboule mon programme de voyage, par nature je…",
    options: [
      { label: "transforme ce contretemps en occasion et redessine la suite du voyage.", cible: "promoteur" },
      { label: "change de cap et improvise la suite au gré de mon envie.", cible: "rebelle" },
      { label: "garde mon cap et trouve comment respecter le programme prévu.", cible: "perseverant" },
      { label: "consulte le groupe et décide la suite ensemble avec chacun.", cible: "empathique" },
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
      { label: "mettre de l'ordre autour de moi et retrouver un espace clair et posé.", cible: "travaillomane" },
      { label: "suivre une envie du moment et m'offrir une parenthèse libre et légère.", cible: "rebelle" },
      { label: "revenir à l'essentiel et avancer dans la direction qui compte pour moi.", cible: "perseverant" },
      { label: "me lancer dans une activité physique et retrouver mon énergie du moment.", cible: "promoteur" },
    ],
  },
  {
    id: "p-fc-02",
    famille: "phase",
    kind: "forced",
    prompt: "En ce moment, ce que j'aimerais le plus recevoir de mon entourage, c'est…",
    options: [
      { label: "qu'on remarque le soin que je mets dans ce que je fais.", cible: "travaillomane" },
      { label: "qu'on prenne de mes nouvelles et qu'on s'intéresse à moi.", cible: "empathique" },
      { label: "qu'on me laisse du temps à moi, sans rien attendre en retour.", cible: "reveur" },
      { label: "qu'on me suive quand je décide de lancer les choses.", cible: "promoteur" },
    ],
  },
  {
    id: "p-fc-03",
    famille: "phase",
    kind: "forced",
    prompt: "Si une soirée se libérait cette semaine, là tout de suite j'aurais envie de…",
    options: [
      { label: "reprendre un projet et avancer méthodiquement selon mon plan.", cible: "travaillomane" },
      { label: "me lancer dans une activité prenante avec un objectif concret à atteindre.", cible: "promoteur" },
      { label: "défendre un sujet auquel je crois et faire valoir mon point de vue.", cible: "perseverant" },
      { label: "ne rien planifier du tout et suivre simplement l'envie du moment.", cible: "rebelle" },
    ],
  },
  {
    id: "p-fc-04",
    famille: "phase",
    kind: "forced",
    prompt: "Ce qui m'a le plus manqué ces dernières semaines, c'est…",
    options: [
      { label: "retrouver le calme d'une liste de tâches menées à leur terme.", cible: "travaillomane" },
      { label: "retrouver de longues heures à moi pour laisser flotter mes pensées.", cible: "reveur" },
      { label: "retrouver ces instants où l'on prend des nouvelles sincères les uns des autres.", cible: "empathique" },
      { label: "retrouver une part de spontanéité où je suis le mouvement du moment.", cible: "rebelle" },
    ],
  },
  {
    id: "p-fc-05",
    famille: "phase",
    kind: "forced",
    prompt: "Pour une journée de congé qui approche, ces derniers temps j'aurais envie de…",
    options: [
      { label: "la consacrer à une cause qui me semble juste et importante.", cible: "perseverant" },
      { label: "la vivre au gré de mes envies, sans aucun programme fixé.", cible: "rebelle" },
      { label: "la préparer point par point pour en tirer le meilleur.", cible: "travaillomane" },
      { label: "la partager avec les miens, dans un moment de vraie complicité.", cible: "empathique" },
    ],
  },
  {
    id: "p-fc-06",
    famille: "phase",
    kind: "forced",
    prompt: "Ce qui me ferait du bien au travail en ce moment, ce serait…",
    options: [
      { label: "sentir que l'on reconnaît l'engagement mis dans mon travail.", cible: "perseverant" },
      { label: "partager des moments d'échange où l'on se parle vraiment.", cible: "empathique" },
      { label: "trouver un peu de calme pour avancer à mon rythme.", cible: "reveur" },
      { label: "relever des projets concrets en gardant ma marge d'action.", cible: "promoteur" },
    ],
  },
  {
    id: "p-fc-07",
    famille: "phase",
    kind: "forced",
    prompt: "Devant un week-end prolongé qui s'annonce, là maintenant j'aurais envie de…",
    options: [
      { label: "m'investir dans un projet de fond, qui demande de la constance et de l'engagement.", cible: "perseverant" },
      { label: "me lancer dans une activité intense, qui demande de l'énergie et du nerf.", cible: "promoteur" },
      { label: "avancer pas à pas sur une réalisation précise, qui demande de la méthode et de la rigueur.", cible: "travaillomane" },
      { label: "me retirer dans un coin tranquille, qui laisse de la place à l'imaginaire et au calme.", cible: "reveur" },
    ],
  },
  {
    id: "p-fc-08",
    famille: "phase",
    kind: "forced",
    prompt: "Si j'avais une matinée entière pour moi cette période, j'aimerais surtout…",
    options: [
      { label: "avancer sur un sujet qui compte vraiment à mes yeux.", cible: "perseverant" },
      { label: "marcher seul au gré de mes pensées et de mon imagination.", cible: "reveur" },
      { label: "passer un moment tranquille avec les personnes qui m'entourent.", cible: "empathique" },
      { label: "suivre une envie du moment et voir où elle me mène.", cible: "rebelle" },
    ],
  },
  {
    id: "p-fc-09",
    famille: "phase",
    kind: "forced",
    prompt: "En rentrant chez moi après une journée bien remplie, ces derniers temps j'aspire à…",
    options: [
      { label: "passer un moment proche avec les personnes qui me sont familières.", cible: "empathique" },
      { label: "m'isoler dans un endroit paisible pour retrouver le fil de mes pensées.", cible: "reveur" },
      { label: "boucler les tâches en attente pour avoir l'esprit en ordre.", cible: "travaillomane" },
      { label: "suivre mes envies du moment sans me soucier des obligations.", cible: "rebelle" },
    ],
  },
  {
    id: "p-fc-10",
    famille: "phase",
    kind: "forced",
    prompt: "D'une retrouvaille avec mes proches qui se prépare, en ce moment j'attends surtout…",
    options: [
      { label: "ressentir une affection sincère et me sentir accueilli tel que je suis.", cible: "empathique" },
      { label: "lancer un élan commun et vivre un moment intense tous ensemble.", cible: "promoteur" },
      { label: "échanger franchement et défendre les choses qui comptent vraiment pour moi.", cible: "perseverant" },
      { label: "trouver un coin tranquille et savourer doucement chaque instant qui passe.", cible: "reveur" },
    ],
  },
  {
    id: "p-fc-11",
    famille: "phase",
    kind: "forced",
    prompt: "Quand un créneau de temps libre s'ouvre à l'improviste ces jours-ci, j'ai envie de…",
    options: [
      { label: "me poser dans un coin tranquille et laisser mes idées vagabonder à leur rythme.", cible: "reveur" },
      { label: "suivre l'envie qui passe et m'offrir un moment juste pour le plaisir.", cible: "rebelle" },
      { label: "reprendre un projet concret et faire avancer les choses étape par étape.", cible: "travaillomane" },
      { label: "me lancer dans une activité animée et bouger aux côtés des autres.", cible: "promoteur" },
    ],
  },
  {
    id: "p-fc-12",
    famille: "phase",
    kind: "forced",
    prompt: "Ces derniers temps, pour me sentir vraiment bien, j'aurais surtout besoin de…",
    options: [
      { label: "saisir une occasion d'agir et m'engager pleinement dans ce qui se présente.", cible: "promoteur" },
      { label: "suivre mes envies du moment et m'accorder des petits plaisirs spontanés.", cible: "rebelle" },
      { label: "défendre une cause qui correspond à mes valeurs et à mes convictions.", cible: "perseverant" },
      { label: "prendre soin des gens qui comptent et partager des moments attentifs.", cible: "empathique" },
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
