import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import PostForm from '../components/PostForm';
import { fetchPosts, addPost, updatePost, deletePost } from '../api_calls/postApi';
import supabase from '../supabase/supabaseClient';
import '../styles/BlogPage.css'; 

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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      setErrorMessage('There was an issue fetching posts.');
    }
  };

  useEffect(() => {
    loadPosts();
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
       // setErrorMessage('Failed to get user information.');
      }
      setCurrentUserId(user ? user.id : null);
    };
    fetchUser();
  }, []);

  const handleAddPost = async (data: { title: string; content: string }) => {
    try {
      if (!currentUserId) {
        setErrorMessage('You must be logged in to add a post.');
        return;
      }
      await addPost({ ...data, user_id: currentUserId });
      loadPosts();
      setShowForm(false);
    } catch (error) {
      setErrorMessage('There was an issue adding the post.');
    }
  };

  const handleEditPost = async (data: { title: string; content: string }) => {
    if (editingPost) {
      try {
        await updatePost(editingPost.id, data);
        loadPosts();
        setEditingPost(null);
        setShowForm(false);
      } catch (error) {
        setErrorMessage('There was an issue updating the post.');
      }
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id);
      loadPosts();
    } catch (error) {
      setErrorMessage('There was an issue deleting the post.');
    }
  };

  // Debounce funkcija za pretragu
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        const filtered = posts.filter((post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) 
         
        );
        setFilteredPosts(filtered);
      } else {
        setFilteredPosts(posts);
      }
    }, 100); 

    return () => {
      clearTimeout(handler); 
    };
  }, [searchTerm, posts]);

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setShowForm(false);
  };


  const handleLogout = async () => {
    await supabase.auth.signOut(); 
    navigate('/signup'); 
  };

  return (
    <div className="blog-wrapper">
      <div className="header-buttons">
        <button className="nav-button" onClick={handleLogout}>Log Out</button>
      </div>
      <h1 className="blog-title">Blog Posts</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search posts by title or content"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="blog-search-bar"
      />

      {showForm ? (
        <PostForm
          initialData={editingPost || { title: '', content: '' }}
          onSubmit={editingPost ? handleEditPost : handleAddPost}
          buttonText={editingPost ? 'Update Post' : 'Add Post'}
          onClose={handleCancelEdit} 
        />
      ) : (
        <button className="add-post-button" onClick={() => setShowForm(true)}>
          Add New Post
        </button>
      )}

      {filteredPosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul className="blog-post-list">
          {filteredPosts.map((post) => (
            <li key={post.id} className="blog-post-item">
              <Link to={`/post/${post.id}`} className="blog-post-link">
                <h2>{post.title}</h2>
                <p>{post.user_email}</p>
                <p>{post.content}</p>
                <p className="blog-post-date">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </Link>
              {post.user_id === currentUserId && (
                <div className="blog-post-actions">
                  <button onClick={() => handleEditClick(post)}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogPage;
