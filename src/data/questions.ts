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
  options: [Option, Option]
}

export interface Likert extends QuestionBase {
  kind: "likert"
  statement: string
  cible: TypeId
}

export type Question = ForcedChoice | Likert

// Rempli aux Tasks 3 (base) et 4 (phase).
export const QUESTIONS: Question[] = [
  // ── Famille « base » : 12 choix forcés ───────────────────────────────
  {
    id: "b-fc-01",
    famille: "base",
    kind: "forced",
    prompt: "Quand je monte un meuble livré en kit, par nature je…",
    options: [
      {
        label: "lis toute la notice d'abord et trie les pièces avant la première vis.",
        cible: "travaillomane",
      },
      {
        label: "me lance tout de suite, j'aime sentir le truc prendre forme sous mes mains.",
        cible: "rebelle",
      },
    ],
  },
  {
    id: "b-fc-02",
    famille: "base",
    kind: "forced",
    prompt: "Pour organiser un dîner entre amis chez moi, le plus souvent je…",
    options: [
      {
        label: "cale le menu, les horaires et la liste de courses à l'avance.",
        cible: "travaillomane",
      },
      {
        label: "réfléchis surtout à qui inviter pour que chacun se sente bien ensemble.",
        cible: "empathique",
      },
    ],
  },
  {
    id: "b-fc-03",
    famille: "base",
    kind: "forced",
    prompt: "Au lancement d'un nouveau projet au travail, par nature je…",
    options: [
      {
        label: "commence par poser le périmètre, les étapes et les données qui manquent.",
        cible: "travaillomane",
      },
      {
        label: "repère vite l'occasion à saisir et propose qu'on démarre tout de suite.",
        cible: "promoteur",
      },
    ],
  },
  {
    id: "b-fc-04",
    famille: "base",
    kind: "forced",
    prompt: "Face à un problème compliqué, depuis toujours je…",
    options: [
      {
        label: "le découpe en sous-questions pour le résoudre méthodiquement.",
        cible: "travaillomane",
      },
      {
        label: "me retire un moment pour le laisser décanter dans ma tête.",
        cible: "reveur",
      },
    ],
  },
  {
    id: "b-fc-05",
    famille: "base",
    kind: "forced",
    prompt: "Au moment de choisir un film pour la soirée, en général je…",
    options: [
      {
        label: "choisis un film qui me touche par ce qu'il raconte et défend.",
        cible: "perseverant",
      },
      {
        label: "suis mon envie du moment, je me fie à ce qui me fait vibrer là, maintenant.",
        cible: "rebelle",
      },
    ],
  },
  {
    id: "b-fc-06",
    famille: "base",
    kind: "forced",
    prompt: "Quand un collègue commet une erreur sur un dossier commun, par nature je…",
    options: [
      {
        label: "regarde d'abord si la façon de faire était juste et défendable.",
        cible: "perseverant",
      },
      {
        label: "fais attention à comment il le vit avant d'en parler.",
        cible: "empathique",
      },
    ],
  },
  {
    id: "b-fc-07",
    famille: "base",
    kind: "forced",
    prompt: "Dans une discussion animée entre amis, le plus souvent je…",
    options: [
      {
        label: "défends posément la position qui me paraît la plus juste.",
        cible: "perseverant",
      },
      {
        label: "trouve l'argument qui parle aux autres et fait avancer le débat.",
        cible: "promoteur",
      },
    ],
  },
  {
    id: "b-fc-08",
    famille: "base",
    kind: "forced",
    prompt: "En lisant une actualité qui me marque, depuis toujours je…",
    options: [
      {
        label: "me demande aussitôt si c'est honnête et conforme à mes convictions.",
        cible: "perseverant",
      },
      {
        label: "la garde en tête et y repense seul, longtemps après.",
        cible: "reveur",
      },
    ],
  },
  {
    id: "b-fc-09",
    famille: "base",
    kind: "forced",
    prompt: "En arrivant à une fête où je ne connais presque personne, par nature je…",
    options: [
      {
        label: "vais vers quelqu'un qui semble un peu à l'écart pour faire connaissance.",
        cible: "empathique",
      },
      {
        label: "reste en retrait à observer la scène, un peu dans mon monde.",
        cible: "reveur",
      },
    ],
  },
  {
    id: "b-fc-10",
    famille: "base",
    kind: "forced",
    prompt: "Quand un coéquipier perd visiblement sa motivation, en général je…",
    options: [
      {
        label: "prends un moment avec lui pour comprendre ce qu'il ressent.",
        cible: "empathique",
      },
      {
        label: "lui propose un défi concret pour relancer son énergie.",
        cible: "promoteur",
      },
    ],
  },
  {
    id: "b-fc-11",
    famille: "base",
    kind: "forced",
    prompt: "Devant un dimanche après-midi entièrement libre, le plus souvent je…",
    options: [
      {
        label: "savoure de ne rien prévoir et laisse mon imagination vagabonder.",
        cible: "reveur",
      },
      {
        label: "improvise une activité qui me tente sur l'instant, histoire de m'amuser.",
        cible: "rebelle",
      },
    ],
  },
  {
    id: "b-fc-12",
    famille: "base",
    kind: "forced",
    prompt: "Si un imprévu chamboule mon programme de voyage, par nature je…",
    options: [
      {
        label: "rebondis aussitôt et transforme la situation en bonne opportunité.",
        cible: "promoteur",
      },
      {
        label: "souris et improvise autre chose, c'est l'imprévu qui rend ça drôle.",
        cible: "rebelle",
      },
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
]
