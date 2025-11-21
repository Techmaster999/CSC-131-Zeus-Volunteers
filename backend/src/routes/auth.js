import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const fakeToken = "abc123xyz";

  res.json({
    message: "Login successful (mock)",
    user: { id: 1, name: "Test User", email },
    token: fakeToken,
  });
});

router.get("/test", (_req, res) => {
  res.send("Auth route working");
});

export default router;
