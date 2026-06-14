// Mélange de Fisher-Yates : retourne une permutation aléatoire de [0, n[.
// `rng` est injectable pour des tests déterministes (défaut : Math.random).
export function shuffledIndices(n: number, rng: () => number = Math.random): number[] {
  const idx = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = idx[i]
    idx[i] = idx[j]
    idx[j] = tmp
  }
  return idx
}
