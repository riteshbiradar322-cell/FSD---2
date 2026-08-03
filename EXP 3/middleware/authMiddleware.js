const jwt = require("jsonwebtoken");

/**
 * authMiddleware
 * ---------------
 * Responsible ONLY for authentication:
 *   1. Reads the Bearer token from the Authorization header
 *   2. Verifies the JWT signature and expiry
 *   3. Attaches the decoded user info to req.user
 *
 * Role-based authorization is handled separately in roleMiddleware.js.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  // 1. Handle missing token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Malformed Authorization header.",
    });
  }

  try {
    // 2. Verify JWT (checks signature + expiry automatically)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach authenticated user info to the request
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Handle expired token specifically
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    // Handle invalid/tampered token
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
}

module.exports = authMiddleware;
