import { expect, test } from "@playwright/test";

test("homepage renders", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("body")).not.toBeEmpty();
});

test("protected routes redirect unauthenticated visitors", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL((url) => {
    return (
      url.pathname === "/auth" ||
      url.pathname.startsWith("/auth") ||
      url.hostname.includes("vercel.com")
    );
  });
});
