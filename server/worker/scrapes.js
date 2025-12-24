import { chromium } from "playwright";

async function Scrape(url) {
  if (!url || !url.trim()) {
    return { error: "Invalid URL" };
  }

  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    locale: "en-IN",
    timezoneId: "Asia/Kolkata",
    extraHTTPHeaders: {
      "accept-language": "en-IN,en;q=0.9",
      "upgrade-insecure-requests": "1",
    },
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { timeout: 60000, waitUntil: "domcontentloaded" });

    if (page.url().includes("validateCaptcha")) {
      throw new Error("CAPTCHA_DETECTED");
    }

    await page.waitForSelector("span#productTitle", { timeout: 8000 });

    const title = await page.locator("span#productTitle").innerText();

    let imageUrl = null;

    try {
      imageUrl = await page
        .locator("#imgTagWrapperId img, .img-wrapper img")
        .first()
        .getAttribute("src");
    } catch{}

    let price = null;
    try {
      price = await page.locator(".a-price-whole").first().innerText();
      price = price.replace(/[^\d]/g, "");
    } catch {}

    let availability = null;
    try {
      availability = await page
        .locator(
          "#availabilityInsideBuyBox_feature_div #availability, #availability"
        )
        .first()
        .innerText();
    } catch {}

    return {
      imageUrl,
      title: title.trim(),
      price,
      availability: availability?.trim() || null,
    };
  } catch (err) {
    return { error: err.message };
  } finally {
    await browser.close();
  }
}

export default Scrape;
