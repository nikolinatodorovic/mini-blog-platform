const { z } = require('zod');

const createCommentSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  content: z.string().min(1, 'Content is required'),
});

const updateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'), // Validacija za sadržaj
});

module.exports = { createCommentSchema, updateCommentSchema };
