import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComments, addComment, updateComment, deleteComment } from '../api_calls/postApi';
import supabase from '../supabase/supabaseClient';
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
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

   //const API_BASE_URL = 'http://localhost:3000/api/posts';
    const API_BASE_URL = 'https://mini-blog-backend-production.up.railway.app/api/posts';

  // Fetch post data
  const { data: post, isError: isPostError } = useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: async () => {
       const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Error fetching post');
      return response.json();
    },
  });

  // Fetch comments
  const { data: comments = [], isError: isCommentsError } = useQuery<Comment[], Error>({
    queryKey: ['comments', id],
    queryFn: () => fetchComments(Number(id)),
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUserId(data?.user?.id || null);
    };
    fetchUser();
  }, []);

  const addCommentMutation = useMutation({
    mutationFn: (newComment: { user_id: string; content: string }) => 
      addComment(Number(id), newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setNewComment('');
    },
    onError: (error) => {
      setErrorMessage('Error adding comment');
      console.log(errorMessage);
      console.error(error);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: (comment: { commentId: number; content: string }) => 
      updateComment(Number(id), comment.commentId, { content: comment.content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setEditingCommentId(null);
      setEditingCommentContent('');
    },
    onError: (error) => {
      setErrorMessage('Error updating comment');
      console.error(error);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(Number(id), commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
    onError: (error) => {
      setErrorMessage('Error deleting comment');
      console.error(error);
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim() || !userId) return;

    addCommentMutation.mutate({ user_id: userId, content: newComment });
  };

  const handleEditComment = (commentId: number) => {
    if (!editingCommentContent.trim()) return;

    updateCommentMutation.mutate({ commentId, content: editingCommentContent });
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
  };

  if (isPostError || isCommentsError) {
    return <p className="error-message">Error loading post or comments</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="post-page-container">
      <div className="header-buttons">
        <button className="nav-button" onClick={() => navigate('/signup')}>Log Out</button>
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
