import { Svg, Polygon, Line, Text as SvgText } from "@react-pdf/renderer"
import { TYPE_IDS, TYPES, type TypeId } from "@/data/types"

const SIZE = 220
const C = SIZE / 2
const R = 80

function point(i: number, radius: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6
  return [C + radius * Math.cos(angle), C + radius * Math.sin(angle)] as const
}

export function PdfRadar({ socle }: { socle: Record<TypeId, number> }) {
  const max = Math.max(...TYPE_IDS.map((t) => socle[t]), 1)
  const grid = TYPE_IDS.map((_, i) => point(i, R))
  const shape = TYPE_IDS.map((t, i) => point(i, (socle[t] / max) * R))
  const toStr = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  return (
    <Svg width={SIZE} height={SIZE}>
      {grid.map((_, i) => {
        const [x, y] = grid[i]
        return <Line key={i} x1={C} y1={C} x2={x} y2={y} stroke="#cbd5e1" strokeWidth={0.5} />
      })}
      <Polygon points={toStr(grid)} stroke="#cbd5e1" strokeWidth={0.5} fill="none" />
      <Polygon points={toStr(shape)} stroke="#4f46e5" strokeWidth={1} fill="#4f46e5" fillOpacity={0.25} />
      {grid.map((_, i) => {
        const [lx, ly] = point(i, R + 14)
        return (
          <SvgText
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            fill="#475569"
            style={{ fontSize: 7 }}
          >
            {TYPES[TYPE_IDS[i]].nom}
          </SvgText>
        )
      })}
    </Svg>
  )
}
