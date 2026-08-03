const express = require("express");
const router = express.Router();

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All post routes require a valid JWT
router.use(authMiddleware);

// GET /api/posts - ADMIN, EDITOR, VIEWER
router.get("/", roleMiddleware(["ADMIN", "EDITOR", "VIEWER"]), getPosts);

// GET /api/posts/:id - ADMIN, EDITOR, VIEWER
router.get("/:id", roleMiddleware(["ADMIN", "EDITOR", "VIEWER"]), getPostById);

// POST /api/posts - ADMIN only
router.post("/", roleMiddleware(["ADMIN"]), createPost);

// PUT /api/posts/:id - ADMIN, EDITOR
router.put("/:id", roleMiddleware(["ADMIN", "EDITOR"]), updatePost);

// DELETE /api/posts/:id - ADMIN only
router.delete("/:id", roleMiddleware(["ADMIN"]), deletePost);

module.exports = router;
