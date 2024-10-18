import React, { useEffect, useState } from 'react';  
import { Link } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { fetchPosts, addPost, updatePost, deletePost } from '../api_calls/postApi';
import supabase from '../supabase/supabaseClient';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string; 
  user_email: string;
}

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Za trenutno prijavljenog korisnika

  const loadPosts = async () => {
    try {
      const data = await fetchPosts(); 
      setPosts(data);
    } catch (error) {
      setErrorMessage('There was an issue fetching posts.');
    }
  };

  useEffect(() => {
    loadPosts();
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setErrorMessage('Failed to get user information.');
      }
      setCurrentUserId(user ? user.id : null);
    };
    fetchUser();
  }, []);

  // Dodaj novi post
  const handleAddPost = async (data: { title: string; content: string }) => {
    try {
      if (!currentUserId) {
        setErrorMessage('You must be logged in to add a post.'); // Da li je korisnik ulogovan
        return;
      }

      await addPost({ ...data, user_id: currentUserId }); 
      loadPosts(); // Ponovo učitaj postove nakon dodavanja
      setShowForm(false); // Sakrij formu
    } catch (error) {
      //setErrorMessage('There was an issue adding the post.');
    }
  };

  // Ažuriraj post
  const handleEditPost = async (data: { title: string; content: string }) => {
    if (editingPost) {
      try {
        await updatePost(editingPost.id, data);
        loadPosts(); // Ponovo učitaj postove nakon editovanja
        setEditingPost(null); // Resetuj editovanje
        setShowForm(false); // Sakrij formu
      } catch (error) {
        setErrorMessage('There was an issue updating the post.');
      }
    }
  };

  // Obrisi post
  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id);
      loadPosts(); // Ponovo učitaj postove nakon brisanja
    } catch (error) {
      setErrorMessage('There was an issue deleting the post.');
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setShowForm(false);
  };

  return (
    <div style={styles.container}>
      <h1>Blog Posts</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {showForm ? (
        <PostForm
          initialData={editingPost || { title: '', content: '' }}
          onSubmit={editingPost ? handleEditPost : handleAddPost}
          buttonText={editingPost ? 'Update Post' : 'Add Post'}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Add New Post</button>
      )}
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul style={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} style={styles.postItem}>
              <Link to={`/post/${post.id}`} style={styles.link}>
                <h2>{post.title}</h2>
                <p>{post.user_email}</p>
                <p>{post.content}</p>
                <p style={styles.date}>{new Date(post.created_at).toLocaleDateString()}</p>
              </Link>
              {post.user_id === currentUserId && ( // Da li je trenutni korisnik autor posta
                <>
                  <button onClick={() => handleEditClick(post)}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Stilovi
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center' as const,
  },
  postList: {
    listStyleType: 'none' as const,
    padding: 0,
  },
  postItem: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  date: {
    fontSize: '0.8rem',
    color: '#888',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
};

export default BlogPage;
