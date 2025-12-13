import express from "express";
const router = express.Router();

// POST feedback
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  console.log("Feedback received:", message);

  res.status(201).json({ success: true });
});

// GET feedback (optional, for viewing)
router.get("/", async (req, res) => {
  res.json({ message: "Feedback route working" });
});

export default router;
