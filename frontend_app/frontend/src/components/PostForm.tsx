import React, { useState, useEffect } from 'react';
import '../styles/PostForm.css';

interface PostFormProps {
  initialData: { title: string; content: string };
  onSubmit: (data: { title: string; content: string }) => void;
  buttonText: string;
  onClose: () => void; 
}

const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit, buttonText, onClose }) => {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);

  useEffect(() => {
    setTitle(initialData.title);
    setContent(initialData.content);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <div className="post-form-wrapper">
      <form onSubmit={handleSubmit} className="post-form">
        <button type="button" className="close-button" onClick={onClose}>
          &times; {/* Oznaka za "X" */}
        </button>
        <h2 className="post-form-title">{buttonText === 'Update Post' ? 'Edit Post' : 'Add New Post'}</h2>
        <div className="input-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="textarea-field"
          />
        </div>
        <button type="submit" className="submit-button">{buttonText}</button>
      </form>
    </div>
  );
};

export default PostForm;
