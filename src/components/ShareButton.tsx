import { useEffect, useRef, useState } from "react"
import { Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { encodeResult } from "@/lib/shareCode"
import type { DisplayResult } from "@/lib/scoring"

type Status = "idle" | "copied" | "error"

const MESSAGES: Record<Status, string> = {
  idle: "Partager",
  copied: "Lien copié",
  error: "Copie impossible",
}

export function ShareButton({ result }: { result: DisplayResult }) {
  const [status, setStatus] = useState<Status>("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function handleShare() {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin)
    url.searchParams.set("r", encodeResult(result))
    try {
      await navigator.clipboard.writeText(url.toString())
      setStatus("copied")
    } catch {
      setStatus("error")
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus("idle"), 2000)
  }

  return (
    <>
      <Button variant="outline" onClick={handleShare}>
        {status === "copied" ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Share2 className="size-4" aria-hidden />
        )}
        <span className="sr-only md:not-sr-only">{MESSAGES[status]}</span>
      </Button>
      <span className="sr-only" aria-live="polite">
        {status === "idle" ? "" : MESSAGES[status]}
      </span>
    </>
  )
}
