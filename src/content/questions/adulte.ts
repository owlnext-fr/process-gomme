import type { QuestionText } from "./types"

export const ADULTE: Record<string, QuestionText> = {
  // ── base : 12 forcés ──
  "b-fc-01": {
    prompt: "Quand je monte un meuble livré en kit, par nature je…",
    labels: {
      travaillomane: "lis la notice du début à la fin et je trie les pièces une à une.",
      rebelle: "laisse la notice de côté et je monte selon mon envie du moment.",
      perseverant: "le monte par principe jusqu'au bout, sans tricher même sur ce qui ne se voit pas.",
      promoteur: "vise le montage entier et je relève le défi sans m'arrêter.",
    },
  },
  "b-fc-02": {
    prompt: "Pour organiser un dîner entre amis chez moi, le plus souvent je…",
    labels: {
      travaillomane: "prépare le menu, les horaires et la liste des courses à l'avance.",
      empathique: "place chacun à table pour que tout le monde se sente bien.",
      reveur: "imagine l'ambiance dans ma tête avant de passer à la cuisine.",
      promoteur: "rassemble tout le monde et lance une soirée pleine d'énergie.",
    },
  },
  "b-fc-03": {
    prompt: "Au lancement d'un nouveau projet au travail, par nature je…",
    labels: {
      travaillomane: "pose les étapes et repère les informations qui me manquent encore.",
      promoteur: "saisis l'occasion et lance tout de suite la machine.",
      perseverant: "regarde si l'objectif tient debout et vaut vraiment qu'on s'engage.",
      rebelle: "suis ce qui m'attire et plonge là où l'envie me porte.",
    },
  },
  "b-fc-04": {
    prompt: "Face à un problème compliqué, depuis toujours je…",
    labels: {
      travaillomane: "le découpe en étapes claires et j'avance dans l'ordre.",
      reveur: "le mets de côté et je le laisse infuser dans ma tête.",
      empathique: "regarde d'abord ce qu'il provoque chez les gens autour.",
      rebelle: "le retourne dans tous les sens avec l'idée du moment.",
    },
  },
  "b-fc-05": {
    prompt: "Au moment de choisir un film pour la soirée, en général je…",
    labels: {
      perseverant: "choisis un film qui porte un message qui me tient à cœur.",
      rebelle: "choisis le film qui attire mon regard à cet instant précis.",
      travaillomane: "choisis un film bien noté après avoir comparé les critiques.",
      empathique: "choisis un film qui rassemble les gens présents autour de moi.",
    },
  },
  "b-fc-06": {
    prompt: "Quand un collègue commet une erreur sur un dossier commun, par nature je…",
    labels: {
      perseverant: "regarde d'abord si le travail rendu tient debout sur le fond des choses.",
      empathique: "regarde d'abord comment il traverse la situation et comment il le ressent.",
      reveur: "prends d'abord un temps de recul avant de dire quoi que ce soit.",
      promoteur: "cherche d'abord comment reprendre le dossier en main et le relancer.",
    },
  },
  "b-fc-07": {
    prompt: "Dans une discussion animée entre amis, le plus souvent je…",
    labels: {
      perseverant: "défends le point de vue qui me semble juste.",
      promoteur: "pousse mon idée et je relance le débat.",
      travaillomane: "remets les faits en ordre pour clarifier le sujet.",
      reveur: "m'écarte du bruit et je suis le fil de mes idées.",
    },
  },
  "b-fc-08": {
    prompt: "En lisant une actualité qui me marque, depuis toujours je…",
    labels: {
      perseverant: "la confronte aussitôt à ce que je crois juste et important.",
      reveur: "la laisse infuser et j'y repense seul quelques jours plus tard.",
      empathique: "pense d'abord aux personnes touchées et à ce qu'elles vivent.",
      rebelle: "réagis dans l'instant, au gré de mon humeur du moment.",
    },
  },
  "b-fc-09": {
    prompt: "En arrivant à une fête où je ne connais presque personne, par nature je…",
    labels: {
      empathique: "repère une personne isolée et je viens lui parler tranquillement.",
      reveur: "m'installe un peu en retrait et j'observe l'ambiance se former.",
      travaillomane: "cherche un groupe où aborder un sujet un peu de fond.",
      rebelle: "lance une remarque légère et je vois qui me répond.",
    },
  },
  "b-fc-10": {
    prompt: "Quand un coéquipier perd visiblement sa motivation, en général je…",
    labels: {
      empathique: "m'assois avec lui pour comprendre ce qui le traverse en ce moment.",
      promoteur: "lui propose une action à mener pour remettre du mouvement maintenant.",
      perseverant: "lui rappelle l'engagement pris et le sens de tenir bon.",
      reveur: "prends du recul et lui propose un autre angle sur la situation.",
    },
  },
  "b-fc-11": {
    prompt: "Devant un dimanche après-midi entièrement libre, le plus souvent je…",
    labels: {
      reveur: "laisse les heures filer au gré de mon esprit et de mes envies vagues.",
      rebelle: "suis l'envie du moment et me lance dans une idée venue d'un coup.",
      travaillomane: "reprends ma liste et avance posément sur deux ou trois tâches en attente.",
      promoteur: "appelle des amis et lance une sortie pour occuper l'après-midi ensemble.",
    },
  },
  "b-fc-12": {
    prompt: "Si un imprévu chamboule mon programme de voyage, par nature je…",
    labels: {
      promoteur: "transforme ce contretemps en occasion et redessine la suite du voyage.",
      rebelle: "change de cap et improvise la suite au gré de mon envie.",
      perseverant: "garde mon cap et trouve comment respecter le programme prévu.",
      empathique: "consulte le groupe et décide la suite ensemble avec chacun.",
    },
  },

  // ── base : 6 Likert ──
  "b-lk-01": {
    statement:
      "En général, j'ai besoin de comprendre la logique d'une chose et d'avoir les faits avant de me prononcer.",
  },
  "b-lk-02": {
    statement:
      "Par nature, je juge les situations à l'aune de mes valeurs et de ce qui me paraît juste.",
  },
  "b-lk-03": {
    statement:
      "En général, je perçois vite l'humeur des gens et l'ambiance qui règne autour de moi.",
  },
  "b-lk-04": {
    statement:
      "Depuis toujours, j'ai besoin de me retirer pour réfléchir et laisser vivre mon imaginaire.",
  },
  "b-lk-05": {
    statement:
      "Par nature, je dis spontanément ce qui me plaît ou non, souvent avec une bonne dose d'humour.",
  },
  "b-lk-06": {
    statement:
      "En général, je vais droit au but et je me sens pleinement vivant quand il y a de l'action et un enjeu.",
  },

  // ── phase : 12 forcés ──
  "p-fc-01": {
    prompt: "Après une semaine bien chargée, ces derniers temps, pour récupérer j'aurais surtout envie de…",
    labels: {
      travaillomane: "mettre de l'ordre autour de moi et retrouver un espace clair et posé.",
      rebelle: "suivre une envie du moment et m'offrir une parenthèse libre et légère.",
      perseverant: "revenir à l'essentiel et avancer dans la direction qui compte pour moi.",
      promoteur: "me lancer dans une activité physique et retrouver mon énergie du moment.",
    },
  },
  "p-fc-02": {
    prompt: "En ce moment, ce que j'aimerais le plus recevoir de mon entourage, c'est…",
    labels: {
      travaillomane: "qu'on remarque le soin que je mets dans ce que je fais.",
      empathique: "qu'on prenne de mes nouvelles et qu'on s'intéresse à moi.",
      reveur: "qu'on me laisse du temps à moi, sans rien attendre en retour.",
      promoteur: "qu'on me suive quand je décide de lancer les choses.",
    },
  },
  "p-fc-03": {
    prompt: "Si une soirée se libérait cette semaine, là tout de suite j'aurais envie de…",
    labels: {
      travaillomane: "reprendre un projet et avancer méthodiquement selon mon plan.",
      promoteur: "me lancer dans une activité prenante avec un objectif concret à atteindre.",
      perseverant: "défendre un sujet auquel je crois et faire valoir mon point de vue.",
      rebelle: "ne rien planifier du tout et suivre simplement l'envie du moment.",
    },
  },
  "p-fc-04": {
    prompt: "Ce qui m'a le plus manqué ces dernières semaines, c'est…",
    labels: {
      travaillomane: "retrouver le calme d'une liste de tâches menées à leur terme.",
      reveur: "retrouver de longues heures à moi pour laisser flotter mes pensées.",
      empathique: "retrouver ces instants où l'on prend des nouvelles sincères les uns des autres.",
      rebelle: "retrouver une part de spontanéité où je suis le mouvement du moment.",
    },
  },
  "p-fc-05": {
    prompt: "Pour une journée de congé qui approche, ces derniers temps j'aurais envie de…",
    labels: {
      perseverant: "la consacrer à une cause qui me semble juste et importante.",
      rebelle: "la vivre au gré de mes envies, sans aucun programme fixé.",
      travaillomane: "la préparer point par point pour en tirer le meilleur.",
      empathique: "la partager avec les miens, dans un moment de vraie complicité.",
    },
  },
  "p-fc-06": {
    prompt: "Ce qui me ferait du bien au travail en ce moment, ce serait…",
    labels: {
      perseverant: "sentir que l'on reconnaît l'engagement mis dans mon travail.",
      empathique: "partager des moments d'échange où l'on se parle vraiment.",
      reveur: "trouver un peu de calme pour avancer à mon rythme.",
      promoteur: "relever des projets concrets en gardant ma marge d'action.",
    },
  },
  "p-fc-07": {
    prompt: "Devant un week-end prolongé qui s'annonce, là maintenant j'aurais envie de…",
    labels: {
      perseverant: "m'investir dans un projet de fond, qui demande de la constance et de l'engagement.",
      promoteur: "me lancer dans une activité intense, qui demande de l'énergie et du nerf.",
      travaillomane: "avancer pas à pas sur une réalisation précise, qui demande de la méthode et de la rigueur.",
      reveur: "me retirer dans un coin tranquille, qui laisse de la place à l'imaginaire et au calme.",
    },
  },
  "p-fc-08": {
    prompt: "Si j'avais une matinée entière pour moi cette période, j'aimerais surtout…",
    labels: {
      perseverant: "avancer sur un sujet qui compte vraiment à mes yeux.",
      reveur: "marcher seul au gré de mes pensées et de mon imagination.",
      empathique: "passer un moment tranquille avec les personnes qui m'entourent.",
      rebelle: "suivre une envie du moment et voir où elle me mène.",
    },
  },
  "p-fc-09": {
    prompt: "En rentrant chez moi après une journée bien remplie, ces derniers temps j'aspire à…",
    labels: {
      empathique: "passer un moment proche avec les personnes qui me sont familières.",
      reveur: "m'isoler dans un endroit paisible pour retrouver le fil de mes pensées.",
      travaillomane: "boucler les tâches en attente pour avoir l'esprit en ordre.",
      rebelle: "suivre mes envies du moment sans me soucier des obligations.",
    },
  },
  "p-fc-10": {
    prompt: "D'une retrouvaille avec mes proches qui se prépare, en ce moment j'attends surtout…",
    labels: {
      empathique: "ressentir une affection sincère et me sentir accueilli tel que je suis.",
      promoteur: "lancer un élan commun et vivre un moment intense tous ensemble.",
      perseverant: "échanger franchement et défendre les choses qui comptent vraiment pour moi.",
      reveur: "trouver un coin tranquille et savourer doucement chaque instant qui passe.",
    },
  },
  "p-fc-11": {
    prompt: "Quand un créneau de temps libre s'ouvre à l'improviste ces jours-ci, j'ai envie de…",
    labels: {
      reveur: "me poser dans un coin tranquille et laisser mes idées vagabonder à leur rythme.",
      rebelle: "suivre l'envie qui passe et m'offrir un moment juste pour le plaisir.",
      travaillomane: "reprendre un projet concret et faire avancer les choses étape par étape.",
      promoteur: "me lancer dans une activité animée et bouger aux côtés des autres.",
    },
  },
  "p-fc-12": {
    prompt: "Ces derniers temps, pour me sentir vraiment bien, j'aurais surtout besoin de…",
    labels: {
      promoteur: "saisir une occasion d'agir et m'engager pleinement dans ce qui se présente.",
      rebelle: "suivre mes envies du moment et m'accorder des petits plaisirs spontanés.",
      perseverant: "défendre une cause qui correspond à mes valeurs et à mes convictions.",
      empathique: "prendre soin des gens qui comptent et partager des moments attentifs.",
    },
  },

  // ── phase : 6 Likert ──
  "p-lk-01": {
    statement:
      "Ces derniers temps, j'ai surtout besoin qu'on reconnaisse la qualité de mon travail et d'avoir des échéances et des repères clairs.",
  },
  "p-lk-02": {
    statement:
      "En ce moment, j'ai besoin que mes convictions et mon engagement soient reconnus et respectés.",
  },
  "p-lk-03": {
    statement:
      "Ces derniers temps, j'ai surtout besoin qu'on me reconnaisse comme personne, avec de la chaleur et de l'attention.",
  },
  "p-lk-04": {
    statement:
      "En ce moment, j'ai particulièrement besoin de moments de solitude et de calme pour laisser vivre mon imaginaire.",
  },
  "p-lk-05": {
    statement:
      "Ces derniers temps, j'ai surtout besoin de légèreté, de jeu et de contacts qui me fassent rire.",
  },
  "p-lk-06": {
    statement:
      "En ce moment, j'ai besoin d'action, de défis et d'intensité à vivre dans l'instant.",
  },
}
