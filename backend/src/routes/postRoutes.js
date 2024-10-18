const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Supabase inicijalizacija
const supabaseUrl = 'https://twblcijjauuhecvnsohs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3YmxjaWpqYXV1aGVjdm5zb2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MDE4NDMsImV4cCI6MjA0NDQ3Nzg0M30.HLrTDZfYuWe79KLkgmZtsWIGQ7tsokyYrP7xuPvDfZ8';
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/posts
router.get('/', async (req, res) => {
  try 
  {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*');

    if (postsError) 
      {
      return res.status(500).json({ error: postsError.message });
    }

    
    const userIds = [...new Set(posts.map(post => post.user_id))];


    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .in('id', userIds);

    if (usersError) 
      {
      return res.status(500).json({ error: usersError.message });
    }

    const emailMap = users.reduce((acc, user) => {
      acc[user.id] = user.email;
      return acc;
    }, {});


    const postsWithEmails = posts.map(post => ({
      ...post,
      user_email: emailMap[post.user_id] || null, 
    }));

    res.json(postsWithEmails); 
  } 
  catch (err) 
  {
    res.status(500).json({ error: 'Došlo je do greške na serveru.' });
  }
});


// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params; 

  try 
  {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id) // Filter prema ID-u
      .single(); // Očekujemo samo jedan rezultat

    if (error) 
      {
      return res.status(500).json({ error: error.message });
      }
    if (!data) 
      {
      return res.status(404).json({ error: 'Post not found' }); // Ako ne postoji post sa datim ID-jem
       }
    res.json(data); // Vraćamo pronađeni post
  } 
  catch (err) 
  {
    res.status(500).json({ error: 'Došlo je do greške na serveru.' });
  }
});

// PUT /api/posts/:id - Ažuriranje postojećeg posta
router.put('/:id', async (req, res) => {
  const { id } = req.params; 
  const { title, content } = req.body; 

  try 
  {
    const { error } = await supabase
      .from('posts')
      .update({ 
        title, 
        content, 
        updated_at: new Date().toISOString() // Postavljanje trenutnog vremena
      }) 
      .eq('id', id); 

    if (error) 
      {
      return res.status(500).json({ error: error.message });
      }

    return res.status(204).send(); 
  } 
  catch (err) 
  {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Došlo je do greške na serveru.' });
  }
});



// DELETE /api/posts/:id - Brisanje posta
router.delete('/:id', async (req, res) => {
  const { id } = req.params; 

  try {
    const { error } = await supabase
      .from('posts')
      .delete() // Brišemo post
      .eq('id', id); 

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (!error) 
      {
      return res.status(204).send(); 
    }
    
  } 
  catch (err) 
  {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Došlo je do greške na serveru.' });
  }
});



router.post('/', async (req, res) => {
  const { user_id, title, content } = req.body; 
  console.log('Received body:', req.body); 

  if (!user_id || !title || !content) {
    return res.status(400).json({ error: 'Please provide user_id, title, and content.' });
  }

  try 
  {
    const { error } = await supabase
      .from('posts')
      .insert([{ user_id, title, content }]);

    if (error) 
      {
      console.error('Insert error:', error); 
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Post created successfully.' }); 
  } 
  catch (err) 
  {
    console.error('Server error:', err); 
    res.status(500).json({ error: 'Došlo je do greške na serveru.' });
  }
});




module.exports = router;
