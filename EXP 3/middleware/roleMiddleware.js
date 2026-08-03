/**
 * roleMiddleware
 * ---------------
 * Responsible ONLY for authorization:
 *   Given a list of roles allowed to perform an action, checks whether
 *   the authenticated user (attached by authMiddleware) has one of them.
 *
 * Usage:
 *   router.post("/posts", authMiddleware, roleMiddleware(["ADMIN"]), createPost);
 *
 * @param {string[]} allowedRoles - roles permitted to access the route
 */
function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    // Defensive check: authMiddleware must run before this middleware
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User not authenticated.",
      });
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${role}' is not permitted to perform this action.`,
      });
    }

    next();
  };
}

module.exports = roleMiddleware;
