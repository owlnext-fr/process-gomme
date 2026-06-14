import { useEffect, useRef, useState } from "react"
import { Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { encodeResult } from "@/lib/shareCode"
import type { DisplayResult } from "@/lib/scoring"

type Status = "idle" | "copied" | "error"

export function ShareButton({ result }: { result: DisplayResult }) {
  const [status, setStatus] = useState<Status>("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function handleShare() {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin)
    url.search = "?r=" + encodeResult(result)
    try {
      await navigator.clipboard.writeText(url.toString())
      setStatus("copied")
    } catch {
      setStatus("error")
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus("idle"), 2000)
  }

  const label =
    status === "copied"
      ? "Lien copié"
      : status === "error"
        ? "Copie impossible"
        : "Partager"

  return (
    <Button variant="outline" onClick={handleShare} aria-live="polite">
      {status === "copied" ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Share2 className="size-4" aria-hidden />
      )}
      {label}
    </Button>
  )
}
