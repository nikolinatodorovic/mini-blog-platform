const { z } = require('zod');

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  content: z.string().min(1, 'Content is required'),
  user_id: z.string().uuid('Invalid user ID format'),
});


const validatePost = (data) => {
  return postSchema.safeParse(data);
};

module.exports = 
{
  validatePost,
};
