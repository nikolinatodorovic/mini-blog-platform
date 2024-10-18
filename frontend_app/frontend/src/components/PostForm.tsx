
import React, { useEffect, useState } from 'react';
import supabase from '../supabase/supabaseClient';

interface PostFormProps {
  initialData?: { id?: number; title: string; content: string }; // Prop za inicijalne podatke
  onSubmit: (data: { title: string; content: string }) => void; // Callback funkcija nakon submit-a
  buttonText: string; // Tekst na dugmetu
}

const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default PostForm;
