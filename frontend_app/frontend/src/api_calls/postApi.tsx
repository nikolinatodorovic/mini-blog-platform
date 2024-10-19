import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/posts';

// Dodavanje novog posta
export const addPost = async (data: { user_id: string; title: string; content: string }) => {
    try {
      const response = await axios.post(API_BASE_URL, data); // Poziva POST /api/posts
      return response.data;
    } catch (error) {
      throw new Error('Error adding post');
    }
  };

// Dohvatanje svih postova
export const fetchPosts = async () => {
  try {
    const response = await axios.get(API_BASE_URL); // Poziva GET /api/posts
    return response.data;
  } catch (error) {
   // throw new Error('Error fetching posts');
  }
};

// Ažuriranje posta
export const updatePost = async (id: number, data: { title: string; content: string }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data); // Poziva PUT /api/posts/:id
    return response.data;
  } catch (error) {
    throw new Error('Error updating post');
  }
};

// Brisanje posta
export const deletePost = async (id: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`); // Poziva DELETE /api/posts/:id
  } catch (error) {
    throw new Error('Error deleting post');
  }
};


// Dohvatanje komentara za post
export const fetchComments = async (postId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${postId}/comments`); // Poziva GET /api/posts/:id/comments
    return response.data;
  } catch (error) {
    throw new Error('Error fetching comments');
  }
};
/*
export const addComment = async (postId: number, data: string): Promise<Comment> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${postId}/comments`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error adding comment');
  }
};*/

export const addComment = async (
  postId: number,
  data: { user_id: string; content: string } // Korisnički id i sadržaj kao objekat
): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/${postId}/comments`, data); // Očekuje se da server vrati 204 No Content
  } catch (error) {
    console.error('Error adding comment:', error);
   // throw new Error('Error adding comment: ' + error.message);
  }
};



// Ažuriranje komentara
export const updateComment = async (
  postId: number,
  commentId: number,
  commentData: { content: string }
): Promise<Comment> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${postId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating comment');
  }
};

// Brisanje komentara
export const deleteComment = async (postId: number, commentId: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${postId}/comments/${commentId}`);
  } catch (error) {
    throw new Error('Error deleting comment');
  }
};