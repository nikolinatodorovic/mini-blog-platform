const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require('../models/postModel');
const { validatePost } = require('../validation/postValidation');

// GET /api/posts
async function getPosts(req, res) {
  const { data, error } = await getAllPosts();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

// GET /api/posts/:id
async function getPost(req, res) {
  const { id } = req.params;
  const { data, error } = await getPostById(id);
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Post not found' });
  res.status(200).json(data);
}

// POST /api/posts
async function createNewPost(req, res) {
  // Validacija pomoću Zod-a
  const validation = validatePost(req.body);
  
  if (!validation.success) {
 
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { data, error } = await createPost(validation.data);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

// PUT /api/posts/:id
async function updateExistingPost(req, res) {

  const validation = validatePost(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { id } = req.params;
  const { data, error } = await updatePost(id, validation.data);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

// DELETE /api/posts/:id
async function removePost(req, res) {
  const { id } = req.params;
  const { data, error } = await deletePost(id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
}

module.exports = { getPosts, getPost, createNewPost, updateExistingPost, removePost };
