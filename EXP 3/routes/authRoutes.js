const express = require("express");
const router = express.Router();

const { login, verify } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/auth/login - public
router.post("/login", login);

// GET /api/auth/verify - protected (requires valid JWT)
router.get("/verify", authMiddleware, verify);

module.exports = router;
