import type { Answers } from "@/lib/scoring"

export function ResultsScreen({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  void answers
  return (
    <main className="p-6">
      <p>Résultats</p>
      <button onClick={onRestart}>Recommencer</button>
    </main>
  )
}
