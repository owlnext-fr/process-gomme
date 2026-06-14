import { test, expect } from "@playwright/test"

// Le bouton Partager écrit dans le presse-papier ; on lit le presse-papier dans le test.
test.use({ permissions: ["clipboard-read", "clipboard-write"] })

test("partage : copier le lien puis l'ouvrir reconstruit le même profil", async ({ page }) => {
  await page.goto("/process-gomme/")
  await page.getByRole("button", { name: /commencer/i }).click()

  // Répondre aux 36 questions (1re option si choix forcé ; Likert par défaut à 3).
  for (let i = 0; i < 36; i++) {
    await expect(page.getByText(`Question ${i + 1} / 36`)).toBeVisible()
    // Laisser l'animation Framer Motion (≈250 ms) se terminer avant de cliquer.
    await page.waitForTimeout(350)
    const suivant = page.getByRole("button", { name: /suivant|résultats/i })
    const radios = page.getByRole("radio")
    if (await radios.first().isVisible().catch(() => false)) {
      await radios.first().click()
    }
    await expect(suivant).toBeEnabled()
    await suivant.click()
  }

  // Résultats : mémoriser la base·phase affichée (la valeur, pas le label).
  await expect(page.getByRole("heading", { name: /tes résultats/i })).toBeVisible()
  const basePhase = await page.locator("p.text-xl.text-primary").innerText()

  // Cliquer Partager → feedback visible + lien dans le presse-papier.
  await page.getByRole("button", { name: /partager/i }).click()
  await expect(page.getByRole("button", { name: /lien copié/i })).toBeVisible()
  const url = await page.evaluate(() => navigator.clipboard.readText())
  expect(url).toContain("?r=")

  // Ouvrir le lien partagé : page de résultats en mode partagé, même base·phase.
  await page.goto(url)
  await expect(page.getByRole("heading", { name: /tes résultats/i })).toBeVisible()
  await expect(page.getByText(/profil partagé/i)).toBeVisible()
  await expect(page.locator("p.text-xl.text-primary")).toHaveText(basePhase)
  // En mode partagé, pas de bouton « Recommencer ».
  await expect(page.getByRole("button", { name: /recommencer/i })).toHaveCount(0)

  // « Faire mon test » nettoie l'URL (retire ?r=) et revient à l'intro.
  await page.getByRole("button", { name: /faire mon test/i }).click()
  await expect(page.getByRole("heading", { name: /process gomme/i })).toBeVisible()
  expect(new URL(page.url()).search).toBe("")
})
