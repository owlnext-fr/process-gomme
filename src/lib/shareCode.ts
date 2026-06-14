import { TYPE_IDS, type TypeId } from "@/data/types"
import { deriveFromSocle, type DisplayResult } from "./scoring"

/** Encode un résultat en code URL-safe (base64url d'un JSON { s, p }). */
export function encodeResult(result: DisplayResult): string {
  const s = TYPE_IDS.map((t) => Math.round(result.socle[t]))
  const p = TYPE_IDS.indexOf(result.phase)
  const json = JSON.stringify({ s, p })
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/** Décode + valide strictement un code ; null si invalide. */
export function decodeResult(code: string): DisplayResult | null {
  if (!code) return null
  try {
    let b64 = code.replace(/-/g, "+").replace(/_/g, "/")
    while (b64.length % 4) b64 += "=" // ré-ajoute le padding retiré à l'encodage
    const obj = JSON.parse(atob(b64)) as unknown
    if (typeof obj !== "object" || obj === null) return null
    const { s, p } = obj as { s?: unknown; p?: unknown }
    if (!Array.isArray(s) || s.length !== 6) return null
    if (!Number.isInteger(p) || (p as number) < 0 || (p as number) > 5) return null
    for (const n of s) {
      if (!Number.isInteger(n) || n < 0 || n > 100) return null
    }
    const socle = {} as Record<TypeId, number>
    TYPE_IDS.forEach((t, i) => {
      socle[t] = s[i] as number
    })
    const phase = TYPE_IDS[p as number]
    const { base, immeuble } = deriveFromSocle(socle)
    return { socle, base, phase, immeuble, baseEgalePhase: base === phase }
  } catch {
    return null
  }
}

/** Lit le param `?r=` de l'URL courante ; null si absent ou invalide. */
export function readSharedFromLocation(): DisplayResult | null {
  const code = new URLSearchParams(window.location.search).get("r")
  return code ? decodeResult(code) : null
}
