const fs = require("fs");
const path = require("path");

const postsPath = path.join(__dirname, "..", "data", "posts.json");

function loadPosts() {
  const raw = fs.readFileSync(postsPath, "utf-8");
  return JSON.parse(raw);
}

function savePosts(posts) {
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), "utf-8");
}

/**
 * GET /api/posts
 * Allowed: ADMIN, EDITOR, VIEWER
 */
function getPosts(req, res) {
  const posts = loadPosts();
  return res.status(200).json({ success: true, count: posts.length, posts });
}

/**
 * GET /api/posts/:id
 * Allowed: ADMIN, EDITOR, VIEWER
 */
function getPostById(req, res) {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === Number(req.params.id));

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  return res.status(200).json({ success: true, post });
}

/**
 * POST /api/posts
 * Allowed: ADMIN only
 */
function createPost(req, res) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required.",
    });
  }

  const posts = loadPosts();
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    title,
    content,
    author: req.user.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  posts.push(newPost);
  savePosts(posts);

  return res.status(201).json({
    success: true,
    message: "Post created successfully.",
    post: newPost,
  });
}

/**
 * PUT /api/posts/:id
 * Allowed: ADMIN, EDITOR
 */
function updatePost(req, res) {
  const { title, content } = req.body;
  const posts = loadPosts();
  const index = posts.findIndex((p) => p.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  if (!title && !content) {
    return res.status(400).json({
      success: false,
      message: "Provide at least a title or content to update.",
    });
  }

  posts[index] = {
    ...posts[index],
    title: title || posts[index].title,
    content: content || posts[index].content,
    updatedAt: new Date().toISOString(),
  };

  savePosts(posts);

  return res.status(200).json({
    success: true,
    message: "Post updated successfully.",
    post: posts[index],
  });
}

/**
 * DELETE /api/posts/:id
 * Allowed: ADMIN only
 */
function deletePost(req, res) {
  const posts = loadPosts();
  const index = posts.findIndex((p) => p.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  const deleted = posts.splice(index, 1)[0];
  savePosts(posts);

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
    post: deleted,
  });
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
