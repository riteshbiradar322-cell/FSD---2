require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Fail fast if JWT_SECRET is missing - never allow the server to run
// without a secret, since that would break token security entirely.
if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL ERROR: JWT_SECRET is not defined. Copy .env.example to .env and set a value."
  );
  process.exit(1);
}

app.use(express.json());

// Simple root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "JWT Authentication + RBAC demo API is running.",
    endpoints: {
      login: "POST /api/auth/login",
      verify: "GET /api/auth/verify",
      posts: "GET /api/posts",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
