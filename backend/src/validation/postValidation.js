const { z } = require('zod');

// Shema za validaciju kreiranja posta
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  user_id: z.string().uuid(),
});

// Shema za validaciju ažuriranja posta
const updatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

module.exports = { createPostSchema, updatePostSchema };
