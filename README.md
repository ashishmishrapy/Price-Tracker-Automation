# 🛒 Automated Price Tracking System

A production-style backend system that tracks product prices over time using browser automation, scheduled jobs, and time-series data storage.

This project focuses on **real-world backend engineering practices**, not just basic scraping.

---

## 🚀 What This Project Does

- Accepts product URLs from users
- Scrapes live product data using browser automation
- Stores immutable price history (time-series data)
- Automatically re-scrapes products daily using cron jobs
- Exposes APIs to fetch:
  - Today’s price
  - Yesterday’s price
  - Price change
- Built with scalability, reliability, and debuggability in mind

---

## 🧠 Production-Level Engineering Approach

### 1️⃣ Separation of Static vs Dynamic Data

- **Product data** (URL, title, image) is stored once
- **History data** stores only time-variant fields like price and availability
- Avoids duplication and ensures consistency across historical records

This mirrors how production systems handle **master data vs time-series data**.

---

### 2️⃣ Immutable Price History

- Each scrape creates a **new database record**
- Historical data is never overwritten
- Enables accurate:
  - Daily comparisons
  - Price trend analysis

This approach is common in **financial and monitoring systems**.

---

### 3️⃣ Safe Date-Based Queries

- Uses **date-range filtering** instead of relying on record order
- Prevents incorrect results caused by:
  - Missed cron runs
  - Multiple scrapes in a single day
- Timezone-aware logic ensures consistent results

---

### 4️⃣ Automated Background Jobs (Cron)

- Daily scraping is handled via scheduled background jobs
- Cron runs independently of user requests
- Ensures data freshness without manual triggers

This pattern is widely used in production for **periodic data syncs**.

---

### 5️⃣ Controlled Scraping Strategy

- Products are processed sequentially to avoid IP blocking
- Designed to support:
  - Rate limiting
  - Delays between requests
  - Future queue-based processing if scale increases

---

### 6️⃣ Clean Error Handling & Debugging

- Failures during scraping do not crash the system
- Each step is logged for easy debugging
- Partial failures do not block the entire job

---

## 🛠 Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – API layer
- **Playwright** – Browser automation & scraping
- **MongoDB + Mongoose** – Data persistence
- **node-cron** – Scheduled background jobs

---

## 📊 Example Use Cases

- Price tracking & alerts
- Market monitoring tools
- E-commerce analytics
- Historical pricing dashboards


## 📌 Future Enhancements

- Authentication & user-specific tracking
- Price alerts and notifications
- Aggregation pipelines for analytics
- Queue-based scraping (BullMQ / Redis)
- Cloud deployment & monitoring

---

## 🧑‍💻 Author

Built as a hands-on project to practice **production-grade backend engineering** concepts.
