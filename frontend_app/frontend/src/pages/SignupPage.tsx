import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import supabase from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupPage.css';

const SignupPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignupSubmit = async (formData: { fullName?: string; email: string; password: string }) => {
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName || '',
          },
        },
      });

      if (signupError) {
        setErrorMessage(signupError.message);
        return;
      }
      const user = data.user; 

      if (user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: user.id, email: formData.email }]);

        if (insertError) {
          console.error('Error inserting user into database:', insertError);
          setErrorMessage('Failed to save user data. Please try again.');
          return;
        }
      }
      navigate('/login');
    } catch (err) {
      console.error('Error signing up:', err);
      setErrorMessage('There was an issue signing up. Please try again.');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-title">Sign Up Form</div>
      <div className="signup-form">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <AuthForm type="signup" onSubmit={handleSignupSubmit} />
      </div>
    </div>
  );
};

export default SignupPage;
