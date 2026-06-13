import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { TYPE_IDS, TYPES, type TypeId } from "@/data/types"

export function RadarProfil({ socle }: { socle: Record<TypeId, number> }) {
  const data = TYPE_IDS.map((t) => ({ type: TYPES[t].nom, score: Math.round(socle[t]) }))
  return (
    <div className="h-64 w-full" aria-label="Radar de ton profil">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="type" tick={{ fontSize: 11 }} />
          <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
