import { describe, it, expect } from "vitest"
import { QUESTION_STRUCTURE, type Famille, type ForcedStruct, type LikertStruct } from "./questions"
import { TYPE_IDS, type TypeId } from "./types"

const FAMILLES: Famille[] = ["base", "phase"]
const forced = QUESTION_STRUCTURE.filter((q): q is ForcedStruct => q.kind === "forced")
const likert = QUESTION_STRUCTURE.filter((q): q is LikertStruct => q.kind === "likert")

function byFamille<T extends { famille: Famille }>(arr: T[], f: Famille) {
  return arr.filter((q) => q.famille === f)
}

describe("QUESTION_STRUCTURE — structure globale", () => {
  it("contient exactement 36 items", () => {
    expect(QUESTION_STRUCTURE).toHaveLength(36)
  })
  it("18 base et 18 phase", () => {
    expect(byFamille(QUESTION_STRUCTURE, "base")).toHaveLength(18)
    expect(byFamille(QUESTION_STRUCTURE, "phase")).toHaveLength(18)
  })
  it("par famille : 12 choix forcés + 6 Likert", () => {
    for (const f of FAMILLES) {
      expect(byFamille(forced, f)).toHaveLength(12)
      expect(byFamille(likert, f)).toHaveLength(6)
    }
  })
  it("ids uniques", () => {
    const ids = QUESTION_STRUCTURE.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe("QUESTION_STRUCTURE — choix forcés", () => {
  it("chaque forcé a 4 cibles distinctes et valides", () => {
    for (const q of forced) {
      expect(q.cibles).toHaveLength(4)
      expect(new Set(q.cibles).size).toBe(4)
      for (const c of q.cibles) expect(TYPE_IDS).toContain(c)
    }
  })
})

describe("QUESTION_STRUCTURE — Likert", () => {
  it("chaque Likert cible un type valide", () => {
    for (const q of likert) expect(TYPE_IDS).toContain(q.cible)
  })
})

describe("QUESTION_STRUCTURE — équilibrage (8× forcé + 1× Likert par type et famille)", () => {
  function comptage(f: Famille): Record<TypeId, { fc: number; lk: number }> {
    const init = Object.fromEntries(TYPE_IDS.map((t) => [t, { fc: 0, lk: 0 }])) as Record<
      TypeId,
      { fc: number; lk: number }
    >
    for (const q of byFamille(forced, f)) for (const c of q.cibles) init[c].fc += 1
    for (const q of byFamille(likert, f)) init[q.cible].lk += 1
    return init
  }
  it("chaque type est cible 8× en forcé et 1× en Likert, dans chaque famille", () => {
    for (const f of FAMILLES) {
      const c = comptage(f)
      for (const t of TYPE_IDS) {
        expect(c[t].fc, `${t} forcé en ${f}`).toBe(8)
        expect(c[t].lk, `${t} likert en ${f}`).toBe(1)
      }
    }
  })
})
