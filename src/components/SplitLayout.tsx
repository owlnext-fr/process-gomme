export function SplitLayout({
  left,
  right,
  hideRightOnMobile = false,
}: {
  left: React.ReactNode
  right: React.ReactNode
  hideRightOnMobile?: boolean
}) {
  return (
    <main className="mx-auto min-h-svh max-w-6xl p-6 md:grid md:grid-cols-3 md:gap-10">
      <div className="flex flex-col md:col-span-1">{left}</div>
      <div
        className={`mt-8 md:col-span-2 md:mt-0 ${
          hideRightOnMobile ? "hidden md:block" : ""
        }`}
      >
        {right}
      </div>
    </main>
  )
}
