import type { QuestionText } from "./types"

export const ETUDIANT: Record<string, QuestionText> = {
  "b-fc-01": {
    prompt: "Quand je dois monter un meuble en kit pour mon studio, par nature je…",
    labels: {
      travaillomane: "lis la notice en entier et je trie chaque pièce avant de commencer.",
      rebelle: "mets la notice de côté et j'assemble selon mon inspiration du moment.",
      perseverant: "le monte jusqu'au bout par principe, sans bâcler même ce qui ne se verra pas.",
      promoteur: "vise le meuble fini et je le monte d'une traite sans m'arrêter.",
    },
  },
  "b-fc-02": {
    prompt: "Pour organiser une soirée chez moi avec les potes de la promo, le plus souvent je…",
    labels: {
      travaillomane: "prévois le menu, les horaires et la liste des courses à l'avance.",
      empathique: "veille à ce que chacun trouve sa place et se sente bien.",
      reveur: "imagine l'ambiance dans ma tête avant de m'y mettre.",
      promoteur: "réunis tout le monde et lance une soirée pleine d'énergie.",
    },
  },
  "b-fc-03": {
    prompt: "Quand un nouveau projet de groupe démarre en cours, par nature je…",
    labels: {
      travaillomane: "découpe les étapes et repère les infos qui me manquent encore.",
      promoteur: "saute sur l'occasion et lance le projet tout de suite.",
      perseverant: "regarde si l'objectif tient la route et mérite vraiment qu'on s'y mette.",
      rebelle: "pars sur ce qui me branche et plonge là où l'envie me porte.",
    },
  },
  "b-fc-04": {
    prompt: "Face à un problème vraiment galère sur un projet, depuis toujours je…",
    labels: {
      travaillomane: "le découpe en étapes claires et j'avance dans l'ordre.",
      reveur: "le mets de côté et je le laisse mûrir dans ma tête.",
      empathique: "regarde d'abord l'effet que ça produit sur les autres du groupe.",
      rebelle: "le retourne dans tous les sens avec l'idée du moment.",
    },
  },
  "b-fc-05": {
    prompt: "Quand il faut choisir un film pour la soirée à la coloc, en général je…",
    labels: {
      perseverant: "pars sur un film qui défend une cause à laquelle je crois.",
      rebelle: "pars sur un film qui me fait envie sur le moment.",
      travaillomane: "pars sur un film bien noté après avoir épluché les avis.",
      empathique: "pars sur un film qui plaît à toute la coloc réunie.",
    },
  },
  "b-fc-06": {
    prompt: "Quand un membre de mon groupe se plante sur une partie du projet rendu en commun, par nature je…",
    labels: {
      perseverant: "regarde d'abord si le travail rendu tient la route sur le fond.",
      empathique: "regarde d'abord comment il vit la situation et ce qu'il ressent.",
      reveur: "prends d'abord un temps de recul avant de dire quoi que ce soit.",
      promoteur: "cherche d'abord comment reprendre le projet en main et le relancer.",
    },
  },
  "b-fc-07": {
    prompt: "Dans un débat qui chauffe entre potes en soirée, le plus souvent je…",
    labels: {
      perseverant: "défends la position qui me paraît la plus juste.",
      promoteur: "balance mon idée et je relance pour pousser le débat.",
      travaillomane: "remets les faits dans l'ordre pour clarifier le sujet.",
      reveur: "décroche du bruit et je suis le fil de mes pensées.",
    },
  },
  "b-fc-08": {
    prompt: "Quand une actu vue entre deux cours me marque, depuis toujours je…",
    labels: {
      perseverant: "la confronte aussitôt à ce que je trouve juste et important.",
      reveur: "la laisse décanter et j'y reviens seul quelques jours après.",
      empathique: "pense d'abord aux gens concernés et à ce qu'ils traversent.",
      rebelle: "réagis sur le coup, selon mon humeur du moment.",
    },
  },
  "b-fc-09": {
    prompt: "En débarquant à une soirée étudiante où je ne connais presque personne, par nature je…",
    labels: {
      empathique: "repère quelqu'un qui reste seul dans son coin et viens lui parler tranquillement.",
      reveur: "me pose un peu à l'écart et observe l'ambiance se mettre en place.",
      travaillomane: "cherche un petit groupe où on parle de vrais sujets.",
      rebelle: "balance une vanne au hasard et regarde qui rebondit dessus.",
    },
  },
  "b-fc-10": {
    prompt: "Quand un membre du groupe de projet décroche complètement, en général je…",
    labels: {
      empathique: "prends un moment avec lui pour comprendre ce qu'il traverse en ce moment.",
      promoteur: "lui propose une tâche concrète à lancer dès maintenant.",
      perseverant: "lui rappelle ce qu'on s'était promis et l'intérêt de tenir jusqu'au bout.",
      reveur: "prends du recul et lui propose de voir la situation sous un autre angle.",
    },
  },
  "b-fc-11": {
    prompt: "Face à un dimanche après-midi totalement libre, sans cours ni rendu, le plus souvent je…",
    labels: {
      reveur: "laisse les heures défiler au fil de mes pensées et de mes envies floues.",
      rebelle: "saute sur l'envie du moment et me lance dans une idée surgie d'un coup.",
      travaillomane: "ressors ma to-do et avance tranquillement sur deux ou trois trucs en attente.",
      promoteur: "envoie un message au groupe et organise une sortie pour passer l'aprèm ensemble.",
    },
  },
  "b-fc-12": {
    prompt: "Si un imprévu vient bousculer mon planning de révisions, par nature je…",
    labels: {
      promoteur: "saisis l'occasion et trouve une meilleure façon d'avancer.",
      rebelle: "change de méthode et bosse au feeling du moment.",
      perseverant: "garde le cap et trouve comment tenir le programme prévu.",
      empathique: "demande l'avis du groupe et décide la suite ensemble.",
    },
  },
  "b-lk-01": {
    statement: "Avant de me lancer dans un projet ou un partiel, j'ai besoin de comprendre la logique d'un sujet et d'avoir les infos concrètes avant de m'y mettre.",
  },
  "b-lk-02": {
    statement: "Au fond, je juge les situations selon mes convictions et ce qui me paraît juste.",
  },
  "b-lk-03": {
    statement: "En général, je sens vite l'humeur de mes potes et l'ambiance d'un groupe, que ce soit en cours, en soirée ou en coloc.",
  },
  "b-lk-04": {
    statement: "Depuis toujours, j'ai besoin de m'isoler dans ma chambre ou un coin tranquille pour réfléchir et laisser tourner mon imagination.",
  },
  "b-lk-05": {
    statement: "Spontanément, en groupe ou en soirée, je dis ce qui me branche ou pas, souvent avec une bonne dose d'humour.",
  },
  "b-lk-06": {
    statement: "En général, je vais droit au but et je me sens vraiment à fond quand ça bouge et qu'il y a un vrai enjeu.",
  },
  "p-fc-01": {
    prompt: "Après une période bien chargée en cours et en partiels, pour souffler j'aurais surtout envie de…",
    labels: {
      travaillomane: "ranger mon coin de bureau et retrouver un espace clair et posé.",
      rebelle: "suivre une envie du moment et m'offrir une parenthèse libre et légère.",
      perseverant: "revenir à l'essentiel et avancer sur ce qui compte vraiment pour moi.",
      promoteur: "enchaîner une séance de sport et retrouver mon énergie du moment.",
    },
  },
  "p-fc-02": {
    prompt: "En ce moment, ce qui me ferait le plus de bien venant de mes potes, c'est…",
    labels: {
      travaillomane: "qu'on remarque le soin que je mets dans mes révisions et mes projets.",
      empathique: "qu'on pense à prendre de mes nouvelles.",
      reveur: "qu'on me laisse un peu de temps pour moi, sans rien me demander.",
      promoteur: "qu'on me suive quand je lance un plan ou une sortie.",
    },
  },
  "p-fc-03": {
    prompt: "Si une soirée se libérait cette semaine, là tout de suite j'aurais envie de…",
    labels: {
      travaillomane: "reprendre un dossier de cours et avancer méthodiquement selon mon plan.",
      promoteur: "me lancer dans un projet prenant avec un objectif concret à boucler.",
      perseverant: "défendre une cause qui me tient à cœur et faire entendre mon point de vue.",
      rebelle: "ne rien caler du tout et suivre juste l'envie du moment.",
    },
  },
  "p-fc-04": {
    prompt: "Ce qui m'a le plus manqué ces dernières semaines de cours, c'est…",
    labels: {
      travaillomane: "retrouver le calme d'une liste de révisions cochées jusqu'au dernier point.",
      reveur: "retrouver de longues plages seul pour laisser flotter mes pensées.",
      empathique: "retrouver ces moments où on prend de vraies nouvelles les uns des autres.",
      rebelle: "retrouver un peu de spontanéité où je suivrais l'envie du moment.",
    },
  },
  "p-fc-05": {
    prompt: "Pour la prochaine journée libre dans mon planning, en ce moment j'aurais envie de…",
    labels: {
      perseverant: "la dédier à une asso ou une cause qui compte pour moi.",
      rebelle: "la vivre au feeling, sans rien caler à l'avance.",
      travaillomane: "l'organiser créneau par créneau pour ne rien gâcher.",
      empathique: "la passer avec mes proches, dans un vrai moment de complicité.",
    },
  },
  "p-fc-06": {
    prompt: "Ce qui me ferait du bien dans mes études en ce moment, ce serait…",
    labels: {
      perseverant: "sentir qu'on reconnaît l'engagement que je mets dans mes études.",
      empathique: "partager de vrais moments où l'on se parle vraiment.",
      reveur: "trouver un peu de calme pour avancer à mon rythme.",
      promoteur: "me lancer dans des projets concrets en gardant ma liberté d'action.",
    },
  },
  "p-fc-07": {
    prompt: "Avec un long week-end qui s'annonce, là tout de suite j'aurais envie de…",
    labels: {
      perseverant: "m'investir dans un projet de fond, qui demande de la constance et de l'engagement.",
      promoteur: "me lancer dans une activité intense, qui demande de l'énergie et du nerf.",
      travaillomane: "avancer étape par étape sur une réalisation précise, qui demande de la méthode et de la rigueur.",
      reveur: "me poser dans un coin tranquille, qui laisse de la place à l'imaginaire et au calme.",
    },
  },
  "p-fc-08": {
    prompt: "Si j'avais une matinée libre en pleine période de partiels, j'aurais surtout envie de…",
    labels: {
      perseverant: "avancer sur un projet qui compte vraiment pour moi.",
      reveur: "marcher seul au fil de mes pensées et de mes idées.",
      empathique: "passer un moment tranquille avec mes colocs et mes potes.",
      rebelle: "suivre une envie du moment et voir où elle me mène.",
    },
  },
  "p-fc-09": {
    prompt: "Quand je rentre à l'appart après une grosse journée de cours, en ce moment j'ai envie de…",
    labels: {
      empathique: "partager un moment tranquille avec mes potes.",
      reveur: "m'isoler au calme dans mon coin pour remettre mes idées en place.",
      travaillomane: "avancer les trucs en attente pour avoir l'esprit clair.",
      rebelle: "faire ce qui me tente sur le moment sans penser au reste.",
    },
  },
  "p-fc-10": {
    prompt: "D'une soirée de retrouvailles avec ma bande de potes qui s'organise, en ce moment j'attends surtout…",
    labels: {
      empathique: "ressentir une vraie complicité et me sentir accepté comme je suis.",
      promoteur: "lancer une bonne dynamique et vivre un moment fort tous ensemble.",
      perseverant: "discuter franchement et défendre ce qui compte vraiment pour moi.",
      reveur: "trouver un coin peinard et savourer tranquillement chaque moment qui passe.",
    },
  },
  "p-fc-11": {
    prompt: "Quand un trou se libère à l'improviste entre deux cours ces temps-ci, j'ai envie de…",
    labels: {
      reveur: "trouver un coin tranquille du campus et laisser mes pensées partir où elles veulent.",
      rebelle: "suivre l'envie du moment et m'accorder une pause juste pour le plaisir.",
      travaillomane: "rouvrir un projet en cours et le faire avancer point par point.",
      promoteur: "me lancer dans une activité qui bouge et entraîner les autres avec moi.",
    },
  },
  "p-fc-12": {
    prompt: "En ce moment, pour me sentir vraiment bien, j'aurais surtout besoin de…",
    labels: {
      promoteur: "sauter sur une occasion qui se présente et m'y engager à fond.",
      rebelle: "suivre mes envies du moment et m'offrir des petits plaisirs sur un coup de tête.",
      perseverant: "m'investir dans une cause qui colle à mes valeurs et à mes convictions.",
      empathique: "prendre soin des potes qui comptent et partager des moments attentionnés.",
    },
  },
  "p-lk-01": {
    statement: "En ce moment, j'ai surtout besoin qu'on reconnaisse la qualité de mon travail et d'avoir des deadlines et des consignes claires.",
  },
  "p-lk-02": {
    statement: "En ce moment, j'ai besoin qu'on reconnaisse mes convictions et qu'on respecte les causes dans lesquelles je m'investis.",
  },
  "p-lk-03": {
    statement: "En ce moment, j'ai surtout besoin qu'on me reconnaisse comme personne, avec de la chaleur et de l'attention.",
  },
  "p-lk-04": {
    statement: "En ce moment, j'ai surtout besoin de moments de solitude et de calme, loin de l'agitation du campus, pour laisser tourner mon imagination.",
  },
  "p-lk-05": {
    statement: "En ce moment, ce qu'il me faut, c'est du fun, du jeu et des potes avec qui rigoler.",
  },
  "p-lk-06": {
    statement: "En ce moment, j'ai besoin de me bouger, de relever des défis et de vivre des trucs intenses sur le moment.",
  },
}
