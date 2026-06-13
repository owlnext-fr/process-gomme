import { test, expect } from "@playwright/test"

test("la page Hello s'affiche avec le style Tailwind appliqué", async ({ page }) => {
  await page.goto("/process-gomme/")

  // Le titre Hello est visible
  await expect(page.getByRole("heading", { name: /hello/i })).toBeVisible()

  // Le texte de présentation est présent
  await expect(page.getByText(/process gomme/i)).toBeVisible()
})
