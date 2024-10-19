const { createClient } = require('@supabase/supabase-js');

// Supabase inicijalizacija
const supabaseUrl = 'https://twblcijjauuhecvnsohs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3YmxjaWpqYXV1aGVjdm5zb2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MDE4NDMsImV4cCI6MjA0NDQ3Nzg0M30.HLrTDZfYuWe79KLkgmZtsWIGQ7tsokyYrP7xuPvDfZ8';
const supabase = createClient(supabaseUrl, supabaseKey);


const { createCommentSchema, updateCommentSchema } = require('../validation/commentValidation');


exports.createComment = async (req, res) => {
  const { id } = req.params; 
  const { user_id, content, user_email } = req.body; 

  console.log('Post ID:', id);
  console.log('User ID:', user_id);
  console.log('Comment Content:', content);


  try {
    const validation = createCommentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { error } = await supabase
      .from('comments')
      .insert([{ post_id: id, user_id, content }]);

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(204).end();
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};





exports.getComments = async (req, res) => {
  const { id } = req.params; // Post ID

  try 
  {
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id);

    if (commentsError) 
      {
      return res.status(500).json({ error: commentsError.message });
      }

    const userIds = comments.map(comment => comment.user_id);

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .in('id', userIds);

    if (usersError) {
      return res.status(500).json({ error: usersError.message });
    }

    const emailMap = users.reduce((acc, user) => {
      acc[user.id] = user.email;
      return acc;
    }, {});

    const commentsWithEmails = comments.map(comment => ({
      ...comment,
      user_email: emailMap[comment.user_id] || null, 
    }));
    res.status(200).json(commentsWithEmails);
  } 
  catch (err) 
  {
    res.status(500).json({ error: 'Server error.' });
  }
};



exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body; // Novi sadržaj komentara

  try {
    // Validacija podataka
    const validation = updateCommentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId);

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(204).send(); 
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};


// Brisanje komentara
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try 
  {
    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) 
      {
      return res.status(500).json({ error: error.message });
    }

    res.status(204).send(); 
  }
  catch (err) 
  {
    res.status(500).json({ error: 'Server error.' });
  }
};
