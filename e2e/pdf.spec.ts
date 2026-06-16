import { test, expect } from "@playwright/test"

test("export PDF : le bouton télécharge un .pdf", async ({ page }) => {
  await page.goto("/process-gomme/")
  await page.getByRole("button", { name: /adulte/i }).click()

  // Répondre aux 36 questions (1re option à chaque fois).
  for (let i = 0; i < 36; i++) {
    await expect(page.getByText(`Question ${i + 1} / 36`)).toBeVisible()
    await page.waitForTimeout(350) // animations Framer (cf. QUIRKS)
    const suivant = page.getByRole("button", { name: /suivant|résultats/i })
    const radios = page.getByRole("radio")
    if (await radios.first().isVisible().catch(() => false)) await radios.first().click()
    await expect(suivant).toBeEnabled()
    await suivant.click()
  }

  await expect(page.getByRole("heading", { name: /tes résultats/i })).toBeVisible()
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /exporter en pdf/i }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/\.pdf$/)
})
