import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient(); 

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.log('Error fetching user info:', error.message);
      }
      setCurrentUserId(user ? user.id : null);
    };
    fetchUser();
  }, []);

  const { data: posts = [], error } = useQuery<Post[], Error>({
    queryKey: ['posts'], 
    queryFn: fetchPosts,
  });

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // Paginacija logika
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const addPostMutation = useMutation({
    mutationFn: (newPost: { title: string; content: string; user_id: string }) => addPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setShowForm(false);
    },
    onError: (error) => {
      console.log('Error adding post:', error);
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: (updatedPost: { id: number; title: string; content: string }) => 
      updatePost(updatedPost.id, { title: updatedPost.title, content: updatedPost.content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setEditingPost(null);
      setShowForm(false);
    },
    onError: (error) => {
      console.log('Error updating post:', error);
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.log('Error deleting post:', error);
    }
  });

  const handleAddPost = async (data: { title: string; content: string }) => {
    if (!currentUserId) {
      console.log('User is not logged in');
      return;
    }
    addPostMutation.mutate({ title: data.title, content: data.content, user_id: currentUserId });
  };

  const handleEditPost = async (data: { title: string; content: string }) => {
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, title: data.title, content: data.content });
    }
  };

  const handleDeletePost = (id: number) => {
    deletePostMutation.mutate(id);
  };

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
    }, 300); 

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

  // Paginacija kontrole
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="blog-wrapper">
      <div className="header-buttons">
        <button className="nav-button" onClick={handleLogout}>Log Out</button>
      </div>
      <h1 className="blog-title">Blog Posts</h1>

      {error && <p className="error-message">{error.message}</p>}

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

      {currentPosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul className="blog-post-list">
          {currentPosts.map((post) => (
            <li key={post.id} className="blog-post-item">
              <Link to={`/post/${post.id}`} className="blog-post-link">
                <h2>{post.title}</h2>
                <p>{post.user_email}</p>
                <p>{post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}</p>
                <Link to={`/post/${post.id}`} className="read-more-link">Read More</Link>
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

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

    </div>
  );
};

export default BlogPage;
