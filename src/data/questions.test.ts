import { describe, it, expect } from "vitest"
import { QUESTIONS, type Famille, type ForcedChoice, type Likert } from "./questions"
import { TYPE_IDS, type TypeId } from "./types"

const FAMILLES: Famille[] = ["base", "phase"]

const forced = QUESTIONS.filter((q): q is ForcedChoice => q.kind === "forced")
const likert = QUESTIONS.filter((q): q is Likert => q.kind === "likert")

function byFamille<T extends { famille: Famille }>(arr: T[], f: Famille) {
  return arr.filter((q) => q.famille === f)
}

describe("QUESTIONS — structure globale", () => {
  it("contient exactement 36 items", () => {
    expect(QUESTIONS).toHaveLength(36)
  })

  it("18 base et 18 phase", () => {
    expect(byFamille(QUESTIONS, "base")).toHaveLength(18)
    expect(byFamille(QUESTIONS, "phase")).toHaveLength(18)
  })

  it("par famille : 12 choix forcés + 6 Likert", () => {
    for (const f of FAMILLES) {
      expect(byFamille(forced, f)).toHaveLength(12)
      expect(byFamille(likert, f)).toHaveLength(6)
    }
  })

  it("ids uniques", () => {
    const ids = QUESTIONS.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe("QUESTIONS — choix forcés", () => {
  it("chaque forcé a exactement 2 options de types distincts et valides", () => {
    for (const q of forced) {
      expect(q.options).toHaveLength(2)
      const [a, b] = q.options
      expect(a.cible).not.toBe(b.cible)
      expect(TYPE_IDS).toContain(a.cible)
      expect(TYPE_IDS).toContain(b.cible)
      expect(a.label.length).toBeGreaterThan(0)
      expect(b.label.length).toBeGreaterThan(0)
      expect(q.prompt.length).toBeGreaterThan(0)
    }
  })
})

describe("QUESTIONS — Likert", () => {
  it("chaque Likert cible un type valide et a un énoncé non vide", () => {
    for (const q of likert) {
      expect(TYPE_IDS).toContain(q.cible)
      expect(q.statement.length).toBeGreaterThan(0)
    }
  })
})

describe("QUESTIONS — équilibrage (5 apparitions-cible par type et par famille)", () => {
  function comptageCibles(f: Famille): Record<TypeId, { fc: number; lk: number }> {
    const init = Object.fromEntries(
      TYPE_IDS.map((t) => [t, { fc: 0, lk: 0 }]),
    ) as Record<TypeId, { fc: number; lk: number }>
    for (const q of byFamille(forced, f)) {
      for (const opt of q.options) init[opt.cible].fc += 1
    }
    for (const q of byFamille(likert, f)) {
      init[q.cible].lk += 1
    }
    return init
  }

  it("chaque type est cible 4× en forcé et 1× en Likert, dans chaque famille", () => {
    for (const f of FAMILLES) {
      const c = comptageCibles(f)
      for (const t of TYPE_IDS) {
        expect(c[t].fc, `${t} forcé en ${f}`).toBe(4)
        expect(c[t].lk, `${t} likert en ${f}`).toBe(1)
      }
    }
  })
})
