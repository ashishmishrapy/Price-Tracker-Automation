import cron from "node-cron";
import Product from "../models/product.model.js";
import History from "../models/history.model.js";
import Scrape from "../worker/scrapes.js";

cron.schedule(
  "0 0 1 * * *",
  async () => {

    console.log("Cron started:", new Date());

    const products = await Product.find();

    console.log("Tracked products count:", products.length);

    for (const product of products) {
        console.log("Scraping:", product.url);
      try {
        const scrapedData = await Scrape(product.url);

        if (!scrapedData?.price) continue;

        await History.create({
          productUrl: product._id,
          imageUrl: scrapedData.imageUrl,
          title: scrapedData.title,
          price: scrapedData.price,
          availability: scrapedData.availability,
        });

        console.log(`Saved history for ${product.title}`);
      } catch (err) {
        console.error("Scrape failed:", product.productUrl);
      }
    }

    console.log("Cron finished");
  },
  {
    timezone: "Asia/Kolkata",
  }
);
