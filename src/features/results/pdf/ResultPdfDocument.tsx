import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import { TYPES, type TypeId } from "@/data/types"
import type { DisplayResult } from "@/lib/scoring"
import { DESCRIPTIONS } from "@/content/descriptions"
import { ENERGIE } from "@/content/energie"
import { IMMEUBLE_INTRO, composeInteraction } from "@/content/interactions"
import { CANAUX } from "@/content/canaux"
import { composeStress } from "@/content/stress"
import { composeVigilance } from "@/content/vigilance"
import { SECTION_HINTS } from "@/content/sectionHints"
import { PdfImmeuble } from "./PdfImmeuble"
import { PdfRadar } from "./PdfRadar"

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#0f172a", fontFamily: "Helvetica", lineHeight: 1.4 },
  h1: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  sub: { fontSize: 9, color: "#64748b", marginTop: 2, marginBottom: 12 },
  banner: { backgroundColor: "#e0e7ff", borderRadius: 6, padding: 10, marginBottom: 16 },
  bannerLabel: { fontSize: 8, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 },
  bannerValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#4338ca", marginTop: 2 },
  section: { marginBottom: 14 },
  blockTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 8 },
  hint: { fontSize: 8, color: "#6366f1", marginBottom: 3 },
  p: { marginBottom: 4 },
  li: { marginBottom: 2 },
})

function Section({ titre, hint, children }: { titre: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={s.section} wrap={false}>
      <Text style={s.subTitle}>{titre}</Text>
      {hint ? <Text style={s.hint}>{hint}</Text> : null}
      {children}
    </View>
  )
}

export function ResultPdfDocument({ result, genere }: { result: DisplayResult; genere: string }) {
  const { base, phase, immeuble, socle } = result
  const vigilance = composeVigilance(base, phase)
  return (
    <Document title={`process gomme — ${TYPES[base].nom} · ${TYPES[phase].nom}`}>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>process gomme</Text>
        <Text style={s.sub}>Ton profil · généré le {genere}</Text>

        <View style={s.banner}>
          <Text style={s.bannerLabel}>Ta base · ta phase</Text>
          <Text style={s.bannerValue}>
            {TYPES[base].nom} · {TYPES[phase].nom}
          </Text>
        </View>

        <View style={s.section} wrap={false}>
          <Text style={s.blockTitle}>Ton immeuble</Text>
          <Text style={s.hint}>{SECTION_HINTS.immeuble}</Text>
          <PdfImmeuble immeuble={immeuble} socle={socle} phase={phase} />
        </View>

        <View style={s.section} wrap={false}>
          <Text style={s.blockTitle}>Ton profil en relief</Text>
          <PdfRadar socle={socle} />
        </View>

        <Text style={s.blockTitle}>Synthèse</Text>
        <Section titre={`Ta base — ${TYPES[base].nom}`} hint={SECTION_HINTS.base}>
          <Text style={s.p}>{DESCRIPTIONS[base].base}</Text>
        </Section>
        <Section titre={`Ta phase — ${TYPES[phase].nom}`} hint={SECTION_HINTS.phase}>
          <Text style={s.p}>{DESCRIPTIONS[phase].phase}</Text>
        </Section>
        <Section titre="Ton immeuble" hint={SECTION_HINTS.immeuble}>
          <Text style={s.p}>{IMMEUBLE_INTRO}</Text>
          {immeuble.map((t: TypeId) => (
            <Text key={t} style={s.li}>
              {TYPES[t].nom} — {Math.round(socle[t])}% — {ENERGIE[t]}
            </Text>
          ))}
        </Section>
        <Section titre="Interactions base × phase" hint={SECTION_HINTS.interactions}>
          <Text style={s.p}>{composeInteraction(base, phase)}</Text>
        </Section>

        <Text style={s.blockTitle}>Pour aller plus loin</Text>
        <Section titre="Ton canal de communication" hint={SECTION_HINTS.canal}>
          <Text style={s.p}>{CANAUX[base]}</Text>
        </Section>
        <Section titre="Toi sous stress" hint={SECTION_HINTS.stress}>
          <Text style={s.p}>{composeStress(base, phase)}</Text>
        </Section>
        <Section titre="Points de vigilance" hint={SECTION_HINTS.vigilance}>
          <Text style={s.li}>• {vigilance.base}</Text>
          <Text style={s.li}>• {vigilance.phase}</Text>
        </Section>
      </Page>
    </Document>
  )
}
