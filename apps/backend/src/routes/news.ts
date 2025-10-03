import express from "express";
import News from "../models/News";

const router = express.Router();

// Create news
router.post("/", async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get all news
router.get("/", async (req, res) => {
  const news = await News.find().sort({ publishedAt: -1 });
  res.json(news);
});

// Get single news
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;