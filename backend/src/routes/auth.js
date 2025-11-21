import express from "express";
const router = express.Router();

// Temporary mock login route (no database needed)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Mock response
  res.json({
    message: "Login successful (mock)",
    user: {
      id: 1,
      name: "Test User",
      email: email,
    },
  });
});

// Test route
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

export default router;
