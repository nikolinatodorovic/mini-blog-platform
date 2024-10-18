import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import supabase from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupPage.css'; 

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData: { email: string; password: string }) => {
    console.log('Login data:', formData);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        const user = data?.user;
        console.log('Logged in user:', user);
        navigate('/blog');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setErrorMessage('There was an issue logging in. Please try again.');
    }
  };

  return (
    <div className="signup-wrapper"> 
      <div className="signup-title"> 
        Login Form
      </div>
      <div className="signup-form">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <AuthForm type="login" onSubmit={handleLoginSubmit} />
      </div>
    </div>
  );
};

export default LoginPage;
