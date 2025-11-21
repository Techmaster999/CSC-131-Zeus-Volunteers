import express from "express";
const router = express.Router();

let mockUsers = [
  {
    id: 1,
    name: "Natalie",
    email: "natalie@example.com"
  }
];

router.get("/", (req, res) => {
  res.json(mockUsers[0]); // send first mock user
});

export default router;
