const { supabase } = require('../config/db');

// Funkcija za preuzimanje svih postova
async function getAllPosts()
 {
  return supabase.from('posts').select('*');
}

// Funkcija za preuzimanje posta po ID-ju
async function getPostById(id) 
{
  return supabase.from('posts').select('*').eq('id', id).single();
}

// Funkcija za kreiranje novog posta
async function createPost(post) 
{
  return supabase.from('posts').insert([post]);
}

// Funkcija za ažuriranje posta
async function updatePost(id, updatedPost) 
{
  return supabase.from('posts').update(updatedPost).eq('id', id);
}

// Funkcija za brisanje posta
async function deletePost(id) 
{
  return supabase.from('posts').delete().eq('id', id);
}

module.exports = 
{ 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost 
};
