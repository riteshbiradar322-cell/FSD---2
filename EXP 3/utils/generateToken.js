const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for an authenticated user.
 * The payload intentionally contains only non-sensitive identifying
 * information (never the password/hash).
 *
 * @param {Object} user - user object with id, username, role
 * @returns {string} signed JWT
 */
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

module.exports = generateToken;
