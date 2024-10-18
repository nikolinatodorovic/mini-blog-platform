import supabase from '../supabase/supabaseClient';
import React, { useEffect, useState } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { fetchComments, addComment, updateComment, deleteComment } from '../api_calls/postApi';
import axios from 'axios';
import '../styles/PostPage.css'; 

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  user_email: string;
}

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate(); 
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        
        const postResponse = await axios.get(`http://localhost:3000/api/posts/${id}`);
        setPost(postResponse.data);
        
        const commentsData = await fetchComments(Number(id));
        setComments(commentsData);

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error; 
        setUserId(data?.user?.id || null); 
      } catch (error) {
        setErrorMessage('Error loading post or comments');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !userId) return; 

    try {
      await addComment(Number(id), { user_id: userId, content: newComment });
      const updatedComments = await fetchComments(Number(id));
      setComments(updatedComments);
      setNewComment(''); 
    } catch (error) {
      setErrorMessage('Error adding comment');
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editingCommentContent.trim()) return;

    try {
      await updateComment(Number(id), commentId, { content: editingCommentContent });
      const updatedComments = await fetchComments(Number(id));
      setComments(updatedComments);
      setEditingCommentId(null); 
      setEditingCommentContent(''); 
    } catch (error) {
      setErrorMessage('Error updating comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(Number(id), commentId);
      const updatedComments = await fetchComments(Number(id));
      setComments(updatedComments);
    } catch (error) {
      setErrorMessage('Error deleting comment');
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut(); 
    navigate('/signup'); 
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="post-page-container">
      <div className="header-buttons">
        <button className="nav-button" onClick={handleLogout}>Log Out</button>
        <br />
        <Link to="/blog" className="nav-link">View All Posts</Link>
      </div>

      <h1 className="post-title">{post.title}</h1>
      <p className="post-content">{post.content}</p>
      <p className="post-date">{new Date(post.created_at).toLocaleDateString()}</p>

      <h2 className="comments-title">Comments</h2>
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              {editingCommentId === comment.id ? (
                <div className="comment-edit">
                  <input
                    type="text"
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)} 
                    placeholder="Edit comment..."
                    className="comment-input"
                  />
                  <button className="comment-button" onClick={() => handleEditComment(comment.id)}>Save</button>
                  <button className="comment-button" onClick={() => setEditingCommentId(null)}>Cancel</button>
                </div>
              ) : (
                <div className="comment-content">
                  <p>{comment.content}</p>
                  <p className="comment-user-email">{comment.user_email}</p>
                  <p className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</p>
                  {comment.user_id === userId && ( 
                    <div className="comment-actions">
                      <button className="comment-button" onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingCommentContent(comment.content);
                      }}>Edit</button>
                      <button className="comment-button" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="add-comment-container">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)} 
          placeholder="Write a comment..."
          className="comment-input"
        />
        <button className="comment-button" onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default PostPage;
