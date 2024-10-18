import React from 'react';
import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import  supabase  from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignupSubmit = async (formData: { fullName?: string; email: string; password: string }) => {
    try {
      // Supabase sign up korisnika putem e-maila i lozinke
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName || '',
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
 
        navigate('/login');
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setErrorMessage('There was an issue signing up. Please try again.');
    }
  };

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) 
    {
    console.error('Error signing out:', error.message);
  } 
  else
   {
    console.log('User signed out successfully');

  }
};

  return (
    <div>
      <h2>Create Account</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <AuthForm type="signup" onSubmit={handleSignupSubmit} />
    </div>
  );
};

export default SignupPage;
