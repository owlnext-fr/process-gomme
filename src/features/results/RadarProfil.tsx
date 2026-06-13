import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { TYPE_IDS, TYPES, TYPE_COLORS, type TypeId } from "@/data/types"

// Point coloré à chaque sommet du radar : couleur du type correspondant.
// `index` suit l'ordre de `data`, donc l'ordre de TYPE_IDS.
function RadarDot(props: { cx?: number; cy?: number; index?: number }) {
  const { cx, cy, index } = props
  if (cx == null || cy == null || index == null) return <g />
  return (
    <circle cx={cx} cy={cy} r={4} fill={TYPE_COLORS[TYPE_IDS[index]]} stroke="white" strokeWidth={1.5} />
  )
}

export function RadarProfil({ socle }: { socle: Record<TypeId, number> }) {
  const data = TYPE_IDS.map((t) => ({ type: TYPES[t].nom, score: Math.round(socle[t]) }))
  return (
    <div className="h-64 w-full" aria-label="Radar de ton profil">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid />
          <PolarAngleAxis dataKey="type" tick={{ fontSize: 11 }} />
          <Radar
            dataKey="score"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.3}
            dot={RadarDot}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
