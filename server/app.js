import express from "express";
import Scrape from "./worker/scrapes.js";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import History from "./models/history.model.js";
import "./cron/dailyScraper.js"

dotenv.config();
connectDB();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/api/scrape", async (req, res) => {
  try {
    const { url, isTrack } = req.body;

    if (!url || !url.trim()) {
      return res.status(400).json({ error: "URL is required" });
    }

    const data = await Scrape(url);

    if (isTrack) {
      let product = await Product.findOne({ url });

      if (product) {
        const alreadyTracked = await History.findOne({
          productUrl: product._id,
        });

        if (alreadyTracked) {
          return res.status(409).json({
            error: "This product is already being tracked",
          });
        }
      }

      if (!product) {
        product = await Product.create({ url });
      }

      await History.create({
        imageUrl: data.imageUrl,
        title: data.title,
        price: data.price,
        availability: data.availability,
        productUrl: product._id,
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Scraping failed" });
  }
});


app.get("/api/history", async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const endOfYesterday = new Date(endOfToday);
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);

    const todayHistory = await History.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    }).sort({ createdAt: -1 });

    const yesterdayHistory = await History.find({
      createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
    });

    const yesterdayPriceMap = {};
    yesterdayHistory.forEach((item) => {
      yesterdayPriceMap[item.productUrl.toString()] = item.price;
    });

    const data = todayHistory.map((item) => ({
      ...item.toObject(),
      yesterdayPrice: yesterdayPriceMap[item.productUrl.toString()] || null,
      priceChange:
        yesterdayPriceMap[item.productUrl.toString()] != null
          ? item.price - yesterdayPriceMap[item.productUrl.toString()]
          : null,
    }));

    res.status(200).json({
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch history",
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
