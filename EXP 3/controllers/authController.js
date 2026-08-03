const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const generateToken = require("../utils/generateToken");

const usersPath = path.join(__dirname, "..", "data", "users.json");

function loadUsers() {
  const raw = fs.readFileSync(usersPath, "utf-8");
  return JSON.parse(raw);
}

/**
 * POST /api/auth/login
 * Verifies username + password, returns a signed JWT on success.
 */
function login(req, res) {
  const { username, password } = req.body;

  // Basic request validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  const users = loadUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password.",
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password.",
    });
  }

  const token = generateToken(user);

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
}

/**
 * GET /api/auth/verify
 * Protected route (requires authMiddleware). Returns info about the
 * currently authenticated user, confirming the token is valid.
 */
function verify(req, res) {
  return res.status(200).json({
    authenticated: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    },
  });
}

module.exports = { login, verify };
