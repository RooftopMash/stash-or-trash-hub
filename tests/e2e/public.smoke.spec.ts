import { expect, test } from "@playwright/test";

test("homepage renders", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("body")).not.toBeEmpty();
});

test("protected routes redirect unauthenticated visitors", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/auth(?:\?|$)/);
});

test("public directory and scanner routes render without uncaught errors", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  for (const routePath of ["/brands", "/discover", "/awards", "/scan"]) {
    const response = await page.goto(routePath);
    expect(response?.ok(), `Route ${routePath} should return HTTP 2xx`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
  }

  expect(pageErrors).toEqual([]);
});
