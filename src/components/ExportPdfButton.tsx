import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DisplayResult } from "@/lib/scoring"

export function ExportPdfButton({ result }: { result: DisplayResult }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  async function handleExport() {
    setBusy(true)
    setError(false)
    try {
      const [{ pdf }, { ResultPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/features/results/pdf/ResultPdfDocument"),
      ])
      const genere = new Date().toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
      })
      const blob = await pdf(<ResultPdfDocument result={result} genere={genere} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `process-gomme-${result.base}-${result.phase}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={handleExport} disabled={busy}>
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Download className="size-4" aria-hidden />
        )}
        {busy ? "Génération…" : "Exporter en PDF"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {error ? "Export PDF impossible" : busy ? "Génération du PDF en cours" : ""}
      </span>
    </>
  )
}
