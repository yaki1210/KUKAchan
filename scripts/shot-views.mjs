import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "screenshots");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  channel: "msedge",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(30000);

try {
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await page.waitForSelector("canvas");
  await page.waitForTimeout(2500);

  const rotate = page.getByRole("button", { name: "旋转" });
  if ((await rotate.getAttribute("aria-pressed")) === "true") {
    await rotate.click();
    await page.waitForTimeout(400);
  }

  const shots = [
    ["前视", "v3-front.png"],
    ["¾", "v3-34.png"],
    ["侧视", "v3-side.png"],
    ["顶视", "v3-top.png"],
    ["后视", "v3-back.png"],
  ];

  for (const [label, file] of shots) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await page.waitForTimeout(1600);
    await page.screenshot({
      path: join(outDir, file),
      type: "png",
    });
    console.log("saved", file);
  }
} finally {
  await browser.close();
}
