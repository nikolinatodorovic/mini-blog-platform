import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import supabase from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData: { email: string; password: string }) => {
    console.log('Login data:', formData);
    try {
      // Autentifikacija putem Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMessage(error.message); 
      } else {
        const user = data?.user; 
        console.log('Logged in user:', user);
        navigate('/blog'); // Preusmjeravanje na stranicu sa blogovima
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setErrorMessage('There was an issue logging in. Please try again.'); 
    }
  };

  return (
    <div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <AuthForm
        type="login"
        onSubmit={handleLoginSubmit}
      />
    </div>
  );
};

export default LoginPage;
