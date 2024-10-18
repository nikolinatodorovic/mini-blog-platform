const { createClient } = require('@supabase/supabase-js');

// Supabase inicijalizacija
const supabaseUrl = 'https://twblcijjauuhecvnsohs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3YmxjaWpqYXV1aGVjdm5zb2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MDE4NDMsImV4cCI6MjA0NDQ3Nzg0M30.HLrTDZfYuWe79KLkgmZtsWIGQ7tsokyYrP7xuPvDfZ8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Kreiranje novog komentara za post
exports.createComment = async (req, res) => {
  const { id } = req.params; // Post ID
  const { user_id, content } = req.body; // Podaci o komentaru

  try {
    const { error } = await supabase
      .from('comments')
      .insert([{ post_id: id, user_id, content }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};


// Dobijanje svih komentara za post sa email-om korisnika
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



// Ažuriranje komentara
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body; // Novi sadržaj komentara

  try 
  {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
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
