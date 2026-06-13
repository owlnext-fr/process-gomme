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
    <main className="min-h-svh w-full md:grid md:grid-cols-3">
      <div className="flex min-h-svh flex-col p-6 md:col-span-1 md:min-h-0 md:p-10">{left}</div>
      <div
        className={`flex flex-col justify-center bg-primary p-6 md:col-span-2 md:p-10 ${
          hideRightOnMobile ? "max-md:hidden" : ""
        }`}
      >
        {right}
      </div>
    </main>
  )
}
