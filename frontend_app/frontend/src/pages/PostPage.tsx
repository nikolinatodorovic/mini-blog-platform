import supabase from '../supabase/supabaseClient';
import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import { fetchComments, addComment, updateComment, deleteComment } from '../api_calls/postApi';
import axios from 'axios';


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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p style={{ color: 'red' }}>{errorMessage}</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div style={styles.container}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p style={styles.date}>{new Date(post.created_at).toLocaleDateString()}</p>

      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        <ul style={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} style={styles.commentItem}>
              {editingCommentId === comment.id ? (
                <div>
                  <input
                    type="text"
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)} 
                    placeholder="Edit comment..."
                  />
                  <button onClick={() => handleEditComment(comment.id)}>Save</button>
                  <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{comment.content}</p>
                  <p>{comment.user_email}</p>
                  <p style={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString()}</p>
                  {comment.user_id === userId && ( 
                    <>
                      <button onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingCommentContent(comment.content);
                      }}>Edit</button>
                      <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)} 
        placeholder="Write a comment..."
      />
      <button onClick={handleAddComment}>Add Comment</button>
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
  date: {
    fontSize: '0.8rem',
    color: '#888',
  },
  commentList: {
    listStyleType: 'none' as const,
    padding: 0,
  },
  commentItem: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  },
  commentDate: {
    fontSize: '0.8rem',
    color: '#888',
  },
};

export default PostPage;
