const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require('../models/postModel');

// GET /api/posts
async function getPosts(req, res) 
{
  const { data, error } = await getAllPosts();
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

// GET /api/posts/:id
async function getPost(req, res) 
{
  const { id } = req.params;
  const { data, error } = await getPostById(id);
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Post not found' });
  res.status(200).json(data);
}

// POST /api/posts
async function createNewPost(req, res)
 {
  const { data, error } = await createPost(req.body);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

// PUT /api/posts/:id
async function updateExistingPost(req, res)
 {
  const { id } = req.params;
  const { data, error } = await updatePost(id, req.body);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

// DELETE /api/posts/:id
async function removePost(req, res)
 {
  const { id } = req.params;
  const { data, error } = await deletePost(id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
}

module.exports = { getPosts, getPost, createNewPost, updateExistingPost, removePost };
