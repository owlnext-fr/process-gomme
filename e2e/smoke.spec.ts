import { test, expect } from "@playwright/test"

test("parcours complet : intro → quiz → résultats", async ({ page }) => {
  await page.goto("/process-gomme/")

  // Intro
  await expect(page.getByRole("heading", { name: /process gomme/i })).toBeVisible()
  await page.getByRole("button", { name: /commencer/i }).click()

  // Quiz : répondre aux 36 questions.
  for (let i = 0; i < 36; i++) {
    // Attendre que le compteur affiche la bonne question
    await expect(page.getByText(`Question ${i + 1} / 36`)).toBeVisible()

    // Attendre la fin des animations Framer Motion (la motion.div anime en 250 ms).
    // Playwright refuse de cliquer sur un élément en mouvement (transform translateX en cours).
    // On attend 350 ms pour laisser l'animation se terminer avant d'interagir.
    await page.waitForTimeout(350)

    const suivant = page.getByRole("button", { name: /suivant|résultats/i })

    // Si un choix forcé est présent, sélectionner la 1re option.
    // (Les Likert ont une valeur par défaut à 3 — pas besoin d'interaction.)
    const radios = page.getByRole("radio")
    if (await radios.first().isVisible().catch(() => false)) {
      await radios.first().click()
    }

    await expect(suivant).toBeEnabled()
    await suivant.click()
  }

  // Résultats
  await expect(page.getByRole("heading", { name: /ta base/i })).toBeVisible()
  await expect(page.getByLabel(/ton immeuble/i)).toBeVisible()
  await expect(page.getByRole("button", { name: /recommencer/i })).toBeVisible()
})
