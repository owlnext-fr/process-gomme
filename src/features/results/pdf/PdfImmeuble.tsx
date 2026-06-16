import { View, Text, StyleSheet } from "@react-pdf/renderer"
import { TYPES, type TypeId } from "@/data/types"
import { PDF_TYPE_COLORS } from "./pdfColors"

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  label: { width: 130, fontSize: 9, color: "#334155" },
  track: { flex: 1, height: 12, backgroundColor: "#f1f5f9", borderRadius: 2 },
  bar: { height: 12, borderRadius: 2 },
  phaseRow: { borderWidth: 1, borderColor: "#1e1b4b", borderRadius: 3, padding: 2 },
})

export function PdfImmeuble({
  immeuble,
  socle,
  phase,
}: {
  immeuble: TypeId[]
  socle: Record<TypeId, number>
  phase: TypeId
}) {
  const max = Math.max(...immeuble.map((t) => socle[t]), 1)
  return (
    <View>
      {immeuble.map((t) => (
        <View key={t} style={t === phase ? [s.row, s.phaseRow] : s.row}>
          <Text style={s.label}>
            {TYPES[t].nom} — {Math.round(socle[t])}%
          </Text>
          <View style={s.track}>
            <View style={[s.bar, { width: `${(socle[t] / max) * 100}%`, backgroundColor: PDF_TYPE_COLORS[t] }]} />
          </View>
        </View>
      ))}
    </View>
  )
}
